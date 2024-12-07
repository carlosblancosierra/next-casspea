import { useState, useEffect } from 'react';
import { useUpdateSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';
import { toast } from 'react-toastify';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { ShippingCompany } from '@/types/shipping';

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

    if (!allShippingOptions.length) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Shipping Options
            </h2>

            <div className="space-y-4">
                {allShippingOptions.map((option) => (
                    <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer
                            ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
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
                                <p className="text-gray-600 dark:text-gray-400">
                                    {option.estimated_days_min}-{option.estimated_days_max} days
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(option.price)}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default CheckoutShippingOptions;
