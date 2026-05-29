'use client';

import { useState } from 'react';
import ShippingDateForm from '@/components/cart/ShippingDateForm';

export default function ShippingDateTest() {
    const [date, setDate] = useState<string>('');

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm space-y-4">
                <h1 className="text-lg font-semibold">ShippingDateForm test</h1>
                <ShippingDateForm onShippingDateChange={setDate} />
                {date && (
                    <p className="text-sm text-green-700 font-mono">Selected: {date}</p>
                )}
            </div>
        </div>
    );
}
