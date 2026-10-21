import posthog from 'posthog-js';

/**
 * One place every tracked event goes through.
 *
 * Each event is sent to PostHog (product analytics, replays, errors) and, for
 * the GA4 ecommerce events Google Ads bids on, to gtag as well. Tracking must
 * never break the shop: every call is a no-op on the server, without a
 * PostHog key, or if a vendor script was blocked.
 *
 * The full list of events and their properties lives in docs/analytics.md —
 * add new ones there too.
 */

export const CURRENCY = 'GBP';

/** GA4 ecommerce item shape, also sent to PostHog so both tools agree. */
export interface AnalyticsItem {
    item_id: string;
    item_name: string;
    item_category?: string;
    price?: number;
    quantity?: number;
}

type Properties = Record<string, unknown>;

/** Events GA4 / Google Ads understand natively; everything else stays in PostHog. */
const GA4_EVENTS = new Set([
    'view_item',
    'add_to_cart',
    'remove_from_cart',
    'begin_checkout',
    'purchase',
    'login',
    'generate_lead',
]);

const PENDING_PURCHASE_KEY = 'casspea_pending_purchase';

export const isAnalyticsEnabled = (): boolean =>
    typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

const gtag = (...args: unknown[]) => {
    const fn = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof fn === 'function') fn(...args);
};

export function track(event: string, properties: Properties = {}): void {
    if (typeof window === 'undefined') return;
    try {
        if (isAnalyticsEnabled()) posthog.capture(event, properties);
        if (GA4_EVENTS.has(event)) gtag('event', event, properties);
    } catch {
        // A lost event must never fail a customer action.
    }
}

export function captureError(error: unknown, properties: Properties = {}): void {
    if (!isAnalyticsEnabled()) return;
    try {
        posthog.captureException(error, properties);
    } catch {
        // ignore
    }
}

/** Parse an API money string ("14.99") without ever producing NaN. */
export const toAmount = (value: string | number | null | undefined): number => {
    const amount = typeof value === 'number' ? value : parseFloat(value ?? '');
    return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
};

interface CartItemLike {
    product: { id: number; name: string; category?: { name?: string } };
    quantity: number;
    discounted_price?: string;
    base_price?: string;
}

/** Map a cart line from the API to a GA4 item. Prices are per line, so divide by quantity. */
export function toAnalyticsItem(item: CartItemLike): AnalyticsItem {
    const quantity = item.quantity || 1;
    const lineTotal = toAmount(item.discounted_price ?? item.base_price);
    return {
        item_id: String(item.product.id),
        item_name: item.product.name,
        item_category: item.product.category?.name,
        price: toAmount(lineTotal / quantity),
        quantity,
    };
}

export interface PendingPurchase {
    value: number;
    currency: string;
    items: AnalyticsItem[];
    coupon?: string;
}

/**
 * Stripe's hosted page is a full navigation away, and the success page only
 * gets a session id back. So the basket is remembered just before leaving and
 * read once on return — which also stops a reload of the success page from
 * reporting the same purchase twice.
 */
export function rememberPendingPurchase(purchase: PendingPurchase): void {
    try {
        window.sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(purchase));
    } catch {
        // Storage blocked: the purchase is still reported, just without value.
    }
}

export function consumePendingPurchase(): PendingPurchase | null {
    try {
        const raw = window.sessionStorage.getItem(PENDING_PURCHASE_KEY);
        if (!raw) return null;
        window.sessionStorage.removeItem(PENDING_PURCHASE_KEY);
        return JSON.parse(raw) as PendingPurchase;
    } catch {
        return null;
    }
}
