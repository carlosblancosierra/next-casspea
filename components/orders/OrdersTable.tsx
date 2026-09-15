'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format } from 'date-fns';
import { useGetOrdersSummaryQuery } from '@/redux/features/orders/ordersApiSlice';
import { OrderSummary } from '@/types/orders';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from './ordersUtils';
import OrderDrawer from './OrderDrawer';
import Input from '@/components/ui/Input';
import Spinner from '@/components/common/Spinner';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';

const PAGE_SIZE = 50;

const DATE_INPUT =
    'text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5';

function Pill({ tone, children }: { tone: 'good' | 'warn' | 'muted'; children: React.ReactNode }) {
    const tones = {
        good: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
        warn: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
        muted: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    } as const;
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
            {children}
        </span>
    );
}

export default function OrdersTable() {
    const today = useMemo(() => new Date(), []);
    const [startDate, setStartDate] = useState<Date>(addDays(today, -6));
    const [endDate, setEndDate] = useState<Date>(today);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<string | null>(null);

    const [applied, setApplied] = useState({
        start_date: format(addDays(today, -6), 'yyyy-MM-dd'),
        end_date: format(today, 'yyyy-MM-dd'),
        search: '',
    });

    // Deep link from the staff order email: /orders?order=CP25-XXXX.
    // Read from location rather than useSearchParams so the page does not need
    // a Suspense boundary.
    useEffect(() => {
        const orderId = new URLSearchParams(window.location.search).get('order');
        if (orderId) setSelected(orderId);
    }, []);

    const { data, isLoading, isFetching, error } = useGetOrdersSummaryQuery({
        ...applied,
        page,
        page_size: PAGE_SIZE,
    });

    const rows: OrderSummary[] = data?.results ?? [];
    const count = data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    const applyFilters = () => {
        setPage(1);
        setApplied({
            start_date: format(startDate, 'yyyy-MM-dd'),
            end_date: format(endDate, 'yyyy-MM-dd'),
            search: search.trim(),
        });
    };

    return (
        <div className="max-w-7xl mx-auto lg:px-8 py-6">
            <div className="mb-4 flex flex-wrap items-end justify-center gap-3">
                <div>
                    <label className="block text-xs font-medium text-primary-text dark:text-primary-text-light">
                        From
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={d => d && setStartDate(d)}
                        dateFormat="yyyy-MM-dd"
                        className={DATE_INPUT}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-primary-text dark:text-primary-text-light">
                        To
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={d => d && setEndDate(d)}
                        dateFormat="yyyy-MM-dd"
                        className={DATE_INPUT}
                    />
                </div>
                <div className="w-full sm:w-64">
                    <Input
                        id="order-search"
                        label="Search"
                        placeholder="Order, email, name or tracking"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    />
                </div>
                <button
                    type="button"
                    onClick={applyFilters}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-button-text hover:bg-primary-dark"
                >
                    Search
                </button>
            </div>

            <div className="mb-2 flex items-center justify-between text-sm text-primary-text/70 dark:text-primary-text-light/70">
                <span>
                    {count} {count === 1 ? 'order' : 'orders'}
                    {isFetching && !isLoading && ' · refreshing…'}
                </span>
                <span>
                    Page {page} of {totalPages}
                </span>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Spinner md />
                </div>
            ) : error ? (
                <p className="py-8 text-center text-red-600 dark:text-red-400">
                    Could not load orders.
                </p>
            ) : rows.length === 0 ? (
                <p className="py-8 text-center text-primary-text/70 dark:text-primary-text-light/70">
                    No orders in this range.
                </p>
            ) : (
                <>
                    {/* Desktop: a real table */}
                    <div className="hidden md:block">
                        <Table>
                            <THead>
                                <TR>
                                    <TH>Date</TH>
                                    <TH>Order</TH>
                                    <TH>Customer</TH>
                                    <TH className="text-right">Items</TH>
                                    <TH>Ship date</TH>
                                    <TH>Shipping</TH>
                                    <TH>Status</TH>
                                    <TH className="text-right">Total</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {rows.map(row => {
                                    const { date, time } = formatDate(row.created);
                                    return (
                                        <TR key={row.order_id} onClick={() => setSelected(row.order_id)}>
                                            <TD className="whitespace-nowrap">
                                                {date}
                                                <span className="block text-xs text-primary-text/50 dark:text-primary-text-light/50">
                                                    {time}
                                                </span>
                                            </TD>
                                            <TD className="whitespace-nowrap font-medium">{row.order_id}</TD>
                                            <TD>
                                                {row.customer_name || '—'}
                                                <span className="block text-xs text-primary-text/50 dark:text-primary-text-light/50">
                                                    {row.email}
                                                </span>
                                            </TD>
                                            <TD className="text-right tabular-nums">{row.item_count}</TD>
                                            <TD className="whitespace-nowrap">
                                                {row.shipping_date || <Pill tone="muted">ASAP</Pill>}
                                            </TD>
                                            <TD className="whitespace-nowrap">{row.shipping_option_name || '—'}</TD>
                                            <TD className="whitespace-nowrap">
                                                {row.payment_status === 'paid' ? (
                                                    <Pill tone="muted">{row.status}</Pill>
                                                ) : (
                                                    <Pill tone="warn">unpaid</Pill>
                                                )}
                                            </TD>
                                            <TD className="text-right tabular-nums">
                                                {formatCurrency(row.total_with_shipping)}
                                            </TD>
                                        </TR>
                                    );
                                })}
                            </TBody>
                        </Table>
                    </div>

                    {/* Mobile: the same rows as stacked cards, same drawer */}
                    <ul className="space-y-2 md:hidden">
                        {rows.map(row => {
                            const { date } = formatDate(row.created);
                            return (
                                <li key={row.order_id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelected(row.order_id)}
                                        className="w-full rounded-lg border border-gray-200 bg-main-bg p-3 text-left dark:border-gray-700 dark:bg-main-bg-dark"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium text-primary-text dark:text-primary-text-light">
                                                {row.order_id}
                                            </span>
                                            <span className="tabular-nums text-primary-text dark:text-primary-text-light">
                                                {formatCurrency(row.total_with_shipping)}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                                            {row.customer_name || row.email || '—'}
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-primary-text/60 dark:text-primary-text-light/60">
                                            <span>{date}</span>
                                            <span>· {row.item_count} items</span>
                                            {row.shipping_date ? <span>· ships {row.shipping_date}</span> : null}
                                            {row.payment_status === 'paid' ? (
                                                <Pill tone="muted">{row.status}</Pill>
                                            ) : (
                                                <Pill tone="warn">unpaid</Pill>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-primary-text disabled:opacity-40 dark:border-gray-600 dark:text-primary-text-light"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-primary-text disabled:opacity-40 dark:border-gray-600 dark:text-primary-text-light"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            <OrderDrawer orderId={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
