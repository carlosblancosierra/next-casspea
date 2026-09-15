'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/utils';
import OrderList from '@/components/orders/OrderList';
import OrdersTable from '@/components/orders/OrdersTable';
import Link from 'next/link';

const VIEW_KEY = 'orders:view';
type OrdersView = 'classic' | 'table';

export default function OrdersPage() {
    // The classic view stays the default; the table is opt-in until it has had
    // some real use. Flipping the default later is a one-line change.
    const [view, setView] = useState<OrdersView>('classic');

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
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-primary-text dark:text-primary-text-light">
                        Orders
                    </h1>
                    <div
                        className="inline-flex rounded-md border border-gray-300 p-0.5 dark:border-gray-600"
                        role="group"
                        aria-label="Orders view"
                    >
                        {(['classic', 'table'] as const).map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => choose(option)}
                                aria-pressed={view === option}
                                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                                    view === option
                                        ? 'bg-primary text-primary-button-text'
                                        : 'text-primary-text hover:bg-gray-100 dark:text-primary-text-light dark:hover:bg-gray-800'
                                }`}
                            >
                                {option === 'classic' ? 'Classic' : 'New table'}
                            </button>
                        ))}
                    </div>
                </div>

                {view === 'table' ? <OrdersTable /> : <OrderList />}

                <div className="mt-4 flex flex-col gap-2">
                    <Link href="/addresses/stats" className="text-blue-500">
                        View Order Postcodes
                    </Link>
                    <Link href="/admin/experiments" className="text-blue-500">
                        View A/B Test Results
                    </Link>
                    <Link href="/admin/summer-break" className="text-blue-500">
                        Manage Summer Break Boxes
                    </Link>
                </div>
            </div>
        </RequireAuth>
    );
}
