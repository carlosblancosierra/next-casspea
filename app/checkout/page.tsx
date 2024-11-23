'use client';

import React from 'react';
import CheckoutAddress from '@/components/checkout/CheckoutAddress';

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

export default function CheckoutPage() {
    const handleAddressSubmit = async (addresses: {
        shipping: AddressData;
        billing: AddressData;
    }) => {
        try {
            console.log('Shipping:', addresses.shipping);
            console.log('Billing:', addresses.billing);
            // Handle the addresses (e.g., save to API, proceed to payment, etc.)
        } catch (error) {
            console.error('Error handling addresses:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>
            <CheckoutAddress onAddressSubmit={handleAddressSubmit} />
        </div>
    );
}
