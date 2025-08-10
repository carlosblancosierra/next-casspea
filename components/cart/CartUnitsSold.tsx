'use client';

import React, { useEffect, useMemo } from 'react';
import { useGetDailyUnitsSoldQuery } from '@/redux/features/orders/ordersApiSlice';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';

type Props = { className?: string };

const CartUnitsSold: React.FC<Props> = ({ className = '' }) => {
  const { data: soldData, isLoading: soldLoading, error: soldError } = useGetDailyUnitsSoldQuery();
  const { data: cart, isLoading: cartLoading, error: cartError } = useGetCartQuery();

  const baseSold = soldData?.all_sold ?? 0;

  const cartUnits = useMemo(() => {
    const items = cart?.items ?? [];
    return items.reduce((acc: number, item: any) => {
      const unitsPerBox = item?.product?.units_per_box ?? 0;
      const qty = item?.quantity ?? 0;
      return acc + unitsPerBox * qty;
    }, 0);
  }, [cart]);

  useEffect(() => {
    // Persistimos para la página de éxito
    try {
      if (cartUnits > 0) sessionStorage.setItem('pendingUnitsPurchase', String(cartUnits));
    } catch {}
  }, [cartUnits]);

  if (soldError || cartError) return null;

  const projectedTotal = (baseSold || 0) + (cartUnits || 0);
  const loading = soldLoading || cartLoading;

  return (
    <div className={`rounded-md border p-4 bg-white dark:bg-gray-800 ${className}`}>
      {loading ? (
        <span className="text-sm text-gray-500 dark:text-gray-400">Updating…</span>
      ) : (
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {cartUnits > 0 ? (
            <>
              We have sold <span className="font-extrabold">{baseSold.toLocaleString('en-GB')}</span> bonbons. With your <span className="font-extrabold">{cartUnits.toLocaleString('en-GB')}</span> chocolates, we will reach <span className="font-extrabold">{projectedTotal.toLocaleString('en-GB')}</span>!
            </>
          ) : (
            <>We have sold <span className="font-extrabold">{baseSold.toLocaleString('en-GB')}</span> bonbons.</>
          )}
        </p>
      )}
    </div>
  );
};

export default CartUnitsSold;