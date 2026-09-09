import { addDays, isWeekend, startOfDay } from 'date-fns';
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
