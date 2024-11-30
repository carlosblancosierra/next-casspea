'use client';

import { useState } from 'react';

interface ShippingDateFormProps {
    onShippingDateChange: (date: string) => void;
}

export default function ShippingDateForm({ onShippingDateChange }: ShippingDateFormProps) {
    const [selectedDate, setSelectedDate] = useState('');

    const isWeekend = (date: Date): boolean => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const getNextBusinessDay = (date: Date): Date => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        while (isWeekend(nextDay)) {
            nextDay.setDate(nextDay.getDate() + 1);
        }
        return nextDay;
    };

    const tomorrow = getNextBusinessDay(new Date());
    const minDate = tomorrow.toISOString().split('T')[0];

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        if (isWeekend(selectedDate)) {
            const nextBusinessDay = getNextBusinessDay(selectedDate);
            const formattedDate = nextBusinessDay.toISOString().split('T')[0];
            setSelectedDate(formattedDate);
            onShippingDateChange(formattedDate);
        } else {
            setSelectedDate(e.target.value);
            onShippingDateChange(e.target.value);
        }
    };

    return (
        <div className="">
            <div className="space-y-1">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={minDate}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm
                        text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    onKeyDown={(e) => e.preventDefault()}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Shipping available on business days only
                </p>
            </div>
        </div>
    );
}
