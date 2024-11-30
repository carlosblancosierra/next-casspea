'use client';

import { useState } from 'react';
import { useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { CartUpdate } from '@/types/carts';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/features/carts/cartSlice';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function DiscountForm() {
    const cart = useAppSelector(selectCart);
    const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
    const [discountCode, setDiscountCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsValidating(true);
        setErrorMessage('');

        const cartUpdate: CartUpdate = {
            discount_code: discountCode,
            remove_discount: false
        };

        try {
            await updateCart(cartUpdate).unwrap();
        } catch (error: any) {
            console.log(error);
            if (error?.data?.discount_code) {
                setErrorMessage(error.data.discount_code);
            } else {
                setErrorMessage('An unexpected error occurred while validating the discount.');
            }
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveDiscount = async () => {
        setIsValidating(true);
        setErrorMessage('');
        try {
            const cartUpdate: CartUpdate = {
                discount_code: '',
                remove_discount: true
            };
            await updateCart(cartUpdate).unwrap();
            setDiscountCode('');
        } catch (error: any) {
            if (error?.data?.message) {
                setErrorMessage(error.data.message);
            } else {
                setErrorMessage('An unexpected error occurred while validating the discount.');
            }
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
                {errorMessage && (
                    <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-xs">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        );
    }

    // If no active discount code, show the form
    return (
        <div className="bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex gap-2">
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
                        required
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
                </div>
                {errorMessage && (
                    <div className="flex items-center text-red-600 dark:text-red-400 text-xs">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </form>
        </div>
    );
}
