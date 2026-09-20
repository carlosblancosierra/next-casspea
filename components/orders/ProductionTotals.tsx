'use client';

import { useGetOrdersQuery } from '@/redux/features/orders/ordersApiSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import Spinner from '@/components/common/Spinner';
import DaySummary from './DaySummary';

interface ProductionTotalsProps {
    /** Order ids the staff member ticked. */
    orderIds: string[];
}

/**
 * What to make for a set of orders the user picked themselves.
 *
 * The classic view could only ever total a whole day, which is not how a
 * batch gets made — some days are half a batch and some span two. This takes
 * whatever selection is on screen and runs it through the same getDayTotals
 * the day summary uses, so the two can never disagree about what a flavour
 * count means.
 *
 * The rows in the table are a light summary without cart contents, so the
 * full orders are fetched by id. The server ignores its date range for an
 * explicit id list, which is what lets an order ticked on one page still
 * count after the filters move.
 */
export default function ProductionTotals({ orderIds }: ProductionTotalsProps) {
    const ids = orderIds.join(',');
    const { data: orders, isLoading, isFetching, error } = useGetOrdersQuery(
        { ids },
        { skip: orderIds.length === 0 }
    );
    const { data: products } = useGetProductsQuery();

    if (orderIds.length === 0) return null;

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner md />
            </div>
        );
    }

    if (error || !orders) {
        return (
            <p className="py-6 text-center text-red-600 dark:text-red-400">
                Could not load the selected orders.
            </p>
        );
    }

    return (
        <div>
            <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
                Totals for {orders.length} selected {orders.length === 1 ? 'order' : 'orders'}
                {isFetching && ' · refreshing…'}
            </p>
            <DaySummary
                dateOrders={orders}
                products={products ?? []}
                title="To prepare"
            />
        </div>
    );
}
