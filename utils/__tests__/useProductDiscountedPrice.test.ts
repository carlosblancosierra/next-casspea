import { renderHook } from '@testing-library/react';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { DISCOUNT_TYPES } from '@/types/discounts';
import type { Product } from '@/types/products';

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
}));

const mockUseGetCartQuery = useGetCartQuery as jest.Mock;

const product = { id: 4, current_price: '14.99' } as unknown as Product;

const cartWithDiscount = (discount: object) => ({
    data: { discount },
});

describe('useProductDiscountedPrice', () => {
    it('returns the original price when there is no discount', () => {
        mockUseGetCartQuery.mockReturnValue({ data: { discount: null } });

        const { result } = renderHook(() => useProductDiscountedPrice(4, product));

        expect(result.current).toEqual({
            originalPrice: '14.99',
            discountedPrice: null,
            savings: null,
            hasDiscount: false,
        });
    });

    it('applies a percentage discount', () => {
        mockUseGetCartQuery.mockReturnValue(
            cartWithDiscount({
                discount_type: DISCOUNT_TYPES.PERCENTAGE,
                amount: 10,
                exclusions: [],
            })
        );

        const { result } = renderHook(() => useProductDiscountedPrice(4, product));

        expect(result.current.hasDiscount).toBe(true);
        expect(result.current.discountedPrice).toBe('13.49');
        expect(result.current.savings).toBe('1.50');
    });

    it('applies a fixed-amount discount', () => {
        mockUseGetCartQuery.mockReturnValue(
            cartWithDiscount({
                discount_type: DISCOUNT_TYPES.FIXED_AMOUNT,
                amount: 5,
                exclusions: [],
            })
        );

        const { result } = renderHook(() => useProductDiscountedPrice(4, product));

        expect(result.current.discountedPrice).toBe('9.99');
        expect(result.current.savings).toBe('5.00');
    });

    it('skips products excluded from the discount', () => {
        mockUseGetCartQuery.mockReturnValue(
            cartWithDiscount({
                discount_type: DISCOUNT_TYPES.PERCENTAGE,
                amount: 10,
                exclusions: [{ id: 4 }],
            })
        );

        const { result } = renderHook(() => useProductDiscountedPrice(4, product));

        expect(result.current.hasDiscount).toBe(false);
        expect(result.current.discountedPrice).toBeNull();
    });
});
