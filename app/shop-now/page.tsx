import type { Metadata } from 'next';
import CategoryCard from '@/components/store/CategoryCard';
import { SummerCategoryCard } from '@/components/home/HomeSummer';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import TrustpilotRating from '@/components/common/TrustpilotRating';
import { getCategories } from '@/utils/products';

export const metadata: Metadata = {
  title: 'Shop Handmade Chocolates | CassPea',
  description:
    'Shop CassPea handmade chocolates — signature gift boxes, chocolate barks, hot chocolate and more. Handcrafted in London.',
};

// Render on the server per request so new/updated categories show immediately.
export const dynamic = 'force-dynamic';

export default async function ShopNowPage() {
  const categories = await getCategories({ revalidate: false });

  return (
    <main className="container mx-auto min-h-[80vh] dark:bg-main-bg-dark">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-primary-text dark:text-white">
          Shop Now
        </h1>
      </div>
      {/* Social proof, moved here off the announcement bar */}
      <div className="flex justify-center mb-4">
        <TrustpilotRating />
      </div>
      {/* Chocolates sold counter (client island) */}
      <div className="flex justify-center mb-6">
        <UnitSoldCounter />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
        <SummerCategoryCard />
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}
