import React, { useState } from 'react';
import { useGetOrdersQuery, OrdersQueryParams } from '@/redux/features/orders/ordersApiSlice';
import { Order } from '@/types/orders';
import DaySection from './DaySection';
import { useCreateRoyalMailOrderMutation } from '@/redux/features/royalmail/royalmailApiSlice';
import { toast } from 'react-toastify';
import { formatDate } from './ordersUtils';
import axios from 'axios';

export default function OrderList() {
    const [filters, setFilters] = useState<OrdersQueryParams>({});
    const { data: orders, isLoading, error } = useGetOrdersQuery(filters);
    const [createRoyalMailOrder] = useCreateRoyalMailOrderMutation();

    const handleCreateShipping = async (order_id: string) => {
        try {
            await createRoyalMailOrder({ order_id }).unwrap();
            // Additional feedback via toast is shown in the mutation's onQueryStarted if configured.
        } catch (error: any) {
            console.error(error);
            toast.error('Error creating shipping order');
        }
    };

    const handleDownloadLabel = async (order_id: string) => {
        try {
            const response = await axios({
                url: `/api/royalmail/orders/${order_id}/label/`,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf',
                },
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shipping_label_${order_id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success('Label downloaded successfully');
        } catch (error: any) {
            console.error('Download failed:', error);
            if (error.response?.status === 404) {
                toast.error('Order not found');
            } else if (error.response?.status === 400) {
                toast.error('No shipping label available for this order');
            } else {
                toast.error('Failed to download shipping label');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 dark:text-red-400">
                Error loading orders
            </div>
        );
    }

    if (!orders || !orders.length) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400">
                No orders found
            </div>
        );
    }

    const groupedOrders = orders.reduce<Record<string, Order[]>>((acc, order: Order) => {
        const dateStr = formatDate(order.created).date;
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(order);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto lg:px-8 py-6">
            <div className="space-y-4">
                {Object.entries(groupedOrders)
                    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                    .map(([date, dateOrders]) => (
                        <DaySection
                            key={date}
                            date={date}
                            orders={dateOrders}
                            onCreateShipping={handleCreateShipping}
                            onDownloadLabel={handleDownloadLabel}
                        />
                    ))}
            </div>
        </div>
    );
}
    