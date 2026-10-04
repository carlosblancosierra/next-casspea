import type { Metadata } from 'next';
import CategoryCard from '@/components/store/CategoryCard';
import CategoryProductsGrid from '@/components/store/CategoryProductsGrid';
import { SummerCategoryCard } from '@/components/home/HomeSummer';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import TrustpilotRating from '@/components/common/TrustpilotRating';
import TrustStrip from '@/components/marketing/TrustStrip';
import { getCategories, getProducts } from '@/utils/products';
import { PACK_ID_TO_UNITS } from '@/components/packs/constants';

export const metadata: Metadata = {
  title: 'Shop Handmade Chocolates | CassPea',
  description:
    'Shop CassPea handmade chocolates — signature gift boxes, chocolate barks, hot chocolate and more. Handcrafted in London.',
};

// Render on the server per request so new/updated categories show immediately.
export const dynamic = 'force-dynamic';

const SIGNATURE = 'signature-boxes';

export default async function ShopNowPage() {
  const [categories, products] = await Promise.all([
    getCategories({ revalidate: false }),
    getProducts({ revalidate: false }),
  ]);

  // The boxes are what most people come for, so they are on this page with
  // their prices rather than one click behind a "Signature Boxes" tile. Pack
  // SKUs are excluded: they open their box's builder and are offered there.
  const boxes = products
    .filter(p => p.category?.slug === SIGNATURE && p.active !== false && !PACK_ID_TO_UNITS[p.id])
    .sort((a, b) => (a.units_per_box ?? 0) - (b.units_per_box ?? 0));

  return (
    <main className="container mx-auto min-h-[80vh] px-2 dark:bg-main-bg-dark">
      <header className="text-center mb-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-text dark:text-white">
          Shop CassPea
        </h1>
        <p className="mt-2 text-sm md:text-base text-primary-text/80 dark:text-primary-text-light/80">
          Hand-painted bonbons, made in London and sent tracked across the UK.
        </p>
        <div className="mt-3 flex flex-col items-center gap-1">
          <TrustpilotRating />
          <UnitSoldCounter variant="inline" />
        </div>
      </header>

      {boxes.length > 0 && (
        <section className="mb-10" aria-labelledby="shop-boxes">
          <h2 id="shop-boxes" className="font-playfair text-2xl font-bold text-primary-text dark:text-primary-text-light">
            Signature boxes
          </h2>
          <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
            Filled with our bestsellers. Swap any flavour, or add bark and hot chocolate as an Indulgence Pack.
          </p>
          <CategoryProductsGrid products={boxes} />
        </section>
      )}

      <section className="mb-10" aria-labelledby="shop-categories">
        <h2 id="shop-categories" className="font-playfair text-2xl font-bold text-primary-text dark:text-primary-text-light mb-3">
          Browse everything
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <SummerCategoryCard />
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mb-12 border-t border-black/10 dark:border-white/10 pt-6">
        <TrustStrip />
      </section>
    </main>
  );
}
