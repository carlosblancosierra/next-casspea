'use client';

import { RequireAuth } from '@/components/utils';
import OrderList from '@/components/orders/OrderList';
import Link from 'next/link';

export default function OrdersPage() {
    return (
        <RequireAuth>
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Orders</h1>
                <OrderList />
                <Link href="/addresses/stats" className="text-blue-500">
                    View Order Postcodes
                </Link>
            </div>
        </RequireAuth>
    );
}
