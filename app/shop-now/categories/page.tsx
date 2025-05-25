'use client';

import { useGetCategoriesQuery } from '@/redux/features/products/productApiSlice';
import CategoryCard from '@/components/store/CategoryCard';

export default function Page() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  return (
    <main className="container mx-auto min-h-[80vh] dark:bg-gray-900">
      <div className="md:text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Shop Now
        </h1>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading categories</div>}
      {categories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </main>
  );
}