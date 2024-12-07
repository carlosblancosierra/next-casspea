'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetSessionQuery, useCreateStripeCheckoutSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';
import CheckoutDetails from './CheckoutDetails';
import CheckoutShippingOptions from './CheckoutShippingOptions';
import { toast } from 'react-toastify';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';

const CheckoutConfirm = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const { data: session, isLoading, error } = useGetSessionQuery();
    const { data: shippingCompanies, isLoading: isShippingLoading, error: shippingError } = useGetShippingOptionsQuery();

    const [createStripeSession] = useCreateStripeCheckoutSessionMutation();

    useEffect(() => {
        if (!isLoading && !isShippingLoading && session) {
            if (!session.shipping_address || !session.billing_address) {

                // wait 1 second before redirecting
                setTimeout(() => {
                    toast.error('Error: Please try again');
                    router.push('/checkout/address');
                }, 1000);
            }
        }
    }, [session, isLoading, isShippingLoading, router]);

    const handleProceedToPayment = async () => {
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            const response = await createStripeSession().unwrap();
            if (response?.url) {
                await new Promise(resolve => setTimeout(resolve, 500));
                window.location.href = response.url;
            }
        } catch (err) {
            toast.error('Failed to create payment session');
            console.error('Payment session creation failed:', err);
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <div className="text-center">Loading checkout details...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error loading checkout details</div>;
    }

    return (
        <div className="space-y-6">
            <CheckoutDetails session={session} />
            <CheckoutShippingOptions shippingCompanies={shippingCompanies} />

            <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md
                    hover:bg-indigo-700 focus:outline-none focus:ring-2
                    focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300
                    disabled:cursor-not-allowed transition-colors duration-200"
            >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
        </div>
    );
};

export default CheckoutConfirm;
