import { Address } from '@/types/addresses';
import { CheckoutSession } from '@/types/checkout';

interface CheckoutDetailsProps {
    session: CheckoutSession | undefined;
}

const AddressDisplay = ({ address, title }: { address: Address | undefined, title: string }) => {
    if (!address) return null;

    return (
        <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <div className="text-gray-600 dark:text-gray-400">
                <p>{address.full_name}</p>
                <p>{address.street_address}</p>
                {address.street_address2 && <p>{address.street_address2}</p>}
                <p>{address.city}{address.county && `, ${address.county}`} {address.postcode}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
            </div>
        </div>
    );
};

const CheckoutDetails: React.FC<CheckoutDetailsProps> = ({ session }) => {
    if (!session) return null;

    console.log(session);

    const areAddressesSame = session.shipping_address && session.billing_address &&
        session.shipping_address.street_address === session.billing_address.street_address &&
        session.shipping_address.full_name === session.billing_address.full_name;

    return (
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Order Details</h2>
            <div className="space-y-4">
                <AddressDisplay
                    address={session.shipping_address}
                    title={areAddressesSame ? "Shipping & Billing Address" : "Shipping Address"}
                />
                {!areAddressesSame &&
                    <AddressDisplay address={session.billing_address} title="Billing Address" />
                }
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Contact</h3>
                    <p className="text-gray-600 dark:text-gray-400">{session.email}</p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutDetails;
