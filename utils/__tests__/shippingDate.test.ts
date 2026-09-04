import {
    getShippingDate,
    isShippingDelayActive,
    SHIPPING_CUTOFF_HOUR,
    SHIPPING_DELAY_UNTIL_DATE,
} from '@/utils/shippingDate';

// All dates below are UK summer (BST, UTC+1), well after the May bank
// holiday override, so only the 10am cutoff logic applies.
const atUkHour = (hour: number) =>
    new Date(`2026-07-15T${String(hour).padStart(2, '0')}:30:00+01:00`);

describe('isShippingDelayActive', () => {
    it('is active on and before the bank-holiday cutoff', () => {
        expect(isShippingDelayActive(new Date('2026-05-25T10:00:00Z'))).toBe(true);
        expect(isShippingDelayActive(new Date('2026-05-01T00:00:00Z'))).toBe(true);
    });

    it('is inactive after the cutoff', () => {
        expect(isShippingDelayActive(new Date('2026-05-26T08:00:00Z'))).toBe(false);
        expect(isShippingDelayActive(new Date('2026-07-15T08:00:00Z'))).toBe(false);
    });
});

describe('getShippingDate', () => {
    it('orders during the bank-holiday window ship on the delayed date', () => {
        const shipDate = getShippingDate(new Date('2026-05-24T09:00:00Z'));
        expect(shipDate.getTime()).toBe(SHIPPING_DELAY_UNTIL_DATE.getTime());
    });

    it('orders before the cutoff hour ship the same day', () => {
        const now = atUkHour(SHIPPING_CUTOFF_HOUR - 1); // 9:30am UK
        expect(getShippingDate(now).toDateString()).toBe(now.toDateString());
    });

    it('orders after the cutoff hour ship the next business day', () => {
        const now = atUkHour(SHIPPING_CUTOFF_HOUR + 1); // 11:30am UK, a Wednesday
        const shipDate = getShippingDate(now);
        expect(shipDate.getDate()).toBe(now.getDate() + 1);
    });

    it('Friday orders after the cutoff skip the weekend', () => {
        const friday = new Date('2026-07-17T14:00:00+01:00');
        const shipDate = getShippingDate(friday);
        expect(shipDate.getDay()).toBe(1); // Monday
        expect(shipDate.getDate()).toBe(20);
    });
});
