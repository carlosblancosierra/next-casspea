import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CategoryProductsGrid from '@/components/store/CategoryProductsGrid';
import { getCategory } from '@/utils/products';
import { Product } from '@/types/products';

// Render on the server per request so product/category changes show immediately.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: { category_slug: string } },
): Promise<Metadata> {
  const slug = params.category_slug;
  if (slug === 'packs') {
    return {
      title: 'Build Your Own Pack | CassPea',
      description: 'Pick your own chocolates and build a personalised CassPea pack.',
    };
  }
  const category = await getCategory(slug, { revalidate: false });
  if (!category) return { title: 'Shop | CassPea' };
  return {
    title: `${category.name} | CassPea`,
    description: category.description || `Shop our ${category.name} — handmade chocolates by CassPea.`,
  };
}

export default async function CategoryDetailPage(
  { params }: { params: { category_slug: string } },
) {
  const slug = params.category_slug;

  // The packs route used to render a nine-step builder of its own, separate
  // from the one on the box pages and doing the same job. One flow now: pick a
  // box, and make it a pack from there. PackBuilder and its steps are left in
  // the tree for a release rather than deleted with this change, so reverting
  // is a one-line job.
  if (slug === 'packs') {
    redirect('/shop-now/categories/signature-boxes');
  }

  const category = await getCategory(slug, { revalidate: false });
  if (!category) notFound();

  const products = category.products ?? [];
  // 'all' shows everything; a real category shows only its own products.
  const filteredProducts =
    slug === 'all' ? products : products.filter((p: Product) => p?.category?.slug === slug);

  // A category holding one product is a grid with one card in it: a page whose
  // only purpose is to be clicked through. Go straight to the product.
  //
  // 'all' is the whole catalogue, so it is never a shortcut even when the shop
  // is down to one item. Temporary, not permanent: a category with one product
  // today may have three next week, and a 308 would sit in browser caches long
  // after that stopped being true.
  if (slug !== 'all' && filteredProducts.length === 1 && filteredProducts[0]?.slug) {
    redirect(`/shop-now/${filteredProducts[0].slug}`);
  }

  return (
    <div className="container mx-auto min-h-[80vh] py-2 mb-[300px]">
      <div className="md:text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-text dark:text-white text-center">
          {category.name}
        </h1>
      </div>

      {slug === 'signature-boxes' && (
        <section className="mb-8 text-center">
          <h2 className="font-bold mt-2">
            Ordering delicious hand made chocolates from CassPea is simple and fun!
          </h2>
          <ol className="mt-4 space-y-1 list-decimal list-inside">
            <li className="font-bold text-pink-500 dark:text-pink-500">For Signature Boxes, select your box size</li>
            <li className="font-bold text-green-500 dark:text-green-500">Choose a Surprise Box or Pick and Mix your own from our succulent flavours</li>
            <li className="font-bold text-red-500 dark:text-red-500">Choose your delivery - free on orders over £56</li>
            <li className="font-bold text-orange-500 dark:text-orange-400">Pay securely online</li>
            <li className="font-bold text-purple-500 dark:text-purple-500">Receive your chocolates and enjoy!</li>
          </ol>
        </section>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center text-primary-text dark:text-primary-text">
          No products found for this category.
        </div>
      ) : (
        <CategoryProductsGrid products={filteredProducts} />
      )}
    </div>
  );
}
