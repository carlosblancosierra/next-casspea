import { getDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import { Discount } from '@/types/discounts';

const discount = (over: Partial<Discount> = {}) =>
    ({ discount_type: 'PERCENTAGE', amount: 15, exclusions: [], ...over }) as Discount;

describe('getDiscountedPrice', () => {
    it('takes the percentage off', () => {
        expect(getDiscountedPrice(discount(), 1, '40.00')).toBe('34.00');
    });

    it('takes a fixed amount off', () => {
        expect(getDiscountedPrice(discount({ discount_type: 'FIXED_AMOUNT', amount: 5 }), 1, '40.00')).toBe('35.00');
    });

    it('is null without a code or for an excluded product', () => {
        expect(getDiscountedPrice(null, 1, '40.00')).toBeNull();
        expect(getDiscountedPrice(discount({ exclusions: [{ id: 1 } as Discount['exclusions'][number]] }), 1, '40.00')).toBeNull();
    });
});
