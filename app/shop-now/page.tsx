'use client';

import CategoryCard from '@/components/store/CategoryCard';
import Store from '@/components/store/Store';
import { useGetCategoriesQuery } from '@/redux/features/products/productApiSlice';
import { useGetDailyUnitsSoldQuery } from '@/redux/features/orders/ordersApiSlice';
import Spinner from '@/components/common/Spinner';
export default function Page() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const { data: dailyUnitsSold, isLoading: dailyUnitsSoldLoading, error: dailyUnitsSoldError } = useGetDailyUnitsSoldQuery();

	return (
		<>
    <main className="container mx-auto min-h-[80vh] dark:bg-gray-900">
      {/* Banner for chocolates sold */}
      {(!dailyUnitsSoldError) && (
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 rounded-lg shadow-lg px-6 py-4 text-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              {dailyUnitsSoldLoading ? <Spinner sm /> : (dailyUnitsSold?.all_sold?.toLocaleString() || 0)} chocolates sold since 2013
            </span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-[300px]">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </main>
		</>
	);
}
