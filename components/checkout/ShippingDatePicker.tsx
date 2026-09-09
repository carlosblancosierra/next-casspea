'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ShippingDatePickerProps {
    id: string;
    /** Rendered as a real <label>, so the field is reachable by name. */
    label: string;
    selected: Date | null;
    onChange: (date: Date | null) => void;
    minDate: Date;
    /** Omitted for the "need it by" date — birthdays fall on Saturdays. */
    filterDate?: (date: Date) => boolean;
    placeholderText: string;
    hint?: string;
}

/**
 * Moved here from components/cart. It sits with the delivery options now,
 * because the date it sets is what every estimate below it is measured from.
 *
 * A calendar rather than the day chips used for store collection: collection
 * is always in the next couple of weeks, but a birthday can be five weeks out,
 * and a scrolling strip that long is worse than a month view.
 */
export default function ShippingDatePicker({
    id,
    label,
    selected,
    onChange,
    minDate,
    filterDate,
    placeholderText,
    hint,
}: ShippingDatePickerProps) {
    return (
        <div className="space-y-1">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-primary-text dark:text-primary-text-light"
            >
                {label}
            </label>
            <DatePicker
                id={id}
                selected={selected}
                onChange={onChange}
                minDate={minDate}
                filterDate={filterDate}
                dateFormat="EEE d MMM yyyy"
                placeholderText={placeholderText}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm
                    text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark
                    focus:outline-none focus:ring-2 focus:ring-primary-2
                    transition-colors duration-200"
                wrapperClassName="w-full"
                showPopperArrow={false}
            />
            {hint && (
                <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70">{hint}</p>
            )}
        </div>
    );
}
