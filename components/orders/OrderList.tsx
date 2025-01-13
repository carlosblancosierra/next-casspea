import { useGetOrdersQuery, OrdersQueryParams } from '@/redux/features/orders/ordersApiSlice';
import { Address } from '@/types/addresses';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

interface FlavorSelection {
    flavor_name?: string;
    quantity?: number;
}

interface BoxCustomization {
    selection_type?: string;
    allergens?: number[];
    flavor_selections?: FlavorSelection[];
}

interface CartItem {
    product?: string;
    quantity?: number;
    box_customization?: BoxCustomization;
}

interface Order {
    order_id?: string;
    created?: string;
    checkout_session?: {
        payment_status?: string;
        shipping_address?: Address;
        cart?: {
            items?: CartItem[];
            discount?: string | null;
            gift_message?: string | null;
            shipping_date?: string | null;
            discounted_total?: string;
        };
    };
}

const formatDate = (dateString?: string): { date: string, time: string } => {
    if (!dateString) return { date: '-', time: '-' };
    try {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-GB'),
            time: date.toLocaleTimeString('en-GB')
        };
    } catch (error) {
        console.error('Date formatting error:', error);
        return { date: '-', time: '-' };
    }
};

const formatCurrency = (amount?: string): string => {
    if (!amount) return '£0.00';
    try {
        return `£${parseFloat(amount).toFixed(2)}`;
    } catch (error) {
        console.error('Currency formatting error:', error);
        return '£0.00';
    }
};

const getDayTotals = (orders: Order[]) => {
    const products: Record<string, number> = {};
    const flavors: Record<string, number> = {};
    const randomBoxes: Record<string, number> = {}; // Key will be allergen string or 'no-allergens'

    orders.forEach(order => {
        order.checkout_session?.cart?.items?.forEach(item => {
            const boxCustomization = item.box_customization;
            const quantity = item.quantity || 1;

            if (boxCustomization?.selection_type === 'RANDOM') {
                const allergenKey = boxCustomization.allergens?.length
                    ? `allergens: ${boxCustomization.allergens.sort().join(', ')}`
                    : 'no-allergens';
                randomBoxes[allergenKey] = (randomBoxes[allergenKey] || 0) + quantity;
            } else {
                // Regular product counting
                const productName = item.product || 'Unknown Product';
                products[productName] = (products[productName] || 0) + quantity;

                // Flavor counting for non-random boxes
                boxCustomization?.flavor_selections?.forEach(flavor => {
                    if (flavor.flavor_name && flavor.quantity) {
                        flavors[flavor.flavor_name] = (flavors[flavor.flavor_name] || 0) + flavor.quantity;
                    }
                });
            }
        });
    });

    return { products, flavors, randomBoxes };
};

const formatSelectionType = (type?: string): string => {
    switch (type) {
        case 'RANDOM':
            return 'Surprise Me';
        case 'PICK_AND_MIX':
            return 'Pick & Mix';
        default:
            return type || 'Not specified';
    }
};

const formatShippingAddress = (address?: Address): string => {
    if (!address) return '-';
    const parts = [
        `${address.first_name} ${address.last_name}`,
        address.phone,
        address.street_address,
        address.street_address2,
        [address.city, address.county, address.postcode].filter(Boolean).join(', ')
    ].filter(Boolean);

    return parts.join(' • ');
};

const PaymentStatus = ({ status }: { status?: string }) => {
    if (status === 'paid') return null;
    return (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            UNPAID
        </span>
    );
};

const ShippingBadge = ({ date }: { date?: string | null }) => {
    if (!date) {
        return (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                ASAP
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/30">
            {new Date(date).toLocaleDateString()}
        </span>
    );
};

const OrderCard = ({ order }: { order: Order }) => {
    const { date, time } = formatDate(order.created);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0 flex items-center gap-2">
                        {order.order_id}
                        <PaymentStatus status={order.checkout_session?.payment_status} />
                    </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{time}</dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Items</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                        {order.checkout_session?.cart?.items?.map((item, index) => (
                            <div key={index} className="mb-2">
                                <div className="font-medium">{item.product} (x{item.quantity})</div>
                                {item.box_customization && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatSelectionType(item.box_customization.selection_type)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                        <ShippingBadge date={order.checkout_session?.cart?.shipping_date} />
                    </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                        {formatShippingAddress(order.checkout_session?.shipping_address)}
                    </dd>
                </div>

                {order.checkout_session?.cart?.discount && (
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                            {order.checkout_session.cart.discount}
                        </dd>
                    </div>
                )}

                {order.checkout_session?.cart?.gift_message && (
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gift Message</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                            {order.checkout_session.cart.gift_message}
                        </dd>
                    </div>
                )}
            </dl>
        </div>
    );
};

const DaySection = ({ date, orders }: { date: string; orders: Order[] }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="mb-8">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4"
            >
                <h3 className="text-xl font-semibold">{date}</h3>
                {isExpanded ? (
                    <ChevronUpIcon className="h-5 w-5" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                )}
            </button>

            {isExpanded && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {orders.map((order: Order) => (
                            <OrderCard key={order.order_id} order={order} />
                        ))}
                    </div>
                    <DaySummary dateOrders={orders} />
                </>
            )}
        </div>
    );
};

const DaySummary = ({ dateOrders }: { dateOrders: Order[] }) => {
    const { products, flavors, randomBoxes } = getDayTotals(dateOrders);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-4">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Day Summary</h3>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Products Section */}
                    <div className="px-4 py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Products</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {Object.entries(products).map(([name, qty]) => (
                                    <div key={name}>
                                        {name}: {qty}
                                    </div>
                                ))}
                            </div>
                        </dd>
                    </div>

                    {/* Pick & Mix Flavors Section */}
                    {Object.keys(flavors).length > 0 && (
                        <div className="px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pick & Mix Flavors</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {Object.entries(flavors).map(([name, qty]) => (
                                        <div key={name}>
                                            {name}: {qty}
                                        </div>
                                    ))}
                                </div>
                            </dd>
                        </div>
                    )}

                    {/* Random Boxes Section */}
                    {Object.keys(randomBoxes).length > 0 && (
                        <div className="px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Other Flavors</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {Object.entries(randomBoxes).map(([key, qty]) => (
                                        <div key={key}>
                                            {key === 'no-allergens'
                                                ? `Random: ${qty}`
                                                : `${key}: ${qty}`}
                                        </div>
                                    ))}
                                </div>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
        </div>
    );
};

export default function OrderList() {
    const [filters, setFilters] = useState<OrdersQueryParams>({});
    const { data: orders, isLoading, error } = useGetOrdersQuery(filters);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders</div>;
    if (!orders?.length) return <div>No orders found</div>;

    const groupedOrders = orders.reduce((acc: { [key: string]: Order[] }, order: Order) => {
        const dateStr = formatDate(order.created).date;
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(order);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <DaySection key={date} date={date} orders={dateOrders} />
            ))}
        </div>
    );
}
