import { useGetOrdersQuery, OrdersQueryParams } from '@/redux/features/orders/ordersApiSlice';
import { Address } from '@/types/addresses';
import { useState } from 'react';

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
    const { time } = formatDate(order.created);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{order.order_id || '-'}</span>
                        <PaymentStatus status={order.checkout_session?.payment_status} />
                    </div>
                    <div className="text-xs text-gray-500">{time}</div>
                </div>
                <ShippingBadge date={order.checkout_session?.cart?.shipping_date} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Items Section */}
                <div>
                    <h4 className="font-medium text-sm mb-2">Items</h4>
                    {order.checkout_session?.cart?.items?.map((item, itemIndex) => (
                        <div key={itemIndex} className="mb-2">
                            <div>
                                <strong>{item.product || 'Unknown Product'}</strong>
                                {item.quantity && ` (x${item.quantity})`}
                            </div>
                            {item.box_customization && (
                                <div className="text-sm text-gray-600">
                                    Type: {formatSelectionType(item.box_customization.selection_type)}
                                </div>
                            )}
                        </div>
                    )) || 'No items'}
                </div>

                {/* Shipping & Gift Message */}
                <div>
                    <h4 className="font-medium text-sm mb-2">Delivery Details</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {formatShippingAddress(order.checkout_session?.shipping_address)}
                    </div>
                    {order.checkout_session?.cart?.gift_message && (
                        <>
                            <h4 className="font-medium text-sm mb-1 mt-3">Gift Message</h4>
                            <div className="text-sm text-gray-600">
                                {order.checkout_session.cart.gift_message}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const DaySummary = ({ dateOrders }: { dateOrders: Order[] }) => {
    const { products, flavors, randomBoxes } = getDayTotals(dateOrders);

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
            <div className="font-medium mb-2">Day Summary:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <div className="font-medium text-sm mb-2">Products:</div>
                    {Object.entries(products).map(([name, qty]) => (
                        <div key={name} className="text-sm">
                            {name}: {qty}
                        </div>
                    ))}

                    {/* Random boxes section */}
                    {Object.entries(randomBoxes).map(([key, qty]) => (
                        <div key={key} className="text-sm">
                            {key === 'no-allergens'
                                ? `${qty} random`
                                : `${qty} random (${key})`}
                        </div>
                    ))}
                </div>
                <div>
                    <div className="font-medium text-sm mb-2">Flavors:</div>
                    {Object.entries(flavors).map(([name, qty]) => (
                        <div key={name} className="text-sm">
                            {name}: {qty}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function OrderList() {
    const [filters, setFilters] = useState<OrdersQueryParams>({});
    const [expandedFlavors, setExpandedFlavors] = useState<Set<string>>(new Set());
    const { data: orders, isLoading, error } = useGetOrdersQuery(filters);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders</div>;
    if (!orders?.length) return <div>No orders found</div>;

    const toggleFlavors = (orderId: string) => {
        const newExpanded = new Set(expandedFlavors);
        if (expandedFlavors.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedFlavors(newExpanded);
    };

    // Group orders by date
    const groupedOrders: Record<string, Order[]> = orders.reduce((acc: { [key: string]: Order[] }, order: Order) => {
        const dateStr = formatDate(order.created).date;
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(order);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {Object.entries(groupedOrders).map(([date, dateOrders]: [string, Order[]]) => (
                <div key={date} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{date}</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {dateOrders.map((order: Order) => (
                            <OrderCard key={order.order_id} order={order} />
                        ))}
                    </div>

                    {/* Day Summary Card */}
                    <DaySummary dateOrders={dateOrders} />
                </div>
            ))}
        </div>
    );
}
