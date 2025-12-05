import { useState, useEffect } from 'react';
import { addBusinessDays, format } from 'date-fns';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import CheckoutStorePickUp from './CheckoutStorePickUp';

export interface ShippingOption {
    id: number;
    name: string;
    delivery_speed: string;
    price: string; // Now returns discounted price as string
    original_price?: string;
    discounted_price?: string;
    discount_amount?: string;
    estimated_days_min: number;
    estimated_days_max: number;
    description: string;
    disabled: boolean;
    disabled_reason: string;
}

export interface ShippingCompany {
    id: number;
    name: string;
    code: string;
    website: string;
    track_url: string;
    shipping_options: ShippingOption[];
}

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
    const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup' | null>(null);

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

    // Auto-select option when delivery type changes
    useEffect(() => {
        if (deliveryType && allShippingOptions.length > 0 && !localSelectedOption) {
            const firstEnabled = allShippingOptions.find(opt => !opt.disabled);
            if (firstEnabled) {
                setLocalSelectedOption(firstEnabled.id.toString());
                onShippingOptionChange(firstEnabled.id);
            }
        }
    }, [deliveryType, allShippingOptions, localSelectedOption, onShippingOptionChange]);

    // Filter by delivery type
    if (deliveryType === 'pickup') {
        allShippingOptions = allShippingOptions.filter(option => option.id === 34); // Store pickup option
    } else if (deliveryType === 'shipping') {
        allShippingOptions = allShippingOptions.filter(option => option.id !== 34); // All except store pickup
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

    // Set default option if none selected, and never select a disabled option (only when no delivery type is selected)
    useEffect(() => {
        if (allShippingOptions.length && !localSelectedOption && !deliveryType) {
            const firstEnabled = allShippingOptions.find(opt => !opt.disabled);
            if (firstEnabled) {
                setLocalSelectedOption(firstEnabled.id.toString());
                onShippingOptionChange(firstEnabled.id);
            }
        }
    }, [allShippingOptions, localSelectedOption, deliveryType]);

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
        const today = new Date();
        const shippingDate = addBusinessDays(today, 1);
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
    const renderShippingPrice = (option: any) => {
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
                    <span className="text-sm text-primary-text line-through">
                        Was {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(originalPrice)}
                    </span>
                </div>
            );
        }

        // If there's a discount, show discounted price with original struck through
        if (discountAmount > 0) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-primary-text dark:text-primary-text">
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(discountedPrice)}
                    </span>
                    <span className="text-sm text-primary-text line-through">
                        Was {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(originalPrice)}
                    </span>
                </div>
            );
        }

        // No discount, show regular price
        return (
            <span className="text-base font-semibold text-primary-text dark:text-primary-text">
                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(discountedPrice)}
            </span>
        );
    };

    if (!allShippingOptions.length && !deliveryType) return null;

    return (
        <div className="main-bg p-6 rounded-lg shadow dark:bg-main-bg-dark">
            <h2 className="text-xl font-semibold mb-4 text-primary-text dark:text-primary-text">
                {deliveryType ? 'Shipping Options' : 'How would you like to receive your order?'}
            </h2>

            {!deliveryType ? (
                <div className="space-y-4">
                    <p className="text-sm text-primary-text dark:text-primary-text mb-6">
                        Choose how you'd like to receive your chocolate order.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Shipping Delivery Option */}
                        <button
                            onClick={() => setDeliveryType('shipping')}
                            className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary-2 hover:bg-primary/5 dark:hover:bg-primary-2/10 transition-all duration-200 text-left group"
                        >
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 group-hover:bg-primary dark:group-hover:bg-primary-2 transition-colors">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary-text dark:text-primary-text">Shipping Delivery</h3>
                                    <p className="text-sm text-primary-text dark:text-primary-text">Delivered to your address</p>
                                </div>
                            </div>
                            <p className="text-sm text-primary-text dark:text-primary-text">
                                Choose from various shipping options with different delivery speeds and costs.
                            </p>
                        </button>

                        {/* Store Pickup Option */}
                        <button
                            onClick={() => setDeliveryType('pickup')}
                            className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary-2 hover:bg-primary/5 dark:hover:bg-primary-2/10 transition-all duration-200 text-left group"
                        >
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 group-hover:bg-primary dark:group-hover:bg-primary-2 transition-colors">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary-text dark:text-primary-text">Store Pickup</h3>
                                    <p className="text-sm text-primary-text dark:text-primary-text">Collect from our store</p>
                                </div>
                            </div>
                            <p className="text-sm text-primary-text dark:text-primary-text">
                                Pick up your order from our Bedford Hill store location. Schedule a pickup time.
                            </p>
                        </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                            onClick={() => setDeliveryType('shipping')}
                            className="text-sm text-primary dark:text-primary-2 hover:text-primary-2 dark:hover:text-primary font-medium"
                        >
                            Skip to shipping options →
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-primary-text dark:text-primary-text">
                            {deliveryType === 'shipping'
                                ? 'Orders will be shipped ASAP, usually within 24 hours. Delivery Date depends on the shipping option selected.'
                                : 'Pick up your order from our Bedford Hill store. Choose a convenient time slot.'
                            }
                        </p>
                        <button
                            onClick={() => {
                                setDeliveryType(null);
                                setLocalSelectedOption(null);
                            }}
                            className="text-sm text-primary dark:text-primary-2 hover:text-primary-2 dark:hover:text-primary font-medium flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Change method
                        </button>
                    </div>

                    {allShippingOptions.length > 0 && (
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
                                                <h3 className="font-medium text-primary-text dark:text-primary-text">
                                                    {option.companyName} - {option.name}
                                                </h3>
                                                {renderShippingPrice(option)}
                                                {isOptionDisabled ? (
                                                    <p className="text-red-600 dark:text-red-400 text-sm">
                                                        {option.disabled_reason}
                                                    </p>
                                                ) : (
                                                    <>
                                                        {option.id === 34 ? (
                                                            <p className="text-primary-text dark:text-primary-text text-sm font-semibold">
                                                                Pick up at 104 Bedford Hill, London, SW12 9HR
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="text-primary-text dark:text-primary-text text-sm">
                                                                    Ships: {dates.shipping}
                                                                </p>
                                                                <p className="text-primary-text dark:text-primary-text text-sm">
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

                    {/* Render store pickup slot picker if selected option is 34 */}
                    {localSelectedOption === '34' && allShippingOptions.length > 0 && (
                        <div className="mt-6">
                            <CheckoutStorePickUp onChange={(val) => {
                                setStorePickup(val);
                            }} />
                            {!storePickup && (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
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

                    {/* <p className="text-sm text-primary-text dark:text-primary-text mb-2">
                        Due to the current high temperatures in the UK, we have temporarily disabled the Royal Mail - Tracked 48® service.
                    </p> */}
                </>
            )}
        </div>
    );
};

export default CheckoutShippingOptions;
