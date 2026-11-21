import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { DISCOUNT_TYPES, Discount } from '@/types/discounts';
import { Product } from '@/types/products';

/**
 * The price after the basket's discount code, as "12.34", or null when the
 * basket has no code or this product is excluded from it.
 */
export function getDiscountedPrice(
    discount: Discount | null | undefined,
    productId: number,
    price: string | number | null | undefined,
): string | null {
    if (!discount) return null;
    if (discount.exclusions.some(p => p.id === productId)) return null;

    const originalPrice = parseFloat(String(price ?? '0'));
    let discountAmount = 0;
    if (discount.discount_type === DISCOUNT_TYPES.PERCENTAGE) {
        discountAmount = originalPrice * (discount.amount / 100);
    } else if (discount.discount_type === DISCOUNT_TYPES.FIXED_AMOUNT) {
        discountAmount = discount.amount;
    }
    return (originalPrice - discountAmount).toFixed(2);
}

export const useProductDiscountedPrice = (productId: number, product: Product) => {
    const { data: cart } = useGetCartQuery();
    const discountedPrice = getDiscountedPrice(cart?.discount, productId, product?.current_price);

    if (!discountedPrice || !cart?.discount) {
        return {
            originalPrice: product.current_price,
            discountedPrice: null,
            savings: null,
            hasDiscount: false
        };
    }

    const originalPrice = parseFloat(product?.current_price || '0');
    return {
        originalPrice: product.current_price,
        discountedPrice,
        savings: (originalPrice - parseFloat(discountedPrice)).toFixed(2),
        hasDiscount: true,
        discount_percentage: cart.discount.amount
    };
};
