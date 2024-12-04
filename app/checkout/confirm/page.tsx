'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCheckoutSession, selectHasAddresses } from '@/redux/features/checkout/checkoutSlice';
import { useCreateStripeCheckoutSessionMutation, useUpdateSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { selectAllShippingOptions } from '@/redux/features/shipping/shippingSlice';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
    const router = useRouter();
    const checkoutSession = useAppSelector(selectCheckoutSession);
    const hasAddresses = useAppSelector(selectHasAddresses);
    const [selectedShipping, setSelectedShipping] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [updateSession] = useUpdateSessionMutation();
    const [createStripeCheckoutSession] = useCreateStripeCheckoutSessionMutation();

    const { isLoading: isLoadingShipping, error: shippingError } = useGetShippingOptionsQuery();
    const shippingOptions = useAppSelector(selectAllShippingOptions);

    useEffect(() => {
        if (!checkoutSession) {
            router.push('/cart');
            return;
        }

        if (!hasAddresses) {
            router.push('/checkout/address');
            return;
        }
    }, [checkoutSession, hasAddresses, router]);

    const handleProceedToPayment = async () => {
        if (!checkoutSession?.id) {
            toast.error('Invalid checkout session');
            return;
        }

        if (!selectedShipping) {
            toast.error('Please select a shipping method');
            return;
        }

        setIsProcessing(true);

        try {
            await updateSession({
                shipping_option_id: parseInt(selectedShipping)
            }).unwrap();

            const stripeSession = await createStripeCheckoutSession().unwrap();

            if (stripeSession?.url) {
                window.location.href = stripeSession.url;
            } else {
                throw new Error('No redirect URL received');
            }
        } catch (error: any) {
            console.error('Checkout process failed:', error);
            toast.error('Failed to proceed to payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!checkoutSession || !hasAddresses) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Shipping Method
                </h2>

                {isLoadingShipping ? (
                    <p className="text-gray-600 dark:text-gray-400">Loading shipping options...</p>
                ) : shippingError ? (
                    <p className="text-red-600 dark:text-red-400">Failed to load shipping options</p>
                ) : (
                    <div className="space-y-4">
                        {shippingOptions.map((option) => (
                            <label key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                <input
                                    type="radio"
                                    name="shipping"
                                    value={option.id}
                                    checked={selectedShipping === option.id.toString()}
                                    onChange={(e) => setSelectedShipping(e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {option.companyName} - {option.name}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(option.price)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {option.description}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Estimated delivery: {option.estimated_days_min}-{option.estimated_days_max} days
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={handleProceedToPayment}
                disabled={isProcessing || !selectedShipping || isLoadingShipping}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
            >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
        </div>
    );
}
