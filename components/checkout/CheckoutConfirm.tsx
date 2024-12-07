'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useGetSessionQuery,
    useUpdateSessionMutation,
    useCreateStripeCheckoutSessionMutation
} from '@/redux/features/checkout/checkoutApiSlice';
import CheckoutDetails from './CheckoutDetails';
import CheckoutShippingOptions from './CheckoutShippingOptions';
import { toast } from 'react-toastify';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';

const CheckoutConfirm = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedShippingOption, setSelectedShippingOption] = useState<number | null>(null);

    const { data: session, isLoading, error } = useGetSessionQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const { data: shippingCompanies, isLoading: isShippingLoading } = useGetShippingOptionsQuery();

    const [createStripeSession] = useCreateStripeCheckoutSessionMutation();
    const [updateSession] = useUpdateSessionMutation();

    // Set initial shipping option from session
    useEffect(() => {
        if (session?.shipping_option?.id) {
            setSelectedShippingOption(session.shipping_option.id);
        }
    }, [session?.shipping_option?.id]);

    const handleProceedToPayment = async () => {
        if (isProcessing) return;
        if (!selectedShippingOption) {
            toast.error('Please select a shipping method');
            return;
        }

        try {
            setIsProcessing(true);

            // First, update the shipping option if it's different from the session
            if (selectedShippingOption !== session?.shipping_option?.id) {
                await updateSession({
                    shipping_option_id: selectedShippingOption
                }).unwrap();
            }

            // Then create the Stripe session
            const response = await createStripeSession().unwrap();
            if (response?.url) {
                await new Promise(resolve => setTimeout(resolve, 500));
                window.location.href = response.url;
            }
        } catch (err) {
            toast.error('Failed to process payment');
            console.error('Payment processing failed:', err);
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
            <CheckoutShippingOptions
                shippingCompanies={shippingCompanies}
                selectedOptionId={selectedShippingOption}
                onShippingOptionChange={(optionId: number) => {
                    setSelectedShippingOption(optionId);
                }}
            />

            <button
                onClick={handleProceedToPayment}
                disabled={isProcessing || !selectedShippingOption}
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
