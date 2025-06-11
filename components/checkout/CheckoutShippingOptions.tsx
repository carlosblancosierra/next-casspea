import { useState, useEffect } from 'react';
import { ShippingCompany } from '@/types/shipping';
import { addBusinessDays, format } from 'date-fns';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';

interface CheckoutShippingOptionsProps {
    shippingCompanies: ShippingCompany[] | undefined;
    selectedOptionId?: number;
    onShippingOptionChange: (optionId: number) => Promise<void>;
}

const CheckoutShippingOptions: React.FC<CheckoutShippingOptionsProps> = ({
    shippingCompanies,
    selectedOptionId,
    onShippingOptionChange
}) => {
    const [localSelectedOption, setLocalSelectedOption] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { data: cart, isLoading, error: cartError } = useGetCartQuery();


    // Update local state when prop changes
    useEffect(() => {
        if (selectedOptionId) {
            setLocalSelectedOption(selectedOptionId.toString());
        }
    }, [selectedOptionId]);

    const shouldShowStorePickup = cart?.discount?.code === 'lkiLspIJ';

    let allShippingOptions = shippingCompanies?.flatMap(company =>
        company.shipping_options.map(option => ({
            ...option,
            companyName: company.name,
            companyId: company.id
        }))
    ) || [];

    if (!shouldShowStorePickup) {
        allShippingOptions = allShippingOptions.filter(option => option.companyId !== 34);
    }


    // Set default option if none selected
    useEffect(() => {
        if (allShippingOptions.length && !localSelectedOption) {
            setLocalSelectedOption(allShippingOptions[0].id.toString());
            onShippingOptionChange(allShippingOptions[0].id);
        }
    }, [allShippingOptions, localSelectedOption]);

    const handleShippingChange = async (optionId: string) => {
        if (isUpdating) return;

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
                                    <p className="text-gray-900 dark:text-gray-100 dark:text-gray-400 text-base">
                                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(option.price)}
                                    </p>
                                    {isOptionDisabled ? (
                                        <p className="text-red-600 dark:text-red-400 text-sm">
                                            {option.disabled_reason}
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
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>

            {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Due to the current high temperatures in the UK, we have temporarily disabled the Royal Mail - Tracked 48® service.
            </p> */}
        </div>
    );
};

export default CheckoutShippingOptions;
