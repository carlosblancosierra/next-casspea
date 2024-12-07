'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCheckoutSession, selectHasAddresses } from '@/redux/features/checkout/checkoutSlice';
import { useCreateStripeCheckoutSessionMutation, useGetSessionQuery, useUpdateSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { selectAllShippingOptions } from '@/redux/features/shipping/shippingSlice';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
    const router = useRouter();
    const hasAddresses = useAppSelector(selectHasAddresses);
    const [selectedShipping, setSelectedShipping] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [updateSession] = useUpdateSessionMutation();
    const [createStripeCheckoutSession] = useCreateStripeCheckoutSessionMutation();

    const { data: checkoutSession, isLoading: isLoadingSession, error: sessionError } = useGetSessionQuery();
    const { isLoading: isLoadingShipping, error: shippingError } = useGetShippingOptionsQuery();
    const shippingOptions = useAppSelector(selectAllShippingOptions);

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

    // Loading State: Wait for both session and shipping options to load
    if (isLoadingSession || isLoadingShipping) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-gray-700 dark:text-gray-300">Loading checkout information...</p>
            </div>
        );
    }

    // Error State: Handle errors in fetching session or shipping options
    if (sessionError || shippingError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-red-600 dark:text-red-400">
                    Failed to load checkout information. Please try again later.
                </p>
            </div>
        );
    }

    // Ensure that the checkout session and shipping options exist
    if (!checkoutSession || shippingOptions.length === 0 || !hasAddresses) {
        return null;
    }

    // Extracting Products and Addresses from the Checkout Session
    const { shipping_address, billing_address } = checkoutSession;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Checkout Information */}
            <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Order Summary</h2>

                {shipping_address && (
                    <>
                        {/* Addresses */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Shipping Address</h3>
                                <p className="text-gray-700 dark:text-gray-300">{shipping_address.street_address}</p>
                                <p className="text-gray-700 dark:text-gray-300">{shipping_address.city}, {shipping_address.postcode}</p>
                                <p className="text-gray-700 dark:text-gray-300">{shipping_address.country}</p>
                            </div>


                            {billing_address && billing_address.street_address !== shipping_address.street_address && (
                                <>
                                    {/* Billing Address */}
                                    <div>
                                        <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Billing Address</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{billing_address.street_address}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{billing_address.city}, {billing_address.postcode}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{billing_address.country}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Shipping Method Selection */}
            <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Shipping Method
                </h2>

                {shippingOptions.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No shipping options available.</p>
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
                                    className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
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

            {/* Proceed to Payment Button */}
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
