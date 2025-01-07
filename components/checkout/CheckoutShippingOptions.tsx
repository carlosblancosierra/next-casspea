import { useState, useEffect } from 'react';
import { useUpdateSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';
import { toast } from 'react-toastify';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { ShippingCompany } from '@/types/shipping';
import { addBusinessDays, format } from 'date-fns';

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

    // Update local state when prop changes
    useEffect(() => {
        if (selectedOptionId) {
            setLocalSelectedOption(selectedOptionId.toString());
        }
    }, [selectedOptionId]);

    const allShippingOptions = shippingCompanies?.flatMap(company =>
        company.shipping_options.map(option => ({
            ...option,
            companyName: company.name
        }))
    ) || [];

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
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Shipping Options
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Orders will be shipped ASAP, usually within 24 hours. Delivery Date depends on the shipping option selected.
            </p>

            <div className="space-y-4">
                {allShippingOptions.map((option) => {
                    const dates = getEstimatedDeliveryDates(option.estimated_days_min, option.estimated_days_max);
                    return (
                        <label
                            key={option.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer
                                ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover: dark:hover:bg-gray-700'}
                                ${localSelectedOption === option.id.toString() ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                        >
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="shipping"
                                    value={option.id.toString()}
                                    checked={localSelectedOption === option.id.toString()}
                                    onChange={() => handleShippingChange(option.id.toString())}
                                    disabled={isUpdating}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="ml-3">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                        {option.companyName} - {option.name}
                                    </h3>
                                    <p className="text-gray-900 dark:text-gray-100 dark:text-gray-400 text-base">
                                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(option.price)}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Ships: {dates.shipping}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Estimated Delivery: {dates.delivery}
                                    </p>
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutShippingOptions;
