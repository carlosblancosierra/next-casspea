'use client';

import CategoryCard from '@/components/store/CategoryCard';
import Store from '@/components/store/Store';
import { useGetCategoriesQuery } from '@/redux/features/products/productApiSlice';
export default function Page() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

	return (
		<>
    <main className="container mx-auto min-h-[80vh] dark:bg-gray-900">
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
