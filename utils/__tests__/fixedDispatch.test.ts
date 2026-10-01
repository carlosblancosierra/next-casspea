import { format } from 'date-fns';
import { getFixedDispatch } from '@/utils/shippingDays';

const TODAY = new Date(2026, 9, 1); // 1 Oct 2026, local midnight

const item = (name: string, fixed?: string | null) => ({
    product: { name, fixed_dispatch_date: fixed ?? null },
});

const day = (d: Date | undefined) => (d ? format(d, 'yyyy-MM-dd') : null);

describe('getFixedDispatch', () => {
    it('is null for an ordinary cart', () => {
        expect(getFixedDispatch([item('Box of 24')], TODAY)).toBeNull();
    });

    it('takes the day the product names, and the product that named it', () => {
        const result = getFixedDispatch([item('Advent Calendar', '2026-11-24')], TODAY);

        expect(day(result?.date)).toBe('2026-11-24');
        expect(result?.productName).toBe('Advent Calendar');
        expect(result?.mixed).toBe(false);
    });

    it('reads the date as a calendar day, not as UTC midnight', () => {
        // new Date('2026-11-24') is UTC midnight — the 23rd anywhere west of
        // London, which would post the calendars a day early.
        const result = getFixedDispatch([item('Advent Calendar', '2026-11-24')], TODAY);

        expect(result?.date.getDate()).toBe(24);
        expect(result?.date.getMonth()).toBe(10);
    });

    it('takes the earliest date in a mixed cart, and says it is mixed', () => {
        const result = getFixedDispatch(
            [item('Advent Calendar', '2026-11-24'), item('Easter Egg', '2026-11-30'), item('Box of 9')],
            TODAY,
        );

        expect(day(result?.date)).toBe('2026-11-24');
        expect(result?.mixed).toBe(true);
    });

    it('does not call two of the same calendar mixed', () => {
        const result = getFixedDispatch(
            [item('Advent Calendar', '2026-11-24'), item('Advent Calendar', '2026-11-24')],
            TODAY,
        );

        expect(result?.mixed).toBe(false);
    });

    it('ignores a date that has gone by', () => {
        // A seasonal setting someone forgot to clear must not force a posting
        // day in the past — that is worse than asking normally.
        expect(getFixedDispatch([item('Advent Calendar', '2025-11-24')], TODAY)).toBeNull();
    });

    it('still honours a date that is today', () => {
        expect(day(getFixedDispatch([item('Advent Calendar', '2026-10-01')], TODAY)?.date)).toBe('2026-10-01');
    });

    it('ignores a value it cannot read rather than crashing the checkout', () => {
        expect(getFixedDispatch([item('Advent Calendar', 'not-a-date')], TODAY)).toBeNull();
    });
});
