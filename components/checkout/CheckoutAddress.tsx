import React, { useState } from 'react';
import AddressForm from '../address/AddressForm';

interface AddressData {
    full_name: string;
    phone: string;
    street_address: string;
    street_address2: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
    place_id: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
}

interface CheckoutAddressProps {
    onAddressSubmit: (addresses: {
        shipping: AddressData;
        billing: AddressData;
    }) => void;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({ onAddressSubmit }) => {
    const [shippingAddress, setShippingAddress] = useState<AddressData | null>(null);
    const [billingAddress, setBillingAddress] = useState<AddressData | null>(null);
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [error, setError] = useState<string>('');

    const handleShippingSubmit = (address: AddressData) => {
        setShippingAddress(address);
        if (sameAsShipping) {
            setBillingAddress(address);
        }
    };

    const handleBillingSubmit = (address: AddressData) => {
        setBillingAddress(address);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSameAsShipping(e.target.checked);
        if (e.target.checked && shippingAddress) {
            setBillingAddress(shippingAddress);
        } else {
            setBillingAddress(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!shippingAddress) {
            setError('Please fill in shipping address');
            return;
        }

        if (!sameAsShipping && !billingAddress) {
            setError('Please fill in billing address');
            return;
        }

        onAddressSubmit({
            shipping: shippingAddress,
            billing: sameAsShipping ? shippingAddress : billingAddress!
        });
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Shipping Address</h2>
                <AddressForm
                    onAddressSubmit={handleShippingSubmit}
                    buttonText="Save Shipping Address"
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-primary focus:ring-primary-2 border-gray-300 rounded"
                    />
                    <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">
                        Billing address same as shipping?
                    </label>
                </div>

                {!sameAsShipping && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                        <AddressForm
                            onAddressSubmit={handleBillingSubmit}
                            buttonText="Save Billing Address"
                        />
                    </div>
                )}
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-2"
            >
                Continue to Payment
            </button>
        </div>
    );
};

export default CheckoutAddress;
