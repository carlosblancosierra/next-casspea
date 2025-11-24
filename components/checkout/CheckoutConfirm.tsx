'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useGetSessionQuery,
    useUpdateSessionMutation,
    useCreateStripeCheckoutSessionMutation,
    useUpdateShippingOptionMutation
} from '@/redux/features/checkout/checkoutApiSlice';
import CheckoutDetails from './CheckoutDetails';
import CheckoutShippingOptions from './CheckoutShippingOptions';
import { toast } from 'react-toastify';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import Spinner from '@/components/common/Spinner';
import CartItem from '@/components/cart/CartItem';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import ReadOnlyCartItem from '@/components/cart/ReadOnlyCartItem';

const CheckoutConfirm = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedShippingOption, setSelectedShippingOption] = useState<number | undefined>(undefined);
    const [storePickup, setStorePickup] = useState<{ date: Date; slot: { start: string; end: string; value: string } } | null>(null);

    const router = useRouter();

    const { data: session, isLoading: sessionLoading, error: sessionError } = useGetSessionQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const { data: cart, isLoading: cartLoading, error: cartError } = useGetCartQuery();
    const { data: shippingCompanies, isLoading: isShippingLoading } = useGetShippingOptionsQuery();

    const [createStripeSession] = useCreateStripeCheckoutSessionMutation();
    const [updateShippingOption] = useUpdateShippingOptionMutation();


    const handleProceedToPayment = async () => {
        if (isProcessing) return;
        if (!selectedShippingOption) {
            toast.error('Please select a shipping method');
            return;
        }

        try {
            setIsProcessing(true);

            // Prepare payload
            const payload: any = {
                shipping_option_id: selectedShippingOption
            };
            if (selectedShippingOption === 34 && storePickup) {
                payload.pickup_date = storePickup.date.toISOString().slice(0, 10); // YYYY-MM-DD
                payload.pickup_time = storePickup.slot.start + ' - ' + storePickup.slot.end;
            }

            await updateShippingOption({
                checkoutSessionId: session?.id || 0,
                data: payload
            }).unwrap();

            // Then create the Stripe session
            const response = await createStripeSession().unwrap();
            if (response?.url) {
                await new Promise(resolve => setTimeout(resolve, 500));
                window.location.href = response.url;
            }

            // router.push('/checkout/embedded');
        
        } catch (err) {
            toast.error('Failed to process payment');
            console.error('Payment processing failed:', err);
            setIsProcessing(false);
        }
    };

    if (sessionLoading || cartLoading) {
        return (
            <div className=" dark:bg-main-bg-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-0 h-[calc(80vh)] flex items-center justify-center">
                    <div className="flex items-center justify-center min-h-screen">
                        <Spinner md />
                    </div>
                </div>
            </div>
        );
    }

    if (sessionError || cartError) {
        return (
            <div className=" dark:bg-main-bg-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-0">
                    <div className="text-primary-text dark:text-primary-text">Error loading checkout details</div>
                </div>
            </div>
        );
    }

    return (
        <div className=" dark:bg-main-bg-dark min-h-screen">
            <div className="max-w-7xl mx-auto px-0">
                <div className="space-y-6">
                    {/* <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-primary-text dark:text-primary-text">Order Items</h2>
                        {cart?.items?.map((item) => (
                            <ReadOnlyCartItem key={item.id} entry={item} />
                        ))}
                    </div> */}

                    <CheckoutDetails session={session} />
                    <CheckoutShippingOptions
                        shippingCompanies={shippingCompanies}
                        selectedOptionId={selectedShippingOption}
                        onShippingOptionChange={async (optionId: number) => {
                            setSelectedShippingOption(optionId);
                        }}
                        onChangeStorePickup={setStorePickup}
                    />
                    <button
                        onClick={handleProceedToPayment}
                        disabled={isProcessing || !selectedShippingOption}
                        className="w-full bg-gradient-autumn text-primary-text dark:text-primary-text py-3 px-4 rounded-md
                            hover:bg-primary focus:outline-none focus:ring-2
                            focus:ring-primary-2 focus:ring-offset-2 disabled:bg-gray-300
                            disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutConfirm;
