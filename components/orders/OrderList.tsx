import { useGetOrdersQuery, OrdersQueryParams } from '@/redux/features/orders/ordersApiSlice';
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
                                    <thead className="border-b font-medium dark:border-neutral-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Order Details</th>
                                            <th scope="col" className="px-6 py-4">Payment Status</th>
                                            <th scope="col" className="px-6 py-4">Items</th>
                                            <th scope="col" className="px-6 py-4">Discount</th>
                                            <th scope="col" className="px-6 py-4">Gift Message</th>
                                            <th scope="col" className="px-6 py-4">Shipping Date</th>
                                            <th scope="col" className="px-6 py-4">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dateOrders.map((order: Order, orderIndex: number) => {
                                            const { time } = formatDate(order.created);
                                            return (
                                                <tr key={order.order_id || orderIndex} className="border-b dark:border-neutral-500">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium">{order.order_id || '-'}</div>
                                                        <div className="text-xs text-gray-500">{time}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">{order.checkout_session?.payment_status || '-'}</td>
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
                                                                            Type: {item.box_customization.selection_type || 'Not specified'}
                                                                            {(item.box_customization.allergens?.length ?? 0) > 0 && (
                                                                                <span> | Allergens: {item.box_customization.allergens?.join(', ')}</span>
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
                                                    <td className="px-6 py-4">{order.checkout_session?.cart?.discount || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        {order.checkout_session?.cart?.gift_message || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order.checkout_session?.cart?.shipping_date ?
                                                            new Date(order.checkout_session.cart.shipping_date).toLocaleDateString() :
                                                            '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {formatCurrency(order.checkout_session?.cart?.discounted_total)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
