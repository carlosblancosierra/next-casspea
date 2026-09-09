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

/** How we describe an option's chance of making the day the customer needs. */
type Verdict = { tone: 'good' | 'warn' | 'bad'; label: string };

const VERDICT_CLASSES: Record<Verdict['tone'], string> = {
    good: 'text-green-700 dark:text-green-400',
    warn: 'text-amber-700 dark:text-amber-400',
    bad: 'text-red-600 dark:text-red-400',
};

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
    // Optional: the day the customer needs it for. Used only to say which
    // services are likely to make it — never to promise one will, and never to
    // change what we actually do.
    const [neededBy, setNeededBy] = useState<Date | null>(null);
    const [showDispatchPicker, setShowDispatchPicker] = useState(false);
    const [showNeededByPicker, setShowNeededByPicker] = useState(false);

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

    const getEstimatedDeliveryDates = (minDays: number, maxDays: number) => {
        const minDeliveryDate = addBusinessDays(effectiveDispatch, minDays);
        const maxDeliveryDate = addBusinessDays(effectiveDispatch, maxDays);

        return {
            shipping: format(effectiveDispatch, 'EEE d MMM'),
            delivery: minDays === maxDays
                ? format(minDeliveryDate, 'EEE d MMM')
                : `${format(minDeliveryDate, 'EEE d MMM')} – ${format(maxDeliveryDate, 'EEE d MMM')}`,
            earliest: minDeliveryDate,
            latest: maxDeliveryDate,
        };
    };

    /**
     * How an option looks against the day the customer needs it.
     *
     * The wording carries the distinction that matters: only a service the
     * carrier contractually commits to gets "guaranteed". Everything else
     * "usually arrives" — true, and not a promise we cannot keep.
     */
    const getVerdict = (option: { guaranteed?: boolean }, earliest: Date, latest: Date): Verdict | null => {
        if (!neededBy) return null;
        const by = startOfDay(neededBy);

        if (!isAfter(startOfDay(latest), by)) {
            return option.guaranteed
                ? { tone: 'good', label: 'Guaranteed to arrive in time' }
                : { tone: 'good', label: 'Usually arrives in time' };
        }
        if (!isAfter(startOfDay(earliest), by)) {
            return { tone: 'warn', label: 'Might just make it' };
        }
        return { tone: 'bad', label: 'Unlikely to arrive in time' };
    };

    const selectableOptions = allShippingOptions.filter(option => !option.disabled);
    const nothingArrivesInTime = Boolean(neededBy)
        && selectableOptions.length > 0
        && selectableOptions.every(option => {
            const { earliest, latest } = getEstimatedDeliveryDates(option.estimated_days_min, option.estimated_days_max);
            return getVerdict(option, earliest, latest)?.tone === 'bad';
        });

    /**
     * The last day we could post and still expect it to land by `neededBy`.
     *
     * Chocolate for a birthday arriving eight days early is a real problem for
     * a shop selling fresh product, and this is the only point in the flow
     * where we know both dates. Suggestion only — it never moves on its own.
     */
    const suggestLaterDispatch = (maxDays: number): Date | null => {
        if (!neededBy) return null;
        let day = startOfDay(neededBy);
        for (let i = 0; i < 60; i++) {
            if (isShippingDay(day) && !isAfter(startOfDay(addBusinessDays(day, maxDays)), startOfDay(neededBy))) {
                return isAfter(startOfDay(earliestDispatch), day) ? null : day;
            }
            day = addDays(day, -1);
        }
        return null;
    };

    const selectedOption = selectableOptions.find(option => option.id.toString() === localSelectedOption);
    const suggestedDispatch = !dispatchDate && selectedOption
        ? suggestLaterDispatch(selectedOption.estimated_days_max)
        : null;
    // Only worth interrupting for if it moves things by more than a day or two.
    const showPostLaterNudge = suggestedDispatch
        && isAfter(startOfDay(suggestedDispatch), addDays(startOfDay(earliestDispatch), 2));

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
                                    setShowDispatchPicker(false);
                                    setShowNeededByPicker(false);
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

                    {/* The two date questions sit above the options because they
                        are what every estimate below is measured from. Both are
                        collapsed: most orders want posting as soon as possible,
                        and making everyone answer a date question first is
                        friction for the many to serve the few. */}
                    {deliveryType === 'shipping' && (
                        <div className="mb-5 space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
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

                            {showDispatchPicker && (
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

                            {!showNeededByPicker && !neededBy ? (
                                <button
                                    type="button"
                                    onClick={() => setShowNeededByPicker(true)}
                                    className="text-sm font-medium text-primary dark:text-primary-2 underline"
                                >
                                    Need it for a particular day?
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <ShippingDatePicker
                                        id="needed-by-date"
                                        label="I need it by"
                                        selected={neededBy}
                                        onChange={setNeededBy}
                                        minDate={earliestDispatch}
                                        placeholderText="Choose the day you need it"
                                        hint="We'll show how each service looks against that day. It doesn't change your order."
                                    />
                                    {neededBy && (
                                        <button
                                            type="button"
                                            onClick={() => { setNeededBy(null); setShowNeededByPicker(false); }}
                                            className="text-sm font-medium text-primary dark:text-primary-2 underline"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
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
                                const dates = getEstimatedDeliveryDates(option.estimated_days_min, option.estimated_days_max);
                                const verdict = isOptionDisabled ? null : getVerdict(option, dates.earliest, dates.latest);
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
                                                onChange={() => handleShippingChange(option.id.toString())}
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
                                                            Posting {dates.shipping}
                                                        </p>
                                                        {/* An option without the flag is treated as an
                                                            estimate: the field is optional so an older
                                                            API degrades to honest wording rather than
                                                            to a promise we cannot keep. */}
                                                        {option.guaranteed ? (
                                                            <>
                                                                <p className="text-primary-text dark:text-primary-text-light text-sm font-medium">
                                                                    Arrives {dates.delivery}
                                                                </p>
                                                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Guaranteed by Royal Mail
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <p className="text-primary-text dark:text-primary-text-light text-sm">
                                                                Estimated {dates.delivery}
                                                            </p>
                                                        )}
                                                        {verdict && (
                                                            <p className={`text-sm font-medium mt-1 ${VERDICT_CLASSES[verdict.tone]}`}>
                                                                {verdict.label}
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}

                            {showPostLaterNudge && suggestedDispatch && (
                                <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3 flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm text-primary-text dark:text-primary-text-light">
                                        Posting now means it could arrive well before{' '}
                                        {neededBy && format(neededBy, 'EEE d MMM')}. Chocolate is best fresh.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setDispatchDate(suggestedDispatch)}
                                        className="text-sm font-medium text-primary dark:text-primary-2 underline whitespace-nowrap"
                                    >
                                        Post on {format(suggestedDispatch, 'EEE d MMM')} instead
                                    </button>
                                </div>
                            )}

                            {/* Said once, under the list, rather than repeated on
                                every option — the distinction matters, the noise
                                doesn't. */}
                            <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70">
                                We guarantee the day we post. Delivery dates are Royal Mail estimates —
                                only Special Delivery guarantees the day it arrives.
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
