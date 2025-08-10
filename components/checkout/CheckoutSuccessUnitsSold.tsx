'use client';

import React from 'react';
import { useGetDailyUnitsSoldQuery } from '@/redux/features/orders/ordersApiSlice';
import Spinner from '@/components/common/Spinner';

type OrderItemLike = { product?: { units_per_box?: number }; quantity?: number };

type Props = {
  className?: string;
  /** Opcional: pásame los ítems del pedido si los tienes en esta pantalla */
  orderItems?: OrderItemLike[];
};

const CheckoutSuccessUnitsSold: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { data: dailyUnitsSold, isLoading, error } = useGetDailyUnitsSoldQuery();

  if (error) return null;

  return (
    <div className={`rounded-md border p-4 bg-white dark:bg-gray-800 ${className}`}>
      {isLoading ? (
        <span className="text-sm text-gray-500 dark:text-gray-400"><Spinner md /> Updating…</span>
      ) : (
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          Thanks for your purchase! We now are at <span className="font-extrabold">{dailyUnitsSold?.all_sold?.toLocaleString() ?? 0}</span> chocolates.
        </p>
      )}
    </div>
  );
};

export default CheckoutSuccessUnitsSold;