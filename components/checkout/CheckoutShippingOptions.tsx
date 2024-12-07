import { useState, useEffect } from 'react';
import { useUpdateSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';
import { toast } from 'react-toastify';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';

const CheckoutShippingOptions = () => {
    const { data: shippingCompanies } = useGetShippingOptionsQuery();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [updateSession] = useUpdateSessionMutation();

    const allShippingOptions = shippingCompanies?.flatMap(company =>
        company.shipping_options.map(option => ({
            ...option,
            companyName: company.name
        }))
    ) || [];

    useEffect(() => {
        if (allShippingOptions.length) {
            setSelectedOption(allShippingOptions[0].id.toString());
        }
    }, [allShippingOptions]);

    const handleShippingChange = async (optionId: string) => {
        setSelectedOption(optionId);
        const option = allShippingOptions.find(opt => opt.id.toString() === optionId);

        try {
            await updateSession({
                shipping_option_id: option?.id
            }).unwrap();
        } catch (err) {
            toast.error('Failed to update shipping method');
            console.error('Shipping update failed:', err);
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
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <div className="flex items-center">
                            <input
                                type="radio"
                                name="shipping"
                                value={option.id.toString()}
                                checked={selectedOption === option.id.toString()}
                                onChange={() => handleShippingChange(option.id.toString())}
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
