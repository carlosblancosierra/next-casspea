'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ShippingDateFormProps {
    onShippingDateChange: (date: string) => void;
}

const toLocalDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getTomorrow = (): Date => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
};

const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

export default function ShippingDateForm({ onShippingDateChange }: ShippingDateFormProps) {
    const [selected, setSelected] = useState<Date | null>(null);

    return (
        <div className="space-y-1">
            <DatePicker
                selected={selected}
                onChange={(date) => {
                    setSelected(date);
                    if (date) onShippingDateChange(toLocalDateStr(date));
                }}
                minDate={getTomorrow()}
                filterDate={isWeekday}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Shipping Date"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm
                    text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                    transition-colors duration-200"
                wrapperClassName="w-full"
                readOnly={false}
                showPopperArrow={false}
            />
            <p className="text-xs text-primary-text dark:text-primary-text-light">
                Shipping available Monday to Friday only
            </p>
        </div>
    );
}
