'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import {
    canShipToday,
    getEarliestShipDate,
    getMinSelectableShipDate,
    isBusinessDay,
    parseLocalDateStr,
    toLocalDateStr,
} from '@/utils/shippingDate';

interface ShippingDateSelectorProps {
    /** YYYY-MM-DD when the customer picked a date, null for ASAP. */
    value: string | null;
    onChange: (date: string | null) => void;
}

export default function ShippingDateSelector({ value, onChange }: ShippingDateSelectorProps) {
    const [mode, setMode] = useState<'asap' | 'later'>(value ? 'later' : 'asap');

    const earliestShipDate = getEarliestShipDate();
    const sameDayPossible = canShipToday();

    const selectAsap = () => {
        setMode('asap');
        onChange(null);
    };

    const selectLater = () => {
        setMode('later');
        // Pre-fill so there is never a "later" selection without a date
        if (!value) {
            onChange(toLocalDateStr(getMinSelectableShipDate()));
        }
    };

    const cardClasses = (selected: boolean) =>
        `w-full p-4 border-2 rounded-lg text-left transition-all duration-200
        ${selected
            ? 'border-primary dark:border-primary-2 bg-primary/5 dark:bg-primary-2/10'
            : 'border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary-2/50'
        }`;

    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-base font-semibold text-primary-text dark:text-primary-text-light">
                    When should we ship your order?
                </h3>
                <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
                    Your delivery date depends on the delivery speed you pick below.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ASAP */}
                <button type="button" onClick={selectAsap} className={cardClasses(mode === 'asap')}>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary-text dark:text-primary-text-light">
                            As soon as possible
                        </span>
                        {sameDayPossible && (
                            <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full px-2 py-0.5">
                                Ships today
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                        {sameDayPossible
                            ? 'Order now to make our 10am dispatch.'
                            : `Ships ${format(earliestShipDate, 'EEEE d MMMM')}, our next dispatch day.`}
                    </p>
                </button>

                {/* Later date */}
                <button type="button" onClick={selectLater} className={cardClasses(mode === 'later')}>
                    <span className="font-semibold text-primary-text dark:text-primary-text-light">
                        On a date you choose
                    </span>
                    <p className="mt-1 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                        We&apos;ll hold your order and ship it on the day you pick &mdash; ideal for
                        birthdays and gifts.
                    </p>
                </button>
            </div>

            {mode === 'later' && (
                <div className="space-y-1">
                    <DatePicker
                        selected={value ? parseLocalDateStr(value) : null}
                        onChange={(date) => {
                            if (date) onChange(toLocalDateStr(date));
                        }}
                        minDate={getMinSelectableShipDate()}
                        filterDate={isBusinessDay}
                        dateFormat="EEEE d MMMM yyyy"
                        placeholderText="Pick a shipping date"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm
                            text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark
                            focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-2
                            transition-colors duration-200"
                        wrapperClassName="w-full"
                        showPopperArrow={false}
                    />
                    <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70">
                        We ship Monday to Friday.
                    </p>
                </div>
            )}
        </div>
    );
}
