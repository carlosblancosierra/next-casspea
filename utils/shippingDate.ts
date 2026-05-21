import { addBusinessDays } from 'date-fns';

// Temporary override: due to UK Spring Bank Holiday (Mon 25 May 2026) and
// high temperatures, every order placed on or before 25 May 2026 will only
// ship on Tuesday 26 May 2026.
export const SHIPPING_DELAY_UNTIL_DATE = new Date('2026-05-26T00:00:00Z'); // ship date
export const SHIPPING_DELAY_CUTOFF_DATE = new Date('2026-05-25T23:59:59Z'); // last "delayed" order moment
export const SHIPPING_DELAY_MESSAGE =
    'Due to the UK Spring Bank Holiday (Mon 25 May) and high temperatures, all orders placed on or before 25 May will be dispatched on Tuesday 26 May.';

export const SHIPPING_CUTOFF_HOUR = 10;

const getUkHour = (date: Date) =>
    parseInt(
        new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            hour12: false,
            timeZone: 'Europe/London',
        }).format(date),
    );

export const isShippingDelayActive = (now: Date = new Date()): boolean =>
    now.getTime() <= SHIPPING_DELAY_CUTOFF_DATE.getTime();

/**
 * Returns the date the order will actually ship, taking into account:
 * - The 10am UK shipping cutoff (orders after 10am ship next business day)
 * - The Spring Bank Holiday / heatwave override (orders placed on/before
 *   25 May 2026 ship on Tue 26 May 2026)
 */
export const getShippingDate = (now: Date = new Date()): Date => {
    if (isShippingDelayActive(now)) {
        return new Date(SHIPPING_DELAY_UNTIL_DATE);
    }
    const ukHour = getUkHour(now);
    return ukHour < SHIPPING_CUTOFF_HOUR ? now : addBusinessDays(now, 1);
};
