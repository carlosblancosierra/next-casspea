"use client";
import Spinner from './Spinner';
import React, { useEffect, useState } from 'react';
import { useGetDailyUnitsSoldQuery } from '@/redux/features/orders/ordersApiSlice';

interface UnitSoldCounterProps {
  className?: string;
  bg?: string;
}

const UnitSoldCounter: React.FC<UnitSoldCounterProps> = ({ className = '' }) => {
  const { data: dailyUnitsSold, isLoading, error } = useGetDailyUnitsSoldQuery();
  const [displayedCount, setDisplayedCount] = useState(0);
  
  // Check if we're running in development/local environment
  const isLocal = process.env.NEXT_PUBLIC_ENV === 'local';

  useEffect(() => {
    // Use fake data in development environment
    if (isLocal) {
      const fakeCount = 165234;
      let start = 0;
      const end = fakeCount;
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
    }
    // Use real data from API in production
    else if (dailyUnitsSold && dailyUnitsSold.all_sold && !isLoading && !error) {
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
  }, [dailyUnitsSold, isLoading, error, isLocal]);

  // In development, we'll always show the counter even if there's an API error
  if (error && !isLocal) return null;

  return (
    <div className="px-4 py-2 flex flex-col items-center w-full bg-gradient-primary">
      <div className="flex items-center justify-center">
        {isLoading && !isLocal ? (
          <Spinner md />
        ) : (
          <span className="text-3xl font-bold text-white tracking-wide drop-shadow">
            {displayedCount.toLocaleString()}
          </span>
        )}
      </div>
      <span className="text-lg text-white">Chocolates sold since 2023</span>
    </div>
  );
};

export default UnitSoldCounter;
