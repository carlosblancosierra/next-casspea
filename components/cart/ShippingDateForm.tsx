'use client';

import { useState } from 'react';
import Datepicker from "react-tailwindcss-datepicker";

interface ShippingDateFormProps {
    onShippingDateChange: (date: string) => void;
}

export default function ShippingDateForm({ onShippingDateChange }: ShippingDateFormProps) {
    const [value, setValue] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null
    });

    // Get all disabled dates including past dates and weekends
    const getDisabledDates = () => {
        const disabled = [];

        // Add all past dates including today as one range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        disabled.push({
            startDate: new Date("2000-01-01"),
            endDate: today
        });

        // Add weekends for the next 90 days
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 90);

        let currentDate = new Date(today);
        while (currentDate <= endDate) {
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                disabled.push({
                    startDate: new Date(currentDate),
                    endDate: new Date(currentDate)
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return disabled;
    };

    // Get tomorrow's date
    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    };

    return (
        <div className="space-y-1">
            <Datepicker
                asSingle={true}
                useRange={false}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                    if (newValue?.startDate) {
                        onShippingDateChange(newValue.startDate.toString());
                    }
                }}
                displayFormat="DD/MM/YYYY"
                placeholder="Select delivery date"
                startFrom={getTomorrow()}
                disabledDates={getDisabledDates()}
                readOnly={true}
                inputClassName="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm
                    text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                    transition-colors duration-200"
                containerClassName="relative w-full"
                toggleClassName="absolute right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                startWeekOn="mon"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Shipping available Monday to Friday only
            </p>
        </div>
    );
}
