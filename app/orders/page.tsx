'use client';

import { RequireAuth } from '@/components/utils';
import OrderList from '@/components/orders/OrderList';

export default function OrdersPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Orders</h1>
            <OrderList />
        </div>
    );
}
