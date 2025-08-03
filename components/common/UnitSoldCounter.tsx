import Spinner from './Spinner';
import React, { useEffect, useState } from 'react';
import { useGetDailyUnitsSoldQuery } from '@/redux/features/orders/ordersApiSlice';

interface UnitSoldCounterProps {
  className?: string;
}

const UnitSoldCounter: React.FC<UnitSoldCounterProps> = ({ className = '' }) => {
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
    <div className={`rounded-xl bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 px-4 py-3 flex flex-col items-center w-full max-w-md ${className}`}>
      <span className="text-lg font-semibold text-gray-900 dark:text-white">Chocolates Sold Since 2023</span>
      <div className="flex items-center justify-center h-14">
        {isLoading ? (
          <Spinner md />
        ) : (
          <span className="text-4xl font-extrabold text-white tracking-tight drop-shadow">
            {displayedCount.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default UnitSoldCounter;
