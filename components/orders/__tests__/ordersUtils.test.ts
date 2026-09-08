import { getDayTotals } from '@/components/orders/ordersUtils';
import { makeOrder } from '@/test-utils/makeOrder';
import type { Order } from '@/types/orders';

const orderWithTotal = (total: string | number): Order =>
    makeOrder({
        checkout_session: {
            ...makeOrder().checkout_session,
            total_with_shipping: total,
        },
    });

describe('getDayTotals', () => {
    it('sums day totals when the API sends numbers', () => {
        const { dayTotal } = getDayTotals([orderWithTotal(12.5), orderWithTotal(5)]);
        expect(dayTotal).toBe(17.5);
    });

    it('sums day totals when the API sends decimal strings (never concatenates)', () => {
        const { dayTotal } = getDayTotals([orderWithTotal('12.50'), orderWithTotal('5.00')]);
        expect(dayTotal).toBe(17.5);
    });

    it('treats malformed totals as zero', () => {
        const { dayTotal } = getDayTotals([orderWithTotal('not-a-price'), orderWithTotal('10.00')]);
        expect(dayTotal).toBe(10);
    });
});
