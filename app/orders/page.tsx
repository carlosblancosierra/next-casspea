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
                <div className="mt-4 flex flex-col gap-2">
                    <Link href="/addresses/stats" className="text-blue-500">
                        View Order Postcodes
                    </Link>
                    <Link href="/admin/summer-break" className="text-blue-500">
                        Manage Summer Break Boxes
                    </Link>
                </div>
            </div>
        </RequireAuth>
    );
}
