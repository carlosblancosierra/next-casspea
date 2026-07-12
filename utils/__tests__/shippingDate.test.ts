import { describe, it, expect } from 'vitest';
import {
    DispatchHold,
    canShipToday,
    getDeliveryWindow,
    getEarliestShipDate,
    getMinSelectableShipDate,
    isBusinessDay,
    isDispatchHoldActive,
    parseLocalDateStr,
    toLocalDateStr,
} from '../shippingDate';

// The test script runs with TZ=Europe/London so local dates match UK dates.
// In July the UK is on BST (UTC+1): 08:59Z = 09:59 UK, 09:00Z = 10:00 UK.

describe('getEarliestShipDate (10am UK cutoff, business days only)', () => {
    it('ships same day for a weekday order before 10am UK', () => {
        const mondayMorning = new Date('2026-07-13T08:00:00Z'); // Mon 09:00 UK
        expect(toLocalDateStr(getEarliestShipDate(mondayMorning, null))).toBe('2026-07-13');
    });

    it('ships next business day for a weekday order at/after 10am UK', () => {
        const mondayLate = new Date('2026-07-13T09:00:00Z'); // Mon 10:00 UK exactly
        expect(toLocalDateStr(getEarliestShipDate(mondayLate, null))).toBe('2026-07-14');
    });

    it('respects the UK timezone, not UTC, for the cutoff during BST', () => {
        const justBeforeCutoff = new Date('2026-07-13T08:59:00Z'); // Mon 09:59 UK
        expect(toLocalDateStr(getEarliestShipDate(justBeforeCutoff, null))).toBe('2026-07-13');
    });

    it('uses the cutoff correctly in winter (GMT)', () => {
        const januaryMorning = new Date('2026-01-12T09:30:00Z'); // Mon 09:30 UK (GMT)
        expect(toLocalDateStr(getEarliestShipDate(januaryMorning, null))).toBe('2026-01-12');
        const januaryLate = new Date('2026-01-12T10:30:00Z'); // Mon 10:30 UK
        expect(toLocalDateStr(getEarliestShipDate(januaryLate, null))).toBe('2026-01-13');
    });

    it('handles midnight without the h24 Intl quirk (00:xx is before the cutoff)', () => {
        const midnight = new Date('2026-07-12T23:30:00Z'); // Mon 00:30 UK
        expect(toLocalDateStr(getEarliestShipDate(midnight, null))).toBe('2026-07-13');
    });

    it('skips the weekend: Friday after 10am ships Monday', () => {
        const fridayLate = new Date('2026-07-17T11:00:00Z'); // Fri 12:00 UK
        expect(toLocalDateStr(getEarliestShipDate(fridayLate, null))).toBe('2026-07-20');
    });

    it('never ships on a weekend even before 10am', () => {
        const saturdayMorning = new Date('2026-07-18T07:00:00Z'); // Sat 08:00 UK
        expect(toLocalDateStr(getEarliestShipDate(saturdayMorning, null))).toBe('2026-07-20');
        const sunday = new Date('2026-07-19T07:00:00Z'); // Sun 08:00 UK
        expect(toLocalDateStr(getEarliestShipDate(sunday, null))).toBe('2026-07-20');
    });
});

describe('canShipToday', () => {
    it('is true on a business day before 10am UK', () => {
        expect(canShipToday(new Date('2026-07-13T08:00:00Z'), null)).toBe(true);
    });

    it('is false after the cutoff and on weekends', () => {
        expect(canShipToday(new Date('2026-07-13T09:00:00Z'), null)).toBe(false); // 10:00 UK
        expect(canShipToday(new Date('2026-07-18T07:00:00Z'), null)).toBe(false); // Saturday
    });
});

describe('getMinSelectableShipDate (customer-chosen "ship later" date)', () => {
    it('starts at the next business day', () => {
        const monday = new Date('2026-07-13T08:00:00Z');
        expect(toLocalDateStr(getMinSelectableShipDate(monday, null))).toBe('2026-07-14');
    });

    it('skips the weekend from Friday', () => {
        const friday = new Date('2026-07-17T08:00:00Z');
        expect(toLocalDateStr(getMinSelectableShipDate(friday, null))).toBe('2026-07-20');
    });
});

describe('getDeliveryWindow (transit added in business days)', () => {
    it('flags an exact date when min === max (e.g. Special Delivery, 1 day)', () => {
        const shipDate = parseLocalDateStr('2026-07-13'); // Monday
        const window = getDeliveryWindow(shipDate, 1, 1);
        expect(window.isExactDate).toBe(true);
        expect(toLocalDateStr(window.from)).toBe('2026-07-14');
        expect(toLocalDateStr(window.to)).toBe('2026-07-14');
    });

    it('returns a range when min !== max (e.g. Tracked 24, 1-2 days)', () => {
        const shipDate = parseLocalDateStr('2026-07-13'); // Monday
        const window = getDeliveryWindow(shipDate, 1, 2);
        expect(window.isExactDate).toBe(false);
        expect(toLocalDateStr(window.from)).toBe('2026-07-14');
        expect(toLocalDateStr(window.to)).toBe('2026-07-15');
    });

    it('skips weekends in transit: ship Friday + 1 business day = Monday', () => {
        const friday = parseLocalDateStr('2026-07-17');
        const window = getDeliveryWindow(friday, 1, 2);
        expect(toLocalDateStr(window.from)).toBe('2026-07-20');
        expect(toLocalDateStr(window.to)).toBe('2026-07-21');
    });
});

describe('dispatch hold (bank holidays / heatwaves)', () => {
    const hold: DispatchHold = {
        cutoff: new Date('2026-08-31T23:59:59+01:00'),
        shipDate: new Date('2026-09-01T00:00:00+01:00'),
        message: 'Bank holiday: orders placed on or before 31 Aug ship on Tue 1 Sep.',
    };

    it('is active until the cutoff and inactive after', () => {
        expect(isDispatchHoldActive(new Date('2026-08-28T08:00:00Z'), hold)).toBe(true);
        expect(isDispatchHoldActive(new Date('2026-09-02T08:00:00Z'), hold)).toBe(false);
        expect(isDispatchHoldActive(new Date('2026-08-28T08:00:00Z'), null)).toBe(false);
    });

    it('overrides the earliest ship date while active', () => {
        const beforeHold = new Date('2026-08-28T08:00:00Z'); // Fri 09:00 UK, before cutoff
        expect(toLocalDateStr(getEarliestShipDate(beforeHold, hold))).toBe('2026-09-01');
        expect(canShipToday(beforeHold, hold)).toBe(false);
    });

    it('pushes the min selectable ship date past the hold', () => {
        const beforeHold = new Date('2026-08-28T08:00:00Z'); // next business day would be Mon 31
        expect(toLocalDateStr(getMinSelectableShipDate(beforeHold, hold))).toBe('2026-09-01');
    });
});

describe('date helpers', () => {
    it('identifies business days', () => {
        expect(isBusinessDay(parseLocalDateStr('2026-07-13'))).toBe(true); // Monday
        expect(isBusinessDay(parseLocalDateStr('2026-07-18'))).toBe(false); // Saturday
        expect(isBusinessDay(parseLocalDateStr('2026-07-19'))).toBe(false); // Sunday
    });

    it('round-trips YYYY-MM-DD strings', () => {
        expect(toLocalDateStr(parseLocalDateStr('2026-07-13'))).toBe('2026-07-13');
        expect(toLocalDateStr(parseLocalDateStr('2026-01-05'))).toBe('2026-01-05');
    });
});
