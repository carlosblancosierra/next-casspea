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

const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (error) {
        console.error('Date formatting error:', error);
        return '-';
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
    const { data: orders, isLoading, error } = useGetOrdersQuery(filters);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders</div>;
    if (!orders?.length) return <div>No orders found</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left">Order ID</th>
                        <th className="px-6 py-3 text-left">Created</th>
                        <th className="px-6 py-3 text-left">Payment Status</th>
                        <th className="px-6 py-3 text-left">Items</th>
                        <th className="px-6 py-3 text-left">Discount</th>
                        <th className="px-6 py-3 text-left">Gift Message</th>
                        <th className="px-6 py-3 text-left">Shipping Date</th>
                        <th className="px-6 py-3 text-left">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order: Order, orderIndex: number) => (
                        <tr key={order.order_id || orderIndex} className="border-b">
                            <td className="px-6 py-4">{order.order_id || '-'}</td>
                            <td className="px-6 py-4">{formatDate(order.created)}</td>
                            <td className="px-6 py-4">{order.checkout_session?.payment_status || '-'}</td>
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
                                                    <div className="text-sm text-gray-500">
                                                        Flavors: {item.box_customization.flavor_selections?.
                                                            filter(f => f.flavor_name && f.quantity)
                                                            .map(f => `${f.flavor_name} (x${f.quantity})`)
                                                            .join(', ') || 'None specified'}
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
