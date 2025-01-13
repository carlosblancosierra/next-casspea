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

    orders.forEach(order => {
        order.checkout_session?.cart?.items?.forEach(item => {
            // Sum products
            const productName = item.product || 'Unknown Product';
            products[productName] = (products[productName] || 0) + (item.quantity || 1);

            // Sum flavors
            item.box_customization?.flavor_selections?.forEach(flavor => {
                if (flavor.flavor_name && flavor.quantity) {
                    flavors[flavor.flavor_name] = (flavors[flavor.flavor_name] || 0) + flavor.quantity;
                }
            });
        });
    });

    return { products, flavors };
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
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        {Object.entries(groupedOrders).map(([date, dateOrders]: [string, Order[]]) => (
                            <div key={date} className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">{date}</h3>
                                <table className="min-w-full text-left text-sm font-light">
                                    <colgroup>
                                        <col className="w-[15%]" />
                                        <col className="w-[10%]" />
                                        <col className="w-[25%]" />
                                        <col className="w-[10%]" />
                                        <col className="w-[15%]" />
                                        <col className="w-[15%]" />
                                        <col className="w-[10%]" />
                                    </colgroup>
                                    <thead className="border-b font-medium dark:border-neutral-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Order Details</th>
                                            <th scope="col" className="px-6 py-4">Items</th>
                                            <th scope="col" className="px-6 py-4">Gift Message</th>
                                            <th scope="col" className="px-6 py-4">Shipping Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dateOrders.map((order: Order, orderIndex: number) => {
                                            const { time } = formatDate(order.created);
                                            return (
                                                <tr key={order.order_id || orderIndex} className="border-b dark:border-neutral-500">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{order.order_id || '-'}</span>
                                                            <PaymentStatus status={order.checkout_session?.payment_status} />
                                                        </div>
                                                        <div className="text-xs text-gray-500">{time}</div>
                                                        {order.checkout_session?.cart?.discount && (
                                                            <div className="text-xs text-gray-600">
                                                                Discount: {order.checkout_session.cart.discount}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order.checkout_session?.cart?.items?.map((item, itemIndex) => (
                                                            <div key={itemIndex} className="mb-2">
                                                                <div>
                                                                    <strong>{item.product || 'Unknown Product'}</strong>
                                                                    {item.quantity && ` (x${item.quantity})`}
                                                                </div>
                                                                {item.box_customization && (
                                                                    <>
                                                                        <div className="text-sm text-gray-600">
                                                                            Type: {formatSelectionType(item.box_customization.selection_type)}
                                                                            {item.box_customization.allergens && item.box_customization.allergens.length > 0 && (
                                                                                <span> | Allergens: {item.box_customization.allergens.join(', ')}</span>
                                                                            )}
                                                                        </div>
                                                                        {(item.box_customization.flavor_selections?.length ?? 0) > 0 && (
                                                                            <div className="text-xs text-gray-500">
                                                                                <button
                                                                                    onClick={() => toggleFlavors(order.order_id || '')}
                                                                                    className="text-blue-600 hover:text-blue-800"
                                                                                >
                                                                                    {expandedFlavors.has(order.order_id || '') ? 'Hide' : 'Show'} Flavors
                                                                                </button>
                                                                                {expandedFlavors.has(order.order_id || '') && (
                                                                                    <div className="mt-2 ml-2">
                                                                                        {item.box_customization.flavor_selections?.
                                                                                            filter(f => f.flavor_name && f.quantity)
                                                                                            .map((f, i) => (
                                                                                                <div key={i}>
                                                                                                    {f.flavor_name} (x{f.quantity})
                                                                                                </div>
                                                                                            ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )) || 'No items'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order.checkout_session?.cart?.gift_message || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <ShippingBadge date={order.checkout_session?.cart?.shipping_date} />
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {formatShippingAddress(order.checkout_session?.shipping_address)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-gray-50 dark:bg-gray-800">
                                            <td colSpan={7} className="px-6 py-4">
                                                <div className="font-medium mb-2">Day Summary:</div>
                                                {(() => {
                                                    const { products, flavors } = getDayTotals(dateOrders);
                                                    return (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="font-medium text-sm">Products:</div>
                                                                {Object.entries(products).map(([name, qty]) => (
                                                                    <div key={name} className="text-sm">
                                                                        {name}: {qty}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm">Flavors:</div>
                                                                {Object.entries(flavors).map(([name, qty]) => (
                                                                    <div key={name} className="text-sm">
                                                                        {name}: {qty}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
