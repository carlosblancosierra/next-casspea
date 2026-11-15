import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';

/**
 * One place every tracked event goes through.
 *
 * Each event is sent to PostHog (product analytics, replays, errors) and, for
 * the GA4 ecommerce events Google Ads bids on, to gtag and to the GTM
 * dataLayer (GTM-TWQTXVNR) as well. Tracking must
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

/** The GA4 events GTM reads as `ecommerce` objects; the rest go flat. */
const ECOMMERCE_EVENTS = new Set(['view_item', 'add_to_cart', 'remove_from_cart', 'begin_checkout', 'purchase']);

const PENDING_PURCHASE_KEY = 'casspea_pending_purchase';
const ATTRIBUTION_KEY = 'casspea_attribution';
const ATTRIBUTION_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

/**
 * The campaign the visitor arrived from. Ads land on one page and the sale
 * happens pages later, after the query string is gone, so the first set of
 * UTM / click ids seen in the session is kept and sent with every event. A
 * later visit with new parameters replaces it: the latest campaign wins.
 */
export function getAttribution(): Attribution {
    if (typeof window === 'undefined') return {};
    const fromUrl: Attribution = {};
    try {
        const params = new URLSearchParams(window.location.search);
        for (const key of ATTRIBUTION_PARAMS) {
            const value = params.get(key);
            if (value) fromUrl[key] = value.slice(0, 200);
        }
    } catch {
        // No URL to read: fall through to the stored one.
    }
    try {
        if (Object.keys(fromUrl).length) {
            window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(fromUrl));
            return fromUrl;
        }
        const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY);
        return stored ? (JSON.parse(stored) as Attribution) : {};
    } catch {
        return fromUrl;
    }
}

/**
 * GTM's dataLayer, in the shape its GA4 ecommerce triggers expect. gtag()
 * also writes to the dataLayer, but as `arguments` that GTM triggers ignore,
 * so the events are pushed again as plain objects. The ecommerce object is
 * cleared first, as Google asks, so one event's items never leak into the
 * next.
 */
function pushDataLayer(event: string, properties: Properties): void {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    const attribution = getAttribution();
    if (ECOMMERCE_EVENTS.has(event)) {
        w.dataLayer.push({ ecommerce: null });
        w.dataLayer.push({ event, ecommerce: properties, attribution });
    } else {
        w.dataLayer.push({ event, ...properties, attribution });
    }
}

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
        if (GA4_EVENTS.has(event)) {
            gtag('event', event, properties);
            pushDataLayer(event, properties);
        }
    } catch {
        // A lost event must never fail a customer action.
    }
}

/** Report a caught error to Sentry and PostHog. Each is a no-op without its key. */
export function captureError(error: unknown, properties: Properties = {}): void {
    try {
        Sentry.captureException(error, { extra: properties });
    } catch {
        // ignore
    }
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
