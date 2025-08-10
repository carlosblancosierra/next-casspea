import Spinner from './Spinner';
import React, { useEffect, useState } from 'react';
import { useGetDailyUnitsSoldQuery } from '@/redux/features/orders/ordersApiSlice';

interface UnitSoldCounterProps {
  className?: string;
  bg?: string;
}

const UnitSoldCounter: React.FC<UnitSoldCounterProps> = ({ className = '', bg = '' }) => {
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
    <div className={`px-4 py-2 flex flex-col items-center w-full ${bg}`}>
      <div className="flex items-center justify-center">
        {isLoading ? (
          <Spinner md />
        ) : (
          <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow">
            {displayedCount.toLocaleString()}
          </span>
        )}
      </div>
      <span className="text-lg font-semibold text-gray-900 dark:text-white">Chocolates Sold Since 2023</span>
    </div>
  );
};

export default UnitSoldCounter;
