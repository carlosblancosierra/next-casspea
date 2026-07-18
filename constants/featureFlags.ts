/**
 * Feature flags.
 *
 * NEW_SHIPPING_FLOW moves the shipping date from the cart page to the
 * shipping step (ASAP / pick a date + guaranteed vs estimated delivery).
 *
 * Rollout:
 * - While NEW_SHIPPING_FLOW_LIVE is false, everyone gets the old flow.
 *   Visiting /cart2 turns on a browser-local preview of the new flow
 *   (stored in localStorage, so it survives the whole checkout).
 * - To launch for everyone, flip NEW_SHIPPING_FLOW_LIVE to true and deploy.
 */
export const NEW_SHIPPING_FLOW_LIVE = false;

const PREVIEW_STORAGE_KEY = 'casspea-new-shipping-preview';

export const isNewShippingFlow = (live: boolean = NEW_SHIPPING_FLOW_LIVE): boolean => {
    if (live) return true;
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(PREVIEW_STORAGE_KEY) === '1';
    } catch {
        return false;
    }
};

export const enableNewShippingPreview = (): void => {
    try {
        window.localStorage.setItem(PREVIEW_STORAGE_KEY, '1');
    } catch {
        // localStorage unavailable (private mode): preview simply won't stick
    }
};

export const disableNewShippingPreview = (): void => {
    try {
        window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
    } catch {
        // ignore
    }
};
