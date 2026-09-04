// Summer Break store closure.
//
// The backend (`GET /api/checkout/store-status/`) is the source of truth and the
// only thing that actually blocks orders. These constants are a client-side
// fallback so the UI still gates correctly if that request hasn't resolved yet.
// Keep them in sync with `STORE_ORDER_DEADLINE` / `STORE_REOPEN_LABEL` in the
// backend settings.

// Master switch for the whole Summer Break campaign on the front end: the promo
// popup, the home banner/boxes, the shop "Summer Break Boxes" card + link, the
// /landing/summer-break page, and the store-closed checkout gate all key off this.
// The break is over, so it's OFF — the shop sells normally and none of the summer
// UI shows. Every bit of the code is kept: flip this back to `true` (and refresh
// STORE_ORDER_DEADLINE / STORE_REOPEN_LABEL below) to run the campaign again.
export const SUMMER_BREAK_ENABLED = false;

// Friday 31 July 2026, 12:00 noon UK time (BST, +01:00).
export const STORE_ORDER_DEADLINE = '2026-07-31T12:00:00+01:00';
export const STORE_REOPEN_LABEL = 'the first week of September';

/** Deadline as a Date, or null if disabled. */
export function getStoreDeadline(deadlineIso?: string | null): Date | null {
    const raw = deadlineIso ?? STORE_ORDER_DEADLINE;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
}

/** True while the shop is still accepting orders. */
export function isStoreOpen(deadlineIso?: string | null, now: Date = new Date()): boolean {
    // Campaign disabled → the shop is always open.
    if (!SUMMER_BREAK_ENABLED) return true;
    const deadline = getStoreDeadline(deadlineIso);
    if (!deadline) return true;
    return now <= deadline;
}
