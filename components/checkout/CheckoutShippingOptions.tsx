import { useState, useEffect } from 'react';
import { ShippingCompany } from '@/types/shipping';
import { addBusinessDays, format } from 'date-fns';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import CheckoutStorePickUp from './CheckoutStorePickUp';

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

    // Sort: enabled options first, then disabled
    allShippingOptions = allShippingOptions.sort((a, b) => {
        if (a.disabled === b.disabled) return 0;
        return a.disabled ? 1 : -1;
    });

    // Set default option if none selected, and never select a disabled option
    useEffect(() => {
        if (allShippingOptions.length && !localSelectedOption) {
            const firstEnabled = allShippingOptions.find(opt => !opt.disabled);
            if (firstEnabled) {
                setLocalSelectedOption(firstEnabled.id.toString());
                onShippingOptionChange(firstEnabled.id);
            }
        }
    }, [allShippingOptions, localSelectedOption]);

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

    if (!allShippingOptions.length) return null;

    return (
        <div className="main-bg p-6 rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Shipping Options
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Orders will be shipped ASAP, usually within 24 hours. Delivery Date depends on the shipping option selected.
            </p>

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
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                        {option.companyName} - {option.name}
                                    </h3>
                                    <p className={`text-base font-semibold ${
                                        parseFloat(option.price.toString()) === 0
                                            ? 'text-primary dark:text-primary-2'
                                            : 'text-gray-900 dark:text-gray-100'
                                    }`}>
                                        {parseFloat(option.price.toString()) === 0
                                            ? 'Free'
                                            : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(option.price)
                                        }
                                    </p>
                                    {isOptionDisabled ? (
                                        <p className="text-red-600 dark:text-red-400 text-sm">
                                            {option.disabled_reason}
                                        </p>
                                    ) : (
                                        <>
                                            {option.id === 34 ? (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                                                    Pick up at 104 Bedford Hill, London, SW12 9HR
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        Ships: {dates.shipping}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
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

            {/* Render store pickup slot picker if selected option is 34 */}
            {localSelectedOption === '34' && (
                <div className="mt-6">
                    <CheckoutStorePickUp onChange={(val) => {
                        setStorePickup(val);
                    }} />
                </div>
            )}

            {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Due to the current high temperatures in the UK, we have temporarily disabled the Royal Mail - Tracked 48® service.
            </p> */}
        </div>
    );
};

export default CheckoutShippingOptions;
