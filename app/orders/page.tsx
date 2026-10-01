'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/utils';
import OrderList from '@/components/orders/OrderList';
import OrdersTable from '@/components/orders/OrdersTable';
import Link from 'next/link';

const VIEW_KEY = 'orders:view';
type OrdersView = 'table' | 'classic';

const TABS: { value: OrdersView; label: string }[] = [
    { value: 'table', label: 'Orders' },
    { value: 'classic', label: 'By day (old)' },
];

export default function OrdersPage() {
    // The table is the default now. The day view stays a tab away because it
    // is still the better shape for "what went out on Tuesday".
    const [view, setView] = useState<OrdersView>('table');

    useEffect(() => {
        // A staff email link (/orders?order=CP25-XXXX) opens the order in the
        // table's drawer, so honour it regardless of the saved preference.
        if (new URLSearchParams(window.location.search).get('order')) {
            setView('table');
            return;
        }
        const saved = localStorage.getItem(VIEW_KEY);
        if (saved === 'table' || saved === 'classic') setView(saved);
    }, []);

    const choose = (next: OrdersView) => {
        setView(next);
        try {
            localStorage.setItem(VIEW_KEY, next);
        } catch {
            // Private mode or blocked storage — the choice just won't persist.
        }
    };

    return (
        <RequireAuth>
            <div className="container mx-auto py-8">
                <h1 className="mb-4 text-2xl font-bold text-primary-text dark:text-primary-text-light">
                    Orders
                </h1>

                {/* Real tabs rather than a segmented toggle: these are two
                    views of the same thing, which is what a tab means. */}
                <div
                    role="tablist"
                    aria-label="Orders view"
                    className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700"
                >
                    {TABS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            role="tab"
                            aria-selected={view === value}
                            onClick={() => choose(value)}
                            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                                view === value
                                    ? 'border-primary text-primary dark:border-primary-2 dark:text-primary-2'
                                    : 'border-transparent text-primary-text/60 hover:text-primary-text dark:text-primary-text-light/60 dark:hover:text-primary-text-light'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {view === 'table' ? <OrdersTable /> : <OrderList />}

                <div className="mt-4 flex flex-col gap-2">
                    <Link href="/addresses/stats" className="text-blue-500">
                        View Order Postcodes
                    </Link>
                    <Link href="/admin/palette" className="text-blue-500">
                        Palette options
                    </Link>
                    <Link href="/admin/sms-contacts" className="text-blue-500">
                        SMS Contacts
                    </Link>
                </div>
            </div>
        </RequireAuth>
    );
}
