'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/address/AddressForm';
import { useAppSelector } from '@/redux/hooks';
import { selectCheckoutSession } from '@/redux/features/checkout/checkoutSlice';
import { useSetAddressesMutation } from '@/redux/features/addresses/addressApiSlice';
import { Address, AddressRequest, AddressCreateRequest } from '@/types/addresses';
import { toast } from 'react-toastify';

export default function AddressPage() {
    const router = useRouter();
    const checkoutSession = useAppSelector(selectCheckoutSession);
    const [setAddresses] = useSetAddressesMutation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useSameAddress, setUseSameAddress] = useState(true);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [isShippingFormValid, setIsShippingFormValid] = useState(false);
    const [isBillingFormValid, setIsBillingFormValid] = useState(true);

    useEffect(() => {
        if (useSameAddress) {
            setIsBillingFormValid(true);
        }
    }, [useSameAddress]);

    useEffect(() => {
        if (!checkoutSession) {
            router.push('/cart');
        }
    }, [checkoutSession, router]);

    const handleShippingSubmit = (address: Address) => {
        setShippingAddress({
            ...address,
            address_type: 'SHIPPING'
        });
    };

    const handleBillingSubmit = (address: Address) => {
        setBillingAddress({
            ...address,
            address_type: 'BILLING'
        });
    };

    const isFormValid = isShippingFormValid && (useSameAddress || isBillingFormValid);

    const handleSubmitClick = async () => {
        if (!shippingAddress || !shippingAddress.street_address || !shippingAddress.city || !shippingAddress.postcode) {
            toast.error('Please complete all required shipping address fields');
            return;
        }

        if (!useSameAddress && (!billingAddress || !billingAddress.street_address || !billingAddress.city || !billingAddress.postcode)) {
            toast.error('Please complete all required billing address fields');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const addressRequest: AddressRequest = {
                shipping_address: {
                    ...shippingAddress,
                    address_type: 'SHIPPING'
                },
                billing_address: useSameAddress ? {
                    ...shippingAddress,
                    address_type: 'BILLING'
                } : {
                    ...billingAddress!,
                    address_type: 'BILLING'
                }
            };

            const response = await setAddresses(addressRequest).unwrap();
            if (response) {
                router.push('/checkout/confirm');
            } else {
                setError('Failed to save addresses. Please try again.');
                toast.error('Failed to save addresses. Please try again.');
            }
        } catch (err: any) {
            console.error('Error setting addresses:', err);
            if (err.data?.shipping_address) {
                // Handle specific validation errors
                const errors = Object.entries(err.data.shipping_address)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                setError(`Shipping address validation failed:\n${errors}`);
                toast.error('Please check shipping address details');
            } else if (err.data?.billing_address) {
                // Handle billing address validation errors
                const errors = Object.entries(err.data.billing_address)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                setError(`Billing address validation failed:\n${errors}`);
                toast.error('Please check billing address details');
            } else {
                setError('Failed to save addresses. Please try again.');
                toast.error('Failed to save addresses. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (!checkoutSession) {
        return null;
    }

    return (
        <main className='mx-auto max-w-3xl md:py-6 md:py-8 py-4 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900 min-h-screen'>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Delivery Address
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Please enter your delivery details
                    </p>
                </div>

                {/* Shipping Address Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Shipping Address</h2>
                    <AddressForm
                        onAddressSubmit={handleShippingSubmit}
                        addressType="SHIPPING"
                        onFormValidityChange={setIsShippingFormValid}
                    />
                </div>

                {/* Billing Address Option */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <label className="flex items-center space-x-3 mb-6">
                        <input
                            type="checkbox"
                            checked={useSameAddress}
                            onChange={(e) => setUseSameAddress(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600
                                dark:text-indigo-400 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-200">
                            Billing address is the same as shipping address
                        </span>
                    </label>

                    {!useSameAddress && (
                        <div className="mt-6">
                            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Billing Address</h2>
                            <AddressForm
                                onAddressSubmit={handleBillingSubmit}
                                addressType="BILLING"
                                onFormValidityChange={setIsBillingFormValid}
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm whitespace-pre-line">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmitClick}
                    disabled={isProcessing || !isFormValid}
                    className="w-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-gray-100 py-3 px-4 rounded-md
                        hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2
                        focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 dark:disabled:bg-gray-700
                        disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isProcessing ? 'Processing...' : 'Continue to Review Order'}
                </button>
            </div>
        </main>
    );
}
