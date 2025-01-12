import { useGetOrdersQuery, OrdersQueryParams } from '@/redux/features/orders/ordersApiSlice';
import { useState } from 'react';
interface Order {
    id: string;
    status: string;
    total: number;
    created_at: string;
}

export default function OrderList() {
    const [filters, setFilters] = useState<OrdersQueryParams>({});
    const { data: orders, isLoading, error } = useGetOrdersQuery(filters);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left">Order ID</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Total</th>
                        <th className="px-6 py-3 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((order: Order) => (
                        <tr key={order.id} className="border-b">
                            <td className="px-6 py-4">{order.id}</td>
                            <td className="px-6 py-4">{order.status}</td>
                            <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                {new Date(order.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
