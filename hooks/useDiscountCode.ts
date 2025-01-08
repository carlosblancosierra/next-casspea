'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';

export function useDiscountCode() {
    const searchParams = useSearchParams();
    const [updateCart] = useUpdateCartMutation();

    useEffect(() => {
        const discountCode = searchParams.get('discount_code');

        if (discountCode) {
            const applyDiscount = async () => {
                try {
                    await updateCart({
                        discount_code: discountCode,
                        remove_discount: false
                    }).unwrap();
                } catch (error) {
                    console.error('Failed to apply discount code:', error);
                }
            };

            applyDiscount();
        }
    }, [searchParams, updateCart]);
}
