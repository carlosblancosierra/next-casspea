import { addDays, isBefore, isWeekend, parseISO, startOfDay } from 'date-fns';
import { SUMMER_BREAK_ENABLED } from '@/utils/storeStatus';

/**
 * Shared answer to "when can we actually post this?".
 *
 * Three components used to each carry their own version of this — the cart's
 * date form (weekday + a hardcoded August window), the checkout options list
 * (an inline cutoff IIFE), and the store pickup picker (a private London
 * clock). They disagreed in small ways, which is how the cart could offer a
 * date the options list then ignored.
 */

/** Orders placed after this hour (London) go out the next working day. */
const SHIPPING_CUTOFF_HOUR = 10;

/**
 * Bank-holiday / heat delay: everything placed before this date ships on it.
 * Currently in the past, so it is inert — bump the date to re-arm it, and the
 * banners in CheckoutShippingOptions and CheckoutConfirm come back with it.
 */
export const HOLIDAY_SHIP_DATE = new Date('2026-05-26T00:00:00+01:00');

// The break itself, kept in step with SUMMER_BREAK_ENABLED so the campaign has
// one switch rather than a second copy of the dates living in a date picker.
const SUMMER_BREAK_START = new Date('2026-08-01T00:00:00');
const SUMMER_BREAK_END = new Date('2026-09-01T00:00:00'); // exclusive

/**
 * "Now", as the London store sees it.
 *
 * Deriving London's DST from the *browser's* UTC offset is only ever right by
 * luck for a visitor outside the UK, and it decides both which day counts as
 * today and whether the cutoff has passed. The returned date is a local Date
 * standing for the London calendar day — only its date parts are meaningful.
 */
export function getLondonNow(now: Date = new Date()): { date: Date; hour: number } {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
    }).formatToParts(now);

    const get = (type: string) => Number(parts.find(part => part.type === type)?.value ?? '0');
    return {
        date: new Date(get('year'), get('month') - 1, get('day')),
        hour: get('hour'),
    };
}

/** A day we could hand a parcel to Royal Mail on. */
export function isShippingDay(date: Date): boolean {
    if (isWeekend(date)) return false;
    if (SUMMER_BREAK_ENABLED) {
        const day = startOfDay(date);
        if (day >= SUMMER_BREAK_START && day < SUMMER_BREAK_END) return false;
    }
    return true;
}

/** The next shipping day strictly after `date`. */
export function nextShippingDay(date: Date): Date {
    let day = addDays(startOfDay(date), 1);
    while (!isShippingDay(day)) day = addDays(day, 1);
    return day;
}

/** The soonest we could get an order into the post. */
export function getEarliestDispatch(now: Date = new Date()): Date {
    if (now < HOLIDAY_SHIP_DATE) return startOfDay(HOLIDAY_SHIP_DATE);

    const { date: today, hour } = getLondonNow(now);
    const candidate = hour < SHIPPING_CUTOFF_HOUR ? today : addDays(today, 1);
    return isShippingDay(candidate) ? candidate : nextShippingDay(candidate);
}

/** `count` shipping days from `from` onwards, including `from` if it is one. */
export function getNextShippingDays(from: Date, count = 14): Date[] {
    const days: Date[] = [];
    let day = startOfDay(from);
    while (days.length < count) {
        if (isShippingDay(day)) days.push(new Date(day));
        day = addDays(day, 1);
    }
    return days;
}

type FixedDispatchItem = {
    product?: { name?: string; fixed_dispatch_date?: string | null } | null;
};

export type FixedDispatch = {
    /** The day the whole order is posted. */
    date: Date;
    /** Name of the product that pins it, for "Your Advent Calendar is posted on…". */
    productName: string;
    /** True when other items are travelling with it, which is worth saying. */
    mixed: boolean;
};

/**
 * The day this cart must be posted, or null when the customer is free to choose.
 *
 * A product with fixed_dispatch_date leaves on that exact day — the advent
 * calendars go out as one batch so they arrive before 1 December. The backend
 * enforces the same rule (Cart.fixed_dispatch_date); this is the copy the
 * checkout reads so it can stop asking questions whose answer is decided.
 *
 * - The EARLIEST future date wins in a mixed cart: everything goes together,
 *   and the earliest is the one that still arrives in time.
 * - A date before today is ignored. It is a seasonal setting someone will
 *   forget to clear, and forcing a posting day in the past is worse than asking.
 * - parseISO, not `new Date(str)`: a bare yyyy-MM-dd parsed by Date is UTC
 *   midnight, which is the previous day anywhere west of London.
 */
export function getFixedDispatch(
    items: FixedDispatchItem[],
    today: Date = startOfDay(getLondonNow().date),
): FixedDispatch | null {
    let best: { date: Date; productName: string } | null = null;

    for (const item of items) {
        const raw = item.product?.fixed_dispatch_date;
        if (!raw) continue;
        const date = startOfDay(parseISO(raw));
        if (Number.isNaN(date.getTime()) || isBefore(date, today)) continue;
        if (!best || isBefore(date, best.date)) {
            best = { date, productName: item.product?.name ?? 'order' };
        }
    }

    if (!best) return null;

    // Something is travelling on a day it did not ask for: an ordinary item, or
    // a second fixed item with a later date that goes out early with this one.
    // Two of the same calendar is not mixed.
    const chosen = best.date.getTime();
    const mixed = items.some(item => {
        const raw = item.product?.fixed_dispatch_date;
        if (!raw) return true;
        const date = startOfDay(parseISO(raw));
        return Number.isNaN(date.getTime()) || isBefore(date, today) || date.getTime() !== chosen;
    });

    return { ...best, mixed };
}
