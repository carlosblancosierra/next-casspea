'use client';

import CategoryCard from '@/components/store/CategoryCard';
import { useGetCategoriesQuery } from '@/redux/features/products/productApiSlice';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import Link from 'next/link';
import Image from 'next/image';
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
        {/* Card for chocolates sold */}
        <div className="flex justify-center mb-6">
          <UnitSoldCounter />
        </div>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading categories</div>}
        {categories && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch rounded-xl overflow-hidden border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900 mb-5">
          {/* Left: Image */}
          <Link href="/landing/thermomix" className="relative min-h-[220px] md:min-h-[320px] block group">
            <Image
              src="/home/home-tm7.jpeg"
              alt="Win the Thermomix® TM7 + CassPea Chocolates"
              width={800}
              height={0}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority={false}
              className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
          </Link>
          {/* Right: Copy + CTA */}
          <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-50">
              Win the All‑New Thermomix® TM7
            </h3>
            <p className="text-sm md:text-base text-yellow-950/80 dark:text-yellow-100/90">
              Enter our giveaway for a chance to win the Thermomix® TM7 and a CassPea Signature Box. 
              No purchase necessary.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/landing/thermomix"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-white bg-pink-600 hover:bg-pink-700 transition"
              >
                Enter Giveaway
              </Link>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Terms apply
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
