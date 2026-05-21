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

        // Validate store pickup selection
        if (selectedShippingOption === 34 && !storePickup) {
            toast.error('Please select a pickup date and time slot');
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
                    <div className="text-primary-text dark:text-primary-text-light">Error loading checkout details</div>
                </div>
            </div>
        );
    }

    const isHolidayPeriod = new Date() < new Date('2026-05-26T00:00:00+01:00');

    return (
        <div className=" dark:bg-main-bg-dark min-h-screen">
            <div className="max-w-7xl mx-auto px-0">
                <div className="space-y-6">
                    {isHolidayPeriod && (
                        <div className="rounded-md border border-amber-200 dark:border-amber-700 p-4 bg-amber-50 dark:bg-amber-900/20 flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Shipping Delay Notice</p>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                                    Due to the Spring Bank Holiday &amp; high temperatures, all orders placed before 26 May will ship on <strong>Tuesday 26 May</strong>.
                                </p>
                            </div>
                        </div>
                    )}

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
                        disabled={isProcessing || !selectedShippingOption || (selectedShippingOption === 34 && !storePickup)}
                        className="w-full bg-gradient-autumn text-primary-text-light dark:text-primary-text-light py-3 px-4 rounded-md
                            hover:bg-primary focus:outline-none focus:ring-2
                            focus:ring-primary-2 focus:ring-offset-2 disabled:bg-main-bg
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
