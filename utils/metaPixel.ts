/**
 * Meta (Facebook / Instagram) pixel events.
 *
 * The pixel itself is loaded elsewhere — today by the old agency's GTM
 * container, which only sends PageView. Its Purchase tag still listens on
 * /orders/success, a URL the shop no longer has, so Meta has never seen a
 * sale. This sends the shopping events from the code instead.
 *
 * Events go with trackSingle to our pixel only, and wait until something has
 * initialised it: sending before `init` would be dropped, and loading a second
 * copy of the pixel here would double every PageView.
 */

export const META_PIXEL_ID = '854317092525657';

type Fbq = (...args: unknown[]) => void;

interface MetaWindow {
    fbq?: Fbq;
    /** Set by the GTM pixel template once it has called init. */
    _fbq_gtm_ids?: string[];
    /** Set by our own loader once it has called init. */
    __casspeaMetaPixelReady?: boolean;
}

/** GA4 event → Meta standard event. Anything not listed is not sent to Meta. */
const META_EVENTS: Record<string, string> = {
    view_item: 'ViewContent',
    add_to_cart: 'AddToCart',
    begin_checkout: 'InitiateCheckout',
    purchase: 'Purchase',
    generate_lead: 'Lead',
};

const READY_POLL_MS = 250;
const READY_TIMEOUT_MS = 10_000;

const isPixelReady = (w: MetaWindow): boolean =>
    typeof w.fbq === 'function' &&
    (!!w.__casspeaMetaPixelReady || (w._fbq_gtm_ids ?? []).includes(META_PIXEL_ID));

function whenPixelReady(callback: (fbq: Fbq) => void): void {
    const w = window as unknown as MetaWindow;
    const started = Date.now();
    const attempt = () => {
        if (isPixelReady(w)) return callback(w.fbq as Fbq);
        // Blocked by an ad blocker or by consent: give up quietly.
        if (Date.now() - started < READY_TIMEOUT_MS) window.setTimeout(attempt, READY_POLL_MS);
    };
    attempt();
}

interface ItemLike {
    item_id?: string;
    quantity?: number;
    price?: number;
}

/** Translate GA4-shaped properties into Meta's custom data. */
export function toMetaParams(properties: Record<string, unknown>): Record<string, unknown> {
    const items = Array.isArray(properties.items) ? (properties.items as ItemLike[]) : [];
    const params: Record<string, unknown> = {};
    if (typeof properties.value === 'number') params.value = properties.value;
    if (typeof properties.currency === 'string') params.currency = properties.currency;
    if (items.length) {
        params.content_type = 'product';
        params.content_ids = items.map((item) => item.item_id).filter(Boolean);
        params.contents = items.map((item) => ({
            id: item.item_id,
            quantity: item.quantity ?? 1,
            item_price: item.price,
        }));
        params.num_items = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    }
    return params;
}

/**
 * Send a GA4-named event to Meta if it has a Meta equivalent. The purchase's
 * transaction id doubles as Meta's eventID, so a future server-side
 * (Conversions API) purchase would deduplicate against this one.
 */
export function trackMeta(event: string, properties: Record<string, unknown> = {}): void {
    const metaEvent = META_EVENTS[event];
    if (!metaEvent || typeof window === 'undefined') return;
    const params = toMetaParams(properties);
    const eventId = typeof properties.transaction_id === 'string' ? properties.transaction_id : undefined;
    whenPixelReady((fbq) => {
        try {
            fbq('trackSingle', META_PIXEL_ID, metaEvent, params, eventId ? { eventID: eventId } : undefined);
        } catch {
            // A lost event must never fail a customer action.
        }
    });
}
