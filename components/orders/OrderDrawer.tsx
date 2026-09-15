'use client';

import { skipToken } from '@reduxjs/toolkit/query';
import { useGetOrderQuery } from '@/redux/features/orders/ordersApiSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import Drawer from '@/components/ui/Drawer';
import Spinner from '@/components/common/Spinner';
import OrderCard from './OrderCard';
import { useOrderActions } from './useOrderActions';

interface Props {
    orderId: string | null;
    onClose: () => void;
}

/**
 * Full order detail for the table.
 *
 * Renders the existing OrderCard rather than a second copy of the field list,
 * so the drawer shows exactly what the classic view shows and the two cannot
 * drift apart. The full order is fetched only when a row is opened.
 */
export default function OrderDrawer({ orderId, onClose }: Props) {
    const { data: order, isLoading, error } = useGetOrderQuery(orderId ?? skipToken);
    const { data: products } = useGetProductsQuery();
    const { handleCreate, handleDownload } = useOrderActions();

    return (
        <Drawer
            open={Boolean(orderId)}
            onClose={onClose}
            title={orderId ? `Order ${orderId}` : 'Order'}
        >
            {isLoading && (
                <div className="flex justify-center py-12">
                    <Spinner md />
                </div>
            )}

            {error && (
                <p className="py-8 text-center text-red-600 dark:text-red-400">
                    Could not load this order.
                </p>
            )}

            {order && (
                <OrderCard
                    order={order}
                    products={products || []}
                    onCreateShipping={handleCreate}
                    onDownloadLabel={handleDownload}
                />
            )}
        </Drawer>
    );
}
