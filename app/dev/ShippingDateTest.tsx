'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import ShippingDatePicker from '@/components/checkout/ShippingDatePicker';
import { getEarliestDispatch, isShippingDay } from '@/utils/shippingDays';

export default function ShippingDateTest() {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm space-y-4">
                <h1 className="text-lg font-semibold">ShippingDatePicker test</h1>
                <ShippingDatePicker
                    id="dev-shipping-date"
                    label="Posting day"
                    selected={date}
                    onChange={setDate}
                    minDate={getEarliestDispatch()}
                    filterDate={isShippingDay}
                    placeholderText="Choose a posting day"
                />
                {date && (
                    <p className="text-sm text-green-700 font-mono">
                        Selected: {format(date, 'yyyy-MM-dd')}
                    </p>
                )}
            </div>
        </div>
    );
}
