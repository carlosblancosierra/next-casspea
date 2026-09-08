import { useState, useEffect } from 'react';
import { addBusinessDays, format } from 'date-fns';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import CheckoutStorePickUp from './CheckoutStorePickUp';
import type { ShippingCompany, ShippingOption } from '@/types/shipping';
import { STORE_PICKUP_OPTION_ID } from './constants';

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
}

const CheckoutShippingOptions: React.FC<CheckoutShippingOptionsProps> = ({
    shippingCompanies,
    selectedOptionId,
    onShippingOptionChange,
    onChangeStorePickup
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

    // Sort: enabled options first, then disabled
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

    const getEstimatedDeliveryDates = (minDays: number, maxDays: number) => {
        const now = new Date();
        // Get current hour in UK time (handles GMT/BST automatically)
        const ukHour = parseInt(
            new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(now)
        );
        const SHIPPING_CUTOFF_HOUR = 10;
        // Spring Bank Holiday + high temperature delay: all orders ship on 26 May 2026
        const HOLIDAY_SHIP_DATE = new Date('2026-05-26T00:00:00+01:00');
        const isHolidayPeriod = now < HOLIDAY_SHIP_DATE;
        const shippingDate = isHolidayPeriod
            ? HOLIDAY_SHIP_DATE
            : ukHour < SHIPPING_CUTOFF_HOUR ? now : addBusinessDays(now, 1);
        const minDeliveryDate = addBusinessDays(shippingDate, minDays);
        const maxDeliveryDate = addBusinessDays(shippingDate, maxDays);

        return {
            shipping: format(shippingDate, 'EEE, d MMM'),
            delivery: minDays === maxDays
                ? format(minDeliveryDate, 'EEE, d MMM')
                : `${format(minDeliveryDate, 'EEE, d MMM')} - ${format(maxDeliveryDate, 'EEE, d MMM')}`
        };
    };

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

    const isHolidayPeriod = new Date() < new Date('2026-05-26T00:00:00+01:00');

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
                                                        {option.id === STORE_PICKUP_OPTION_ID ? (
                                                            <p className="text-primary-text dark:text-primary-text-light text-sm font-semibold">
                                                                Pick up at 104 Bedford Hill, London, SW12 9HR
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="text-primary-text dark:text-primary-text-light text-sm">
                                                                    Ships: {dates.shipping}
                                                                </p>
                                                                <p className="text-primary-text dark:text-primary-text-light text-sm">
                                                                    Estimated Delivery: {dates.delivery}
                                                                </p>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
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

                    {/* <p className="text-sm text-primary-text dark:text-primary-text-light mb-2">
                        Due to the current high temperatures in the UK, we have temporarily disabled the Royal Mail - Tracked 48® service.
                    </p> */}
                </>
        </div>
    );
};

export default CheckoutShippingOptions;
