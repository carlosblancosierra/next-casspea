/**
 * Black Friday 2026 on the front end.
 *
 * The discount codes themselves live in the backend (Django admin), with their
 * own start and end dates, so the backend is what actually decides whether a
 * code works. This file only decides what the site says, and when.
 *
 * Public pre-sale: 15% off everything, from Saturday 21 November until Black
 * Friday starts on Friday 27 November at 00:00. London is on GMT in November,
 * so London time equals UTC here.
 *
 * Only the pre-sale is described in this file on purpose. Whatever runs from
 * the 27th is not mentioned anywhere in the bundle, so nobody can read it in
 * the page source before it starts. Once the pre-sale ends, the announcement
 * bar goes back to its usual copy until the Black Friday phase is added here.
 *
 * `code` must match the code created in Django admin exactly.
 */

export const BLACK_FRIDAY_ENABLED = true;

export interface Promo {
    id: string;
    /** Short label shown first in the bar. */
    label: string;
    /** The offer itself, in British English. */
    headline: string;
    code: string;
    startsAt: string;
    endsAt: string;
}

export const PRE_BLACK_FRIDAY: Promo = {
    id: 'pre-black-friday-2026',
    label: 'Pre-Black Friday',
    headline: '15% off everything',
    code: 'PREBLACK15',
    startsAt: '2026-11-21T00:00:00Z',
    endsAt: '2026-11-27T00:00:00Z',
};

const PROMOS: Promo[] = [PRE_BLACK_FRIDAY];

/** The promo running at `now`, or null when none is. Start inclusive, end exclusive. */
export function getActivePromo(now: Date = new Date()): Promo | null {
    if (!BLACK_FRIDAY_ENABLED) return null;
    const t = now.getTime();
    return (
        PROMOS.find(p => t >= new Date(p.startsAt).getTime() && t < new Date(p.endsAt).getTime()) ?? null
    );
}
