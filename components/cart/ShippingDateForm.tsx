'use client';

import { useState } from 'react';
import Datepicker from "react-tailwindcss-datepicker";

interface ShippingDateFormProps {
    onShippingDateChange: (date: string) => void;
}

const toLocalDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ShippingDateForm({ onShippingDateChange }: ShippingDateFormProps) {
    const [value, setValue] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null
    });

    const getDisabledDates = () => {
        const disabled: { startDate: string; endDate: string }[] = [];

        const today = new Date();
        disabled.push({ startDate: '2000-01-01', endDate: toLocalDateStr(today) });

        const limit = new Date(today);
        limit.setDate(limit.getDate() + 90);

        const cursor = new Date(today);
        cursor.setDate(cursor.getDate() + 1);
        while (cursor <= limit) {
            if (cursor.getDay() === 0 || cursor.getDay() === 6) {
                const s = toLocalDateStr(cursor);
                disabled.push({ startDate: s, endDate: s });
            }
            cursor.setDate(cursor.getDate() + 1);
        }

        return disabled;
    };

    const getTomorrow = (): Date => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    return (
        <div className="space-y-1">
            <Datepicker
                asSingle={true}
                useRange={false}
                value={value}
                onChange={(newValue) => {
                    const raw = newValue?.startDate ?? null;
                    const dateStr = raw
                        ? typeof raw === 'string' ? raw : toLocalDateStr(raw as Date)
                        : null;
                    setValue({
                        startDate: dateStr ? new Date(dateStr) : null,
                        endDate: dateStr ? new Date(dateStr) : null,
                    });
                    if (dateStr) onShippingDateChange(dateStr);
                }}
                displayFormat="DD/MM/YYYY"
                placeholder="Select Shipping Date"
                startFrom={getTomorrow()}
                disabledDates={getDisabledDates()}
                readOnly={true}
                inputClassName="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm
                    text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                    transition-colors duration-200"
                containerClassName="relative w-full"
                toggleClassName="absolute right-0 h-full px-3 text-primary-text dark:text-primary-text-light focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                startWeekOn="sun"
            />
            <p className="text-xs text-primary-text dark:text-primary-text-light">
                Shipping available Monday to Friday only
            </p>
        </div>
    );
}
