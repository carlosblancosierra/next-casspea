import { addBusinessDays, startOfDay } from 'date-fns';

/**
 * Single source of truth for CassPea dispatch rules:
 * - Orders ship Monday to Friday only.
 * - Orders placed before 10am UK time on a business day ship the same day;
 *   anything later ships the next business day.
 * - Delivery = ship date + the courier's transit time (business days). When a
 *   courier's min and max transit days are equal the delivery day is a firm
 *   commitment (e.g. Royal Mail Special Delivery); otherwise it is a range.
 */
export const SHIPPING_CUTOFF_HOUR = 10;

export interface DispatchHold {
    /** Last order moment covered by the hold. */
    cutoff: Date;
    /** Date those orders will actually ship. */
    shipDate: Date;
    /** Customer-facing explanation shown at checkout. */
    message: string;
}

/**
 * Optional dispatch hold for bank holidays / heatwaves. When set, every order
 * placed on or before `cutoff` ships on `shipDate` and checkout shows
 * `message`. Set back to null once the hold has passed.
 *
 * Last used: Spring Bank Holiday hold, orders up to 25 May 2026 shipped on
 * Tue 26 May 2026.
 */
export const DISPATCH_HOLD: DispatchHold | null = null;

const getUkHour = (date: Date): number =>
    parseInt(
        new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            hourCycle: 'h23',
            timeZone: 'Europe/London',
        }).format(date),
        10,
    );

export const isBusinessDay = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

export const isDispatchHoldActive = (
    now: Date = new Date(),
    hold: DispatchHold | null = DISPATCH_HOLD,
): hold is DispatchHold => hold !== null && now.getTime() <= hold.cutoff.getTime();

/** True while same-day dispatch is still possible for an ASAP order. */
export const canShipToday = (
    now: Date = new Date(),
    hold: DispatchHold | null = DISPATCH_HOLD,
): boolean =>
    !isDispatchHoldActive(now, hold) &&
    isBusinessDay(now) &&
    getUkHour(now) < SHIPPING_CUTOFF_HOUR;

/** Date an ASAP order leaves our kitchen. */
export const getEarliestShipDate = (
    now: Date = new Date(),
    hold: DispatchHold | null = DISPATCH_HOLD,
): Date => {
    if (isDispatchHoldActive(now, hold)) {
        return new Date(hold!.shipDate);
    }
    return canShipToday(now, null) ? now : addBusinessDays(now, 1);
};

/** Earliest date selectable when the customer asks us to hold the order. */
export const getMinSelectableShipDate = (
    now: Date = new Date(),
    hold: DispatchHold | null = DISPATCH_HOLD,
): Date => {
    const nextBusinessDay = startOfDay(addBusinessDays(now, 1));
    if (isDispatchHoldActive(now, hold) && hold!.shipDate.getTime() > nextBusinessDay.getTime()) {
        return startOfDay(new Date(hold!.shipDate));
    }
    return nextBusinessDay;
};

export interface DeliveryWindow {
    from: Date;
    to: Date;
    /** True when the courier commits to a single delivery day (min === max). */
    isExactDate: boolean;
}

export const getDeliveryWindow = (
    shipDate: Date,
    minDays: number,
    maxDays: number,
): DeliveryWindow => ({
    from: addBusinessDays(shipDate, minDays),
    to: addBusinessDays(shipDate, maxDays),
    isExactDate: minDays === maxDays,
});

/** YYYY-MM-DD in the user's local timezone (the format the API expects). */
export const toLocalDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/** Parse a YYYY-MM-DD string as local midnight (inverse of toLocalDateStr). */
export const parseLocalDateStr = (s: string): Date => {
    const [year, month, day] = s.split('-').map(Number);
    return new Date(year, month - 1, day);
};
