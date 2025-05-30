'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/address/AddressForm';
import { Address, AddressRequest } from '@/types/addresses';
import { toast } from 'react-toastify';
import { useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';
import { useSetAddressesMutation } from '@/redux/features/addresses/addressApiSlice';


export default function AddressPage() {
    const router = useRouter();

    const { data: checkoutSession } = useGetSessionQuery();
    const [setAddresses] = useSetAddressesMutation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useSameAddress, setUseSameAddress] = useState(true);
    const [shippingAddress, setShippingAddress] = useState<Address | undefined>(undefined);
    const [billingAddress, setBillingAddress] = useState<Address | undefined>(undefined);
    const [isShippingFormValid, setIsShippingFormValid] = useState(false);
    const [isBillingFormValid, setIsBillingFormValid] = useState(true);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (checkoutSession?.email) {
            setEmail(checkoutSession.email);
        }
        if (checkoutSession?.billing_address) {
            setBillingAddress(checkoutSession.billing_address);
        }
        if (checkoutSession?.shipping_address) {
            setShippingAddress(checkoutSession.shipping_address);
        }
    }, [checkoutSession]);

    useEffect(() => {
        if (useSameAddress) {
            setIsBillingFormValid(true);
        }
    }, [useSameAddress]);

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

    const handleSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log('Submit button clicked');

        // Validate Shipping Address
        if (!shippingAddress || !shippingAddress.street_address || !shippingAddress.city || !shippingAddress.postcode) {
            toast.error('Please complete all required shipping address fields');
            console.error('Shipping address incomplete:', shippingAddress);
            return;
        }

        // Validate Billing Address if not using the same as shipping
        if (!useSameAddress && (!billingAddress || !billingAddress.street_address || !billingAddress.city || !billingAddress.postcode)) {
            toast.error('Please complete all required billing address fields');
            console.error('Billing address incomplete:', billingAddress);
            return;
        }

        setIsProcessing(true);
        setError(null);
        console.log('Processing address submission');

        try {
            // Prepare the address request payload
            const addressRequest: AddressRequest = {
                shipping_address: {
                    ...shippingAddress,
                    address_type: 'SHIPPING'
                },
                billing_address: useSameAddress
                    ? {
                        ...shippingAddress,
                        address_type: 'BILLING'
                    }
                    : {
                        ...billingAddress!,
                        address_type: 'BILLING'
                    }
            };
            console.log('Sending address request:', addressRequest);

            const response = await setAddresses(addressRequest).unwrap();
            console.log('Address set response:', response);
            console.log('Navigating to /checkout/confirm');
            router.push('/checkout/confirm');

        } catch (err: any) {
            console.error('Error setting addresses:', err);

            // Determine the type of error and set appropriate messages
            if (err.data?.shipping_address) {
                const errors = Object.entries(err.data.shipping_address)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                setError(`Shipping address validation failed:\n${errors}`);
                toast.error('Please check shipping address details');
            } else if (err.data?.billing_address) {
                const errors = Object.entries(err.data.billing_address)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                setError(`Billing address validation failed:\n${errors}`);
                toast.error('Please check billing address details');
            } else {
                setError('Failed to save addresses. Please try again.');
                toast.error('Failed to save addresses. Please try again.');
                // Redirect to the error page
                router.push('/checkout/error');
            }
        } finally {
            setIsProcessing(false);
            console.log('Finished processing address submission');
        }
    };

    return (
        <main className='mx-auto max-w-3xl md:py-8 py-4 px-4 sm:px-6 bg-main-bg dark:bg-gray-900 min-h-screen'>
            <div className="space-y-4">
                <div>
                    <p className="text-md text-gray-600 dark:text-gray-400">
                        Please enter your delivery details
                    </p>
                </div>

                {/* Shipping Address Form */}
                <div className="main-bg dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Shipping Address</h2>
                    <AddressForm
                        onAddressSubmit={handleShippingSubmit}
                        addressType="SHIPPING"
                        onFormValidityChange={setIsShippingFormValid}
                        initialEmail={email}
                        initialData={checkoutSession?.shipping_address || undefined}
                    />
                </div>

                {/* Billing Address Option */}
                <div className="main-bg dark:bg-gray-800 p-6 rounded-lg shadow">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={useSameAddress}
                            onChange={(e) => setUseSameAddress(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary
                                dark:text-primary-2 focus:ring-primary-2"
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
                                initialEmail={email}
                                initialData={checkoutSession?.billing_address || undefined}
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
                    className="w-full bg-primary dark:bg-primary-2 text-white dark:text-gray-100 py-3 px-4 rounded-md
                        hover:bg-primary dark:hover:bg-primary focus:outline-none focus:ring-2
                        focus:ring-primary-2 focus:ring-offset-2 disabled:bg-gray-300 dark:disabled:bg-gray-700
                        disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isProcessing ? 'Processing...' : 'Continue to Review Order'}
                </button>
            </div>
        </main>
    );
}
