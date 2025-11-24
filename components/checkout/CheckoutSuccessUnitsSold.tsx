'use client';

import React, { useEffect, useState } from 'react';
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
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (dailyUnitsSold && dailyUnitsSold.all_sold && !isLoading && !error) {
      let start = 0;
      const end = dailyUnitsSold.all_sold;
      const duration = 2000; // ms
      const frameRate = 30; // ms per frame
      const totalFrames = duration / frameRate;
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        const current = Math.floor(progress * (end - start) + start);
        setDisplayedCount(current);
        if (progress === 1) clearInterval(counter);
      }, frameRate);
      return () => clearInterval(counter);
    } else if (isLoading) {
      setDisplayedCount(0);
    }
  }, [dailyUnitsSold, isLoading, error]);

  if (error) return null;

  return (
    <div className={`px-4 py-6 flex flex-col items-center w-full bg-gradient-autumn rounded-md shadow ${className}`}>
      {isLoading ? (
        <span className="text-sm text-primary-text dark:text-primary-text flex items-center"><Spinner md /> Updating…</span>
      ) : (
        <>
          <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow mb-2">
            {displayedCount.toLocaleString()}
          </span>
          <span className="text-lg font-semibold text-white mb-1 text-center">
            Thank you for your order!
          </span>
          <span className="text-base text-white/90 text-center mb-1">
            With your purchase, we’ve now reached this many chocolates sold.
          </span>
          <span className="text-base text-white/80 text-center">You’re part of something delicious – cheers!</span>
        </>
      )}
    </div>
  );
};

export default CheckoutSuccessUnitsSold;