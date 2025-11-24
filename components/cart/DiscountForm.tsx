'use client';

import { useState } from 'react';
import { useUpdateCartMutation, useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function DiscountForm() {
    const { data: cart, isLoading, error } = useGetCartQuery();
    const [updateCart] = useUpdateCartMutation();
    const [discountCode, setDiscountCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsValidating(true);
        setErrorMessage('');

        try {
            await updateCart({
                discount_code: discountCode,
                remove_discount: false
            }).unwrap();
        } catch (error: any) {
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
            await updateCart({
                discount_code: '',
                remove_discount: true
            }).unwrap();
            setDiscountCode('');
        } catch (error: any) {
            setErrorMessage(error?.data?.message || 'An unexpected error occurred.');
        } finally {
            setIsValidating(false);
        }
    };

    // If cart has an active discount code
    if (cart?.discount) {
        return (
            <div className="flex items-center justify-between  dark:bg-gray-700 px-3 py-2 rounded-md">
                <span className="text-xs font-medium text-primary-text">
                    {cart.discount.code}
                </span>
                <button
                    onClick={handleRemoveDiscount}
                    disabled={isValidating}
                    className="text-primary-text hover:text-primary-text dark:text-primary-text
                        dark:hover:text-primary-text focus:outline-none"
                    aria-label="Remove discount code"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="mt-1">
            <form onSubmit={handleSubmit} className="space-y-1">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter discount code"
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                            text-primary-text dark:text-primary-text bg-main-bg dark:bg-gray-700
                            placeholder-gray-500 dark:placeholder-gray-400 text-base
                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                            transition-colors duration-200"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isValidating || !discountCode}
                        className="bg-primary dark:bg-primary-2 text-primary-text text-xs px-4 py-2 rounded-md
                            hover:bg-primary-2 dark:hover:bg-primary-2
                            disabled:bg-gray-300 dark:disabled:bg-gray-600
                            disabled:cursor-not-allowed"
                    >
                        {isValidating ? 'Validating...' : 'Apply'}
                    </button>
                </div>
                {errorMessage && (
                    <div className="flex items-center text-primary-text text-xs mt-1">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </form>
        </div>
    );
}
