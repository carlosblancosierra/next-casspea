'use client';

import { useState } from 'react';
import { useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { CartUpdate } from '@/types/carts';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/features/carts/cartSlice';

export default function DiscountForm() {
    const cart = useAppSelector(selectCart);
    const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
    const [discountCode, setDiscountCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsValidating(true);

        const cartUpdate: CartUpdate = {
            discount_code: discountCode,
            remove_discount: false
        };

        try {
            await updateCart(cartUpdate);
        } catch (error) {
            console.error('Error validating discount:', error);
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveDiscount = async () => {
        setIsValidating(true);
        try {
            const cartUpdate: CartUpdate = {
                discount_code: '',
                remove_discount: true
            };
            await updateCart(cartUpdate);
            setDiscountCode('');
        } catch (error) {
            console.error('Error removing discount:', error);
        } finally {
            setIsValidating(false);
        }
    };

    // If cart has an active discount code
    if (cart?.discount) {
        return (
            <div className="bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700
                    px-3 py-2 rounded-md">
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {cart.discount.code}
                    </span>
                    <button
                        onClick={handleRemoveDiscount}
                        disabled={isValidating}
                        className="text-gray-400 hover:text-gray-500 dark:text-gray-500
                            dark:hover:text-gray-400 focus:outline-none"
                        aria-label="Remove discount code"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }

    // If no active discount code, show the form
    return (
        <div className="bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                        text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                        placeholder-gray-500 dark:placeholder-gray-400
                        text-xs
                        focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                        focus:border-indigo-500 dark:focus:border-indigo-400"
                />
                <button
                    type="submit"
                    disabled={isValidating || !discountCode}
                    className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs px-4 py-2 rounded-md
                        hover:bg-indigo-500 dark:hover:bg-indigo-400
                        disabled:bg-gray-300 dark:disabled:bg-gray-600
                        disabled:cursor-not-allowed"
                >
                    {isValidating ? 'Validating...' : 'Validate'}
                </button>
            </form>
        </div>
    );
}
