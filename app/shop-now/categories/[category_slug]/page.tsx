import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CategoryProductsGrid from '@/components/store/CategoryProductsGrid';
import { getCategory, getProducts } from '@/utils/products';
import { Product } from '@/types/products';
import { PACK_ID_TO_UNITS } from '@/components/packs/constants';
import HowItWorks from '@/components/marketing/HowItWorks';

// Render on the server per request so product/category changes show immediately.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: { category_slug: string } },
): Promise<Metadata> {
  const slug = params.category_slug;
  if (slug === 'packs') {
    return {
      title: 'Indulgence Packs | CassPea',
      description:
        'A signature box of handmade chocolates with a chocolate bark, a luxury hot chocolate and a gift card.',
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

  // The Indulgence Packs category. It used to render a nine-step builder of its
  // own; then it redirected to signature boxes, which removed the one page that
  // listed the packs at all — choosing "Indulgence Packs" in the shop showed
  // boxes. Now it lists the four packs, and each one opens its box's builder
  // already in pack mode: the pack's own page redirects to /shop-now/<box>?pack=1.
  //
  // Found by ID_MAP rather than by category membership. ID_MAP is already the
  // single source for which SKU is the pack of which box, and a category that
  // used to render a builder instead of a list may never have had products
  // assigned to it.
  if (slug === 'packs') {
    const products = await getProducts({ revalidate: false });
    const packs = products
      .filter((p: Product) => PACK_ID_TO_UNITS[p.id] && p.active !== false)
      .sort((a: Product, b: Product) => PACK_ID_TO_UNITS[a.id] - PACK_ID_TO_UNITS[b.id]);

    return (
      <div className="container mx-auto min-h-[80vh] py-2 mb-[300px]">
        <div className="md:text-center mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-text dark:text-white text-center">
            Indulgence Packs
          </h1>
          <p className="mt-2 text-center text-sm text-primary-text dark:text-primary-text-light">
            A signature box with a chocolate bark, a luxury hot chocolate and a gift card.
            Pick a size, then choose what goes in it.
          </p>
        </div>

        {packs.length === 0 ? (
          <div className="text-center text-primary-text dark:text-primary-text-light">
            No indulgence packs available right now.
          </div>
        ) : (
          <CategoryProductsGrid products={packs} />
        )}
      </div>
    );
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
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-text dark:text-white text-center">
          {category.name}
        </h1>
      </div>

      {slug === 'signature-boxes' && <HowItWorks className="mb-8" />}

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
