'use client';

import CategoryCard from '@/components/store/CategoryCard';
import Store from '@/components/store/Store';
import { useGetCategoriesQuery } from '@/redux/features/products/productApiSlice';
import { useGetDailyUnitsSoldQuery } from '@/redux/features/orders/ordersApiSlice';
import Spinner from '@/components/common/Spinner';
import { useEffect, useState } from 'react';
export default function Page() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const { data: dailyUnitsSold, isLoading: dailyUnitsSoldLoading, error: dailyUnitsSoldError } = useGetDailyUnitsSoldQuery();
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (dailyUnitsSold && dailyUnitsSold.all_sold && !dailyUnitsSoldLoading && !dailyUnitsSoldError) {
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
    } else if (dailyUnitsSoldLoading) {
      setDisplayedCount(0);
    }
  }, [dailyUnitsSold, dailyUnitsSoldLoading, dailyUnitsSoldError]);

	return (
		<>
    <main className="container mx-auto min-h-[80vh] dark:bg-gray-900">
      {/* Card for chocolates sold */}
      {(!dailyUnitsSoldError) && (
        <div className="flex justify-center mb-6">
          <div className="rounded-xl shadow-xl bg-white dark:bg-gray-800 px-8 py-6 flex flex-col items-center w-full max-w-md border border-yellow-300">
            <span className="text-lg font-semibold text-gray-700 dark:text-yellow-200 mb-2">Chocolates Sold Since 2013</span>
            <div className="flex items-center justify-center h-16">
              {dailyUnitsSoldLoading ? (
                <Spinner md />
              ) : (
                <span className="text-4xl font-extrabold text-yellow-500 dark:text-yellow-300 tracking-tight">
                  {displayedCount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Shop Now
        </h1>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading categories</div>}
      {categories && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-[300px]">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </main>
		</>
	);
}
