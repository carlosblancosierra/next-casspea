'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCheckoutSession, selectHasAddresses } from '@/redux/features/checkout/checkoutSlice';
import { useCreateStripeCheckoutSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';

export default function CheckoutPage() {
    const router = useRouter();
    const checkoutSession = useAppSelector(selectCheckoutSession);
    const hasAddresses = useAppSelector(selectHasAddresses);
    const [createStripeCheckoutSession, { isLoading }] = useCreateStripeCheckoutSessionMutation();

    // useEffect(() => {
    //     if (!checkoutSession) {
    //         router.push('/cart');
    //         return;
    //     }

    //     if (!hasAddresses) {
    //         router.push('/checkout/address');
    //         return;
    //     }
    // }, [checkoutSession, hasAddresses, router]);

    const handleProceedToPayment = async () => {
        try {
            const response = await createStripeCheckoutSession().unwrap();
            // Redirect to Stripe checkout URL if provided in response
            if (response?.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            // Handle error (show toast, etc.)
        }
    };

    // if (!checkoutSession || !hasAddresses) {
    //     return null; // or loading spinner
    // }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
                Confirm Order
            </h1>

            {/* Display order summary */}
            <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Order Summary
                </h2>
                {/* Add your order summary components */}
            </div>

            {/* Display addresses */}
            <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Delivery Details
                </h2>
                {/* Add your address display components */}
            </div>

            <button
                onClick={handleProceedToPayment}
                disabled={isLoading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-md
                    hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2
                    focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300
                    dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                    transition-colors duration-200"
            >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
        </div>
    );
}
