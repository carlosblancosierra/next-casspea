'use client';

import { useState } from 'react';
import ShippingDateSelector from '@/components/checkout/ShippingDateSelector';

export default function ShippingDateTest() {
    const [date, setDate] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg space-y-4">
                <h1 className="text-lg font-semibold">ShippingDateSelector test</h1>
                <ShippingDateSelector value={date} onChange={setDate} />
                <p className="text-sm text-green-700 font-mono">Selected: {date ?? 'ASAP'}</p>
            </div>
        </div>
    );
}
