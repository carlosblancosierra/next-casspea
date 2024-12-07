import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { DISCOUNT_TYPES } from '@/types/discounts';
import { Product } from '@/types/products';

export const useProductDiscountedPrice = (productId: number, product: Product) => {
    const { data: cart, isLoading, error } = useGetCartQuery();

    // If no cart or no discount, return original price
    if (!cart?.discount) {
        return {
            originalPrice: product.base_price,
            discountedPrice: null,
            savings: null,
            hasDiscount: false
        };
    }

    const { discount } = cart;

    // Check if product is excluded from discount
    const isExcluded = discount.exclusions.some(p => p.id === productId);
    if (isExcluded) {
        return {
            originalPrice: product.base_price,
            discountedPrice: null,
            savings: null,
            hasDiscount: false
        };
    }

    const originalPrice = parseFloat(product?.base_price || '0');
    let discountAmount = 0;

    // Calculate discount based on type
    if (discount.discount_type === DISCOUNT_TYPES.PERCENTAGE) {
        discountAmount = originalPrice * (discount.amount / 100);
    } else if (discount.discount_type === DISCOUNT_TYPES.FIXED_AMOUNT) {
        discountAmount = discount.amount;
    }

    const discountedPrice = (originalPrice - discountAmount).toFixed(2);
    const savings = discountAmount.toFixed(2);

    return {
        originalPrice: product.base_price,
        discountedPrice,
        savings,
        hasDiscount: true,
        discount_percentage: discount.amount
    };
};
