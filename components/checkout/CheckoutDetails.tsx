import { CheckoutSession } from '@/types/checkout';

interface CheckoutDetailsProps {
    session: CheckoutSession | undefined;
}

const CheckoutDetails: React.FC<CheckoutDetailsProps> = ({ session }) => {
    if (!session) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Order Details</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Shipping Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {session.shipping_address?.formatted_address}
                    </p>
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Billing Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {session.billing_address?.formatted_address}
                    </p>
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Contact</h3>
                    <p className="text-gray-600 dark:text-gray-400">{session.email}</p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutDetails;
