import { useState, useEffect } from 'react';
import { addBusinessDays, addDays, format, isAfter, startOfDay } from 'date-fns';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import CheckoutStorePickUp from './CheckoutStorePickUp';
import ShippingDatePicker from './ShippingDatePicker';
import type { ShippingCompany, ShippingOption } from '@/types/shipping';
import { STORE_PICKUP_OPTION_ID } from './constants';
import { getEarliestDispatch, isShippingDay, HOLIDAY_SHIP_DATE } from '@/utils/shippingDays';

// Re-exported for existing imports of these types from this module.
export type { ShippingCompany, ShippingOption };

interface Slot {
    start: string;
    end: string;
    value: string;
}

interface CheckoutShippingOptionsProps {
    shippingCompanies: ShippingCompany[] | undefined;
    selectedOptionId?: number;
    onShippingOptionChange: (optionId: number) => Promise<void>;
    onChangeStorePickup?: (val: { date: Date; slot: Slot } | null) => void;
    /** yyyy-mm-dd to hold the order back, or null to post as soon as possible. */
    onDispatchDateChange?: (date: string | null) => void;
}

const CheckoutShippingOptions: React.FC<CheckoutShippingOptionsProps> = ({
    shippingCompanies,
    selectedOptionId,
    onShippingOptionChange,
    onChangeStorePickup,
    onDispatchDateChange
}) => {
    const [localSelectedOption, setLocalSelectedOption] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { data: cart, isLoading, error: cartError } = useGetCartQuery();
    const [storePickup, setStorePickup] = useState<{ date: Date; slot: Slot } | null>(null);
    // Defaults to shipping so options and prices are visible on arrival. This
    // is not the bug that was just fixed: defaulting the *mode* does not select
    // an *option* — the list below starts empty and Continue stays disabled
    // until the customer actually picks one.
    const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup'>('shipping');
    // null means "post it as soon as you can" — what most people want. A date
    // holds the parcel back, for a gift that shouldn't land three weeks early.
    const [dispatchDate, setDispatchDate] = useState<Date | null>(null);
    // The day the customer needs it for. This is the question most of these
    // orders actually turn on — they know the birthday, not the posting day —
    // so it works backwards: their date becomes the LAST day of each service's
    // range, and the posting day is derived from it.
    const [neededBy, setNeededBy] = useState<Date | null>(null);
    const [timing, setTiming] = useState<'asap' | 'by_date'>('asap');
    const [showDispatchPicker, setShowDispatchPicker] = useState(false);

    // Expose storePickup to parent if onChangeStorePickup is provided
    useEffect(() => {
        if (onChangeStorePickup) {
            onChangeStorePickup(storePickup);
        }
    }, [storePickup, onChangeStorePickup]);

    // Update local state when prop changes
    useEffect(() => {
        if (selectedOptionId) {
            setLocalSelectedOption(selectedOptionId.toString());
        }
    }, [selectedOptionId]);

    useEffect(() => {
        if (!onDispatchDateChange) return;
        onDispatchDateChange(dispatchDate ? format(dispatchDate, 'yyyy-MM-dd') : null);
    }, [dispatchDate, onDispatchDateChange]);

    let allShippingOptions = shippingCompanies?.flatMap(company =>
        company.shipping_options.map(option => ({
            ...option,
            companyName: company.name,
            companyId: company.id
        }))
    ) || [];

    // Captured before the delivery-type filter below narrows the list, so the
    // "nothing to show" guard still means "the API returned no options at all".
    const hasAnyShippingOptions = allShippingOptions.length > 0;
    const pickupOption = allShippingOptions.find(option => option.id === STORE_PICKUP_OPTION_ID);

    // Filter by delivery type
    if (deliveryType === 'pickup') {
        allShippingOptions = allShippingOptions.filter(option => option.id === STORE_PICKUP_OPTION_ID);
    } else if (deliveryType === 'shipping') {
        allShippingOptions = allShippingOptions.filter(option => option.id !== STORE_PICKUP_OPTION_ID);
    }

    // Filter out redundant free shipping options - show only the priciest one
    const freeOptions = allShippingOptions.filter(option => parseFloat(option.price.toString()) === 0);
    const paidOptions = allShippingOptions.filter(option => parseFloat(option.price.toString()) > 0);

    if (freeOptions.length > 1) {
        // If multiple free options, keep only the one with the highest original price (most valuable)
        const priciestFreeOption = freeOptions.reduce((priciest, current) =>
            parseFloat(current.original_price || current.price) > parseFloat(priciest.original_price || priciest.price)
                ? current
                : priciest
        );
        allShippingOptions = [priciestFreeOption, ...paidOptions];
    } else {
        allShippingOptions = [...freeOptions, ...paidOptions];
    }

    // Sort: enabled options first, then disabled. Deliberately *not* re-sorted
    // by how well each fits the "need it by" date — shuffling radio buttons
    // under someone mid-decision is worse than annotating them in place.
    allShippingOptions = allShippingOptions.sort((a, b) => {
        if (a.disabled === b.disabled) return 0;
        return a.disabled ? 1 : -1;
    });

    // No option is auto-selected. Selecting one for the customer meant they
    // could reach payment — and be charged for a shipping method — without
    // ever choosing it, because the parent's "did you pick shipping?" guard
    // saw a value it had set itself. The customer picks, or nothing is picked.

    const handleShippingChange = async (optionId: string) => {
        if (isUpdating) return;
        const option = allShippingOptions.find(opt => opt.id.toString() === optionId);
        if (!option || option.disabled) return; // Prevent selecting disabled

        setIsUpdating(true);
        setLocalSelectedOption(optionId);

        try {
            await onShippingOptionChange(parseInt(optionId));
        } finally {
            setIsUpdating(false);
        }
    };

    const earliestDispatch = getEarliestDispatch();

    // Previously this always measured from today, so a customer who asked us to
    // hold the order until the 20th was still shown "ships tomorrow" and an
    // arrival estimate to match. The date they picked is the one that counts.
    const effectiveDispatch = dispatchDate ?? earliestDispatch;

    /**
     * The latest day we can post and still expect arrival by `by`.
     *
     * This is the whole "I need it for the 28th" answer. The customer knows
     * the date of the occasion, not how long Royal Mail takes, so we do that
     * arithmetic: their date becomes the last day of the service's range and
     * the posting day falls out of it. Returns null when no posting day works
     * — which only happens if even posting today is too late.
     */
    const latestPostingDayFor = (maxDays: number, by: Date): Date | null => {
        let day = startOfDay(by);
        for (let i = 0; i < 90; i++) {
            if (isShippingDay(day) && !isAfter(startOfDay(addBusinessDays(day, maxDays)), startOfDay(by))) {
                return day;
            }
            day = addDays(day, -1);
        }
        return null;
    };

    /**
     * What one service looks like given the customer's answer.
     *
     * In "by date" mode each option gets its OWN posting day — a slower
     * service has to leave earlier — so this cannot be derived from a single
     * shared dispatch date.
     */
    const planFor = (option: { estimated_days_min: number; estimated_days_max: number; guaranteed?: boolean }) => {
        const byDate = timing === 'by_date' ? neededBy : null;

        let posting = effectiveDispatch;
        let arrivesInTime = true;

        if (byDate) {
            const ideal = latestPostingDayFor(option.estimated_days_max, byDate);
            // Never post earlier than we can, and never claim a date we would
            // miss: if holding is impossible we post as soon as we can and say
            // outright that it is not expected to make it.
            if (ideal && !isAfter(startOfDay(earliestDispatch), ideal)) {
                posting = ideal;
            } else {
                posting = earliestDispatch;
                arrivesInTime = false;
            }
        }

        const earliest = addBusinessDays(posting, option.estimated_days_min);
        const latest = addBusinessDays(posting, option.estimated_days_max);

        return {
            posting,
            earliest,
            latest,
            arrivesInTime,
            postingLabel: format(posting, 'EEE d MMM'),
            // A single day is the carrier's promise, not our shorthand: only
            // the guaranteed service is stored with min === max.
            singleDay: option.estimated_days_min === option.estimated_days_max,
            earliestLabel: format(earliest, 'EEE d MMM'),
            latestLabel: format(latest, 'EEE d MMM'),
            rangeLabel: option.estimated_days_min === option.estimated_days_max
                ? format(earliest, 'EEE d MMM')
                : `${format(earliest, 'EEE d MMM')} \u2013 ${format(latest, 'EEE d MMM')}`,
        };
    };

    const selectableOptions = allShippingOptions.filter(option => !option.disabled);
    const byDate = timing === 'by_date' ? neededBy : null;
    const nothingArrivesInTime = Boolean(byDate)
        && selectableOptions.length > 0
        && selectableOptions.every(option => !planFor(option).arrivesInTime);

    // Helper function to render shipping price with discount
    const renderShippingPrice = (option: ShippingOption) => {
        const discountedPrice = parseFloat(option.price);
        const originalPrice = parseFloat(option.original_price || option.price);
        const discountAmount = parseFloat(option.discount_amount || '0');

        // If original price was 0, just show FREE
        if (originalPrice === 0) {
            return (
                <span className="text-base font-semibold text-primary dark:text-primary-2">
                    FREE
                </span>
            );
        }

        // If discounted price is 0, show FREE with original price struck through
        if (discountedPrice === 0) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-primary dark:text-primary-2">
                        FREE
                    </span>
                    <span className="text-sm text-primary-text dark:text-primary-text-light line-through">
                        Was {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(originalPrice)}
                    </span>
                </div>
            );
        }

        // If there's a discount, show discounted price with original struck through
        if (discountAmount > 0) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-primary-text dark:text-primary-text-light">
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(discountedPrice)}
                    </span>
                    <span className="text-sm text-primary-text dark:text-primary-text-light line-through">
                        Was {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(originalPrice)}
                    </span>
                </div>
            );
        }

        // No discount, show regular price
        return (
            <span className="text-base font-semibold text-primary-text dark:text-primary-text-light">
                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(discountedPrice)}
            </span>
        );
    };

    if (!hasAnyShippingOptions) return null;

    const isHolidayPeriod = new Date() < HOLIDAY_SHIP_DATE;

    return (
        <div className="main-bg p-6 rounded-lg shadow dark:bg-main-bg-dark">
            {isHolidayPeriod && (
                <div className="mb-4 rounded-md border border-amber-200 dark:border-amber-700 p-3 bg-amber-50 dark:bg-amber-900/20 flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                        Due to the Spring Bank Holiday &amp; high temperatures, all orders placed before 26 May will ship on <strong>Tuesday 26 May</strong>.
                    </p>
                </div>
            )}
            <h2 className="text-xl font-semibold mb-4 text-primary-text dark:text-primary-text-light">
                Delivery
            </h2>

            {/* Segmented control, the pattern most checkouts use for this: it
                stays visible so switching is one tap and there is no dead end,
                and the options below are reachable without an extra screen. */}
            <div
                role="radiogroup"
                aria-label="How would you like to receive your order?"
                className="flex p-1 mb-4 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
                {([
                    { value: 'shipping', label: 'Ship to me' },
                    { value: 'pickup', label: 'Collect in store' },
                ] as const).map(({ value, label }) => {
                    const isActive = deliveryType === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => {
                                if (deliveryType === value) return;
                                // Switching mode clears the pick: options in the
                                // other mode are a different set, and leaving a
                                // stale id selected would let the customer pay
                                // for something no longer on screen.
                                setDeliveryType(value);
                                setStorePickup(null);

                                // Collection has its own date and time, so a
                                // posting date on a pickup order is wrong data
                                // in the admin as well as a meaningless question.
                                if (value === 'pickup') {
                                    setDispatchDate(null);
                                    setNeededBy(null);
                                    setTiming('asap');
                                    setShowDispatchPicker(false);
                                }

                                // Collection has exactly one option, so asking the
                                // customer to tick it after choosing "Collect in
                                // store" is a click that means nothing. Choosing
                                // the mode is choosing the option — which is still
                                // their choice, not one made for them.
                                const pickup = value === 'pickup'
                                    ? pickupOption
                                    : undefined;
                                if (pickup && !pickup.disabled) {
                                    setLocalSelectedOption(pickup.id.toString());
                                    onShippingOptionChange(pickup.id);
                                } else {
                                    setLocalSelectedOption(null);
                                }
                            }}
                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-colors ${
                                isActive
                                    ? 'bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text-light shadow-sm'
                                    : 'text-primary-text/70 dark:text-primary-text-light/70 hover:text-primary-text dark:hover:text-primary-text-light'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <>
                    <p className="text-sm text-primary-text dark:text-primary-text-light mb-4">
                        {deliveryType === 'shipping'
                            ? 'Choose your preferred shipping method below.'
                            : 'Pick up your order from our Bedford Hill store. Choose a convenient time slot.'
                        }
                    </p>

                    {/* The question this whole step turns on, asked outright
                        instead of hidden behind a link. Most of these orders
                        are for a fixed day, and the customer knows the day —
                        not how long Royal Mail takes. */}
                    {deliveryType === 'shipping' && (
                        <div className="mb-5 space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <p className="text-sm font-medium text-primary-text dark:text-primary-text-light">
                                When do you need it?
                            </p>

                            <div
                                role="radiogroup"
                                aria-label="When do you need it?"
                                className="flex p-1 rounded-lg bg-gray-100 dark:bg-gray-800"
                            >
                                {([
                                    { value: 'asap', label: 'As soon as possible' },
                                    { value: 'by_date', label: 'For a particular day' },
                                ] as const).map(({ value, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        role="radio"
                                        aria-checked={timing === value}
                                        onClick={() => {
                                            if (timing === value) return;
                                            setTiming(value);
                                            // Each mode derives the posting day
                                            // differently, so a date carried
                                            // over from the other one would be
                                            // an answer to a question nobody
                                            // asked.
                                            setDispatchDate(null);
                                            setShowDispatchPicker(false);
                                            if (value === 'asap') setNeededBy(null);
                                        }}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                                            timing === value
                                                ? 'bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text-light shadow-sm'
                                                : 'text-primary-text/70 dark:text-primary-text-light/70 hover:text-primary-text dark:hover:text-primary-text-light'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {timing === 'asap' ? (
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm text-primary-text dark:text-primary-text-light">
                                        {dispatchDate
                                            ? <>Holding your order to post on <strong>{format(dispatchDate, 'EEE d MMM')}</strong></>
                                            : <>We&apos;ll post your order on <strong>{format(earliestDispatch, 'EEE d MMM')}</strong></>
                                        }
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {dispatchDate && (
                                            <button
                                                type="button"
                                                onClick={() => { setDispatchDate(null); setShowDispatchPicker(false); }}
                                                className="text-sm font-medium text-primary dark:text-primary-2 underline"
                                            >
                                                Post as soon as possible
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowDispatchPicker(open => !open)}
                                            className="text-sm font-medium text-primary dark:text-primary-2 underline"
                                        >
                                            Choose a different day
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <ShippingDatePicker
                                        id="needed-by-date"
                                        label="I need it by"
                                        selected={neededBy}
                                        onChange={date => { setNeededBy(date); setDispatchDate(null); }}
                                        minDate={earliestDispatch}
                                        placeholderText="Choose the day you need it"
                                    />
                                    {neededBy && (
                                        <p className="text-sm text-primary-text dark:text-primary-text-light">
                                            We&apos;ll time the posting so each service below aims to arrive by{' '}
                                            <strong>{format(neededBy, 'EEE d MMM')}</strong> at the latest.
                                            Choose one to fix the posting day.
                                        </p>
                                    )}
                                </div>
                            )}

                            {timing === 'asap' && showDispatchPicker && (
                                <ShippingDatePicker
                                    id="dispatch-date"
                                    label="Post my order on"
                                    selected={dispatchDate}
                                    onChange={setDispatchDate}
                                    minDate={earliestDispatch}
                                    filterDate={isShippingDay}
                                    placeholderText="Choose a posting day"
                                    hint="We post Monday to Friday. Choosing a day later than the earliest holds your order until then."
                                />
                            )}
                        </div>
                    )}

                    {nothingArrivesInTime && (
                        <div className="mb-4 rounded-md border border-red-200 dark:border-red-800 p-3 bg-red-50 dark:bg-red-900/20">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                We don&apos;t expect any of these to reach you by{' '}
                                <strong>{neededBy && format(neededBy, 'EEE d MMM')}</strong>. Collecting in
                                store may work, or pick a later day.
                            </p>
                        </div>
                    )}

                    {/* Collection needs no radio list: the toggle already chose it,
                        and there is only one option behind it. Show what they get
                        instead of asking them to tick a list of one. */}
                    {deliveryType === 'pickup' && pickupOption && (
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <p className="text-sm font-semibold text-primary-text dark:text-primary-text-light">
                                Pick up at 104 Bedford Hill, London, SW12 9HR
                            </p>
                            {renderShippingPrice(pickupOption)}
                        </div>
                    )}

                    {deliveryType === 'shipping' && allShippingOptions.length > 0 && (
                        <div className="space-y-4">
                            {allShippingOptions.map((option) => {
                                const isOptionDisabled = option.disabled;
                                const plan = planFor(option);
                                return (
                                    <label
                                        key={option.id}
                                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer
                                            ${isUpdating || isOptionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover: dark:hover:bg-gray-700'}
                                            ${localSelectedOption === option.id.toString() ? 'border-primary-2 ring-1 ring-primary-2' : 'border-gray-200'}`}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={option.id.toString()}
                                                checked={localSelectedOption === option.id.toString()}
                                                onChange={() => {
                                                    if (byDate) setDispatchDate(plan.posting);
                                                    handleShippingChange(option.id.toString());
                                                }}
                                                disabled={isUpdating || isOptionDisabled}
                                                className="h-4 w-4 text-primary focus:ring-primary-2"
                                            />
                                            <div className="ml-3">
                                                <h3 className="font-medium text-primary-text dark:text-primary-text-light">
                                                    {option.companyName} - {option.name}
                                                </h3>
                                                {renderShippingPrice(option)}
                                                {isOptionDisabled ? (
                                                    <p className="text-red-600 dark:text-red-400 text-sm">
                                                        {option.disabled_reason}
                                                    </p>
                                                ) : (
                                                    <>
                                                        <p className="text-primary-text dark:text-primary-text-light text-sm">
                                                            Posting {plan.postingLabel}
                                                        </p>

                                                        {/* The arrival line states exactly what the
                                                            carrier states. A range is shown as a range —
                                                            printing one date for a service Royal Mail
                                                            describes as "two to three working days" is a
                                                            promise nobody has made. An option without the
                                                            guaranteed flag is treated as an estimate, so
                                                            an older API degrades honestly. */}
                                                        <p className={`text-primary-text dark:text-primary-text-light text-sm ${option.guaranteed ? 'font-medium' : ''}`}>
                                                            {plan.singleDay
                                                                ? <>Arrives <strong>{plan.earliestLabel}</strong></>
                                                                : <>Arrives between <strong>{plan.earliestLabel}</strong> and <strong>{plan.latestLabel}</strong></>}
                                                        </p>

                                                        {option.guaranteed && (
                                                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                {byDate
                                                                    ? 'The only service guaranteed for a set day'
                                                                    : 'Guaranteed by Royal Mail'}
                                                            </span>
                                                        )}

                                                        {/* Said on the option itself, not only in the
                                                            footnote. The guaranteed service needs it most:
                                                            it is the one line on the page that names a
                                                            single arrival date, and the guarantee behind
                                                            it is Royal Mail's, not ours. */}
                                                        {option.guaranteed ? (
                                                            <p className="mt-1 text-xs text-primary-text/70 dark:text-primary-text-light/70">
                                                                Royal Mail guarantees this date and compensates if it is late.
                                                                What we guarantee is that it leaves us on {plan.postingLabel}.
                                                            </p>
                                                        ) : byDate && plan.arrivesInTime && (
                                                            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                                                                Royal Mail gives this as a range, not a promise. What we
                                                                guarantee is that it is posted on {plan.postingLabel}.
                                                            </p>
                                                        )}

                                                        {byDate && !plan.arrivesInTime && (
                                                            <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
                                                                Not expected to make {format(byDate, 'EEE d MMM')} — even
                                                                posting on {plan.postingLabel} it is estimated {plan.rangeLabel}.
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}

                            {/* Said once, under the list, rather than repeated on
                                every option — the distinction matters, the noise
                                doesn't. */}
                            <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70">
                                We guarantee the day we post, and nothing more: once it is with Royal Mail
                                the delivery date is their estimate. Special Delivery is the only service
                                that guarantees the day it arrives.
                            </p>
                        </div>
                    )}

                    {deliveryType === 'pickup' && pickupOption && (
                        <div className="mt-6">
                            <CheckoutStorePickUp onChange={(val) => {
                                setStorePickup(val);
                            }} />
                            {!storePickup && (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                                Pickup Time Required
                                            </h3>
                                            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                                                Please select both a pickup date and time slot to continue with your order.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
        </div>
    );
};

export default CheckoutShippingOptions;
