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
const ATTRIBUTION_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'] as const;
/** How long a touch counts: an ad click older than this no longer gets credit. */
export const ATTRIBUTION_WINDOW_DAYS = 30;
const ATTRIBUTION_WINDOW_MS = ATTRIBUTION_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

/** One visit that arrived with UTM parameters or an ad click id. */
export interface AttributionTouch extends Attribution {
    /** Path the visitor landed on, without the query string. */
    landing_path?: string;
    /** When the visit happened, ISO 8601 (UTC). */
    touched_at: string;
}

/** First and last campaign touch inside the attribution window. */
export interface AttributionTouches {
    first_touch: AttributionTouch | null;
    last_touch: AttributionTouch | null;
}

interface CookiebotWindow {
    Cookiebot?: { consent?: { statistics?: boolean } };
}

/** Whether the visitor accepted statistics cookies in Cookiebot. */
export function hasStatisticsConsent(): boolean {
    if (typeof window === 'undefined') return false;
    return (window as unknown as CookiebotWindow).Cookiebot?.consent?.statistics === true;
}

const isFresh = (touch: AttributionTouch | null | undefined, now: number): touch is AttributionTouch => {
    if (!touch?.touched_at) return false;
    const at = Date.parse(touch.touched_at);
    return Number.isFinite(at) && now - at < ATTRIBUTION_WINDOW_MS;
};

const withoutMeta = (touch: AttributionTouch | null): Attribution => {
    if (!touch) return {};
    const params: Attribution = {};
    for (const key of ATTRIBUTION_PARAMS) if (touch[key]) params[key] = touch[key];
    return params;
};

function readTouches(storage: Storage | null): AttributionTouches {
    try {
        const raw = storage?.getItem(ATTRIBUTION_KEY);
        if (!raw) return { first_touch: null, last_touch: null };
        const parsed = JSON.parse(raw) as Partial<AttributionTouches>;
        return { first_touch: parsed.first_touch ?? null, last_touch: parsed.last_touch ?? null };
    } catch {
        return { first_touch: null, last_touch: null };
    }
}

/**
 * Where the touches live. With statistics consent they are kept for 30 days in
 * localStorage, so a click from last week still gets credit for today's sale.
 * Without it they stay in sessionStorage, as before, and localStorage is never
 * read or written.
 */
function attributionStorage(): { storage: Storage | null; persistent: boolean } {
    const persistent = hasStatisticsConsent();
    try {
        return { storage: persistent ? window.localStorage : window.sessionStorage, persistent };
    } catch {
        return { storage: null, persistent };
    }
}

/**
 * The campaigns the visitor arrived from. Ads land on one page and the sale
 * happens pages (or days) later, after the query string is gone, so each visit
 * that carries UTM / click ids is remembered:
 *
 * - first touch: the first one inside the 30-day window. Later visits never
 *   replace it; it only starts again once it is older than 30 days.
 * - last touch: the latest one. Every new set of parameters replaces it.
 */
export function getAttributionTouches(): AttributionTouches {
    if (typeof window === 'undefined') return { first_touch: null, last_touch: null };
    const now = Date.now();

    const fromUrl: Attribution = {};
    let landingPath: string | undefined;
    try {
        const params = new URLSearchParams(window.location.search);
        for (const key of ATTRIBUTION_PARAMS) {
            const value = params.get(key);
            if (value) fromUrl[key] = value.slice(0, 200);
        }
        landingPath = window.location.pathname;
    } catch {
        // No URL to read: fall through to the stored touches.
    }

    const { storage, persistent } = attributionStorage();
    const stored = readTouches(storage);
    // A visitor who just accepted cookies keeps what this session already saw.
    if (persistent && !stored.first_touch && !stored.last_touch) {
        try {
            const session = readTouches(window.sessionStorage);
            stored.first_touch = session.first_touch;
            stored.last_touch = session.last_touch;
        } catch {
            // sessionStorage blocked: nothing to carry over.
        }
    }

    let last = isFresh(stored.last_touch, now) ? stored.last_touch : null;
    let first = isFresh(stored.first_touch, now) ? stored.first_touch : last;

    if (Object.keys(fromUrl).length) {
        const touch: AttributionTouch = { ...fromUrl, landing_path: landingPath, touched_at: new Date(now).toISOString() };
        last = touch;
        if (!first) first = touch;
    }

    const touches: AttributionTouches = { first_touch: first, last_touch: last };
    try {
        if (storage && (first || last)) storage.setItem(ATTRIBUTION_KEY, JSON.stringify(touches));
        else storage?.removeItem(ATTRIBUTION_KEY);
        if (persistent) window.sessionStorage.removeItem(ATTRIBUTION_KEY);
    } catch {
        // Storage blocked: the touches still go out with this event.
    }
    return touches;
}

/** The last touch's UTM / click ids, as sent to the GTM dataLayer. */
export function getAttribution(): Attribution {
    return withoutMeta(getAttributionTouches().last_touch);
}

/**
 * Forget the 30-day touches when statistics consent is withdrawn. The session
 * copy is untouched: it ends with the tab, as it did before consent.
 */
export function forgetPersistentAttribution(): void {
    try {
        window.localStorage.removeItem(ATTRIBUTION_KEY);
    } catch {
        // Nothing stored, or storage blocked.
    }
}

/** Events whose PostHog payload carries first / last touch properties. */
const ATTRIBUTED_EVENTS = new Set(['begin_checkout', 'purchase']);

/**
 * Flat properties for PostHog. Stripe's hosted page is a redirect away, so on
 * `purchase` PostHog's own $referring_domain is checkout.stripe.com: these are
 * what says which campaign the sale came from.
 */
export function attributionProperties(touches: AttributionTouches = getAttributionTouches()): Properties {
    const first = touches.first_touch;
    const last = touches.last_touch;
    const properties: Properties = {
        first_utm_source: first?.utm_source,
        first_utm_medium: first?.utm_medium,
        first_utm_campaign: first?.utm_campaign,
        first_gclid: first?.gclid,
        first_fbclid: first?.fbclid,
        last_utm_source: last?.utm_source,
        last_utm_medium: last?.utm_medium,
        last_utm_campaign: last?.utm_campaign,
    };
    for (const key of Object.keys(properties)) if (properties[key] === undefined) delete properties[key];
    return properties;
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
        if (isAnalyticsEnabled()) {
            posthog.capture(
                event,
                ATTRIBUTED_EVENTS.has(event) ? { ...properties, ...attributionProperties() } : properties,
            );
        }
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
