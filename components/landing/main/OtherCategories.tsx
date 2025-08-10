// app/landing/OtherCategories.tsx
'use client';

import { useGetCategoriesQuery } from '@/redux/features/products/productApiSlice';
import CategoryCard             from '@/components/store/CategoryCard';

interface OtherCategoriesProps { landing: string; }

export default function OtherCategories({ landing }: OtherCategoriesProps) {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <div className="text-center py-12">Loading categories...</div>;
  if (error)     return <div className="text-center py-12 text-red-500">Error loading categories.</div>;
  if (!categories) return null;

  const filtered = categories.filter(cat => cat.slug !== 'signature-boxes');
  if (filtered.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">Explore More Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-4xl mx-auto">
        {filtered.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}