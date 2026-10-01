import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ProductDetail from '@/components/product_detail/ProductDetail';
import { getProduct, getProducts } from '@/utils/products';
import { PACK_ID_TO_UNITS, PACK_QUERY_PARAM } from '@/components/packs/constants';
import { Product } from '@/types/products';

/**
 * Where an indulgence-pack slug should actually go.
 *
 * A pack is not a product you pick off a shelf — it is a box plus a bark, a hot
 * chocolate and a gift card, and the only place to choose those is the box's own
 * builder. Pack products are not in BOX_CATEGORY_SLUGS, so visiting one used to
 * render the plain add-to-cart form with no flavour selection at all: you could
 * buy a pack without saying what went in it.
 *
 * Redirecting here rather than rewriting every link means the store grid, the
 * category pages, direct links and old bookmarks are all fixed at once.
 */
function packRedirectTarget(product: Product, products: Product[]): string | null {
	const units = PACK_ID_TO_UNITS[product.id];
	if (!units) return null;

	const box = products.find(
		(candidate) =>
			candidate.units_per_box === units
			&& candidate.category?.slug === 'signature-boxes'
			&& candidate.active !== false,
	);
	// No box to build it in is not a reason to 404 a page that works today.
	if (!box?.slug) return null;

	return `/shop-now/${box.slug}?${PACK_QUERY_PARAM}=1`;
}

// Render on the server per request so price/availability changes show immediately.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
	{ params }: { params: { product_slug: string } },
): Promise<Metadata> {
	const product = await getProduct(params.product_slug, { revalidate: false });
	if (!product) return { title: 'CassPea Chocolates' };

	const title = product.seo_title || `${product.name} | CassPea`;
	const description =
		product.seo_description || product.description || 'Handmade chocolates by CassPea.';

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: product.image ? [{ url: product.image }] : undefined,
		},
	};
}

export default async function Page({ params }: { params: { product_slug: string } }) {
	// Fetch on the server so the product renders in the initial HTML (SEO / no
	// spinner); ProductDetail keeps it current on the client.
	const products = await getProducts({ revalidate: false });

	const product = products.find((candidate) => candidate.slug === params.product_slug);
	if (product) {
		const target = packRedirectTarget(product, products);
		if (target) redirect(target);
	}

	return (
		<main className="mx-auto max-w-screen-2xl">
			<ProductDetail slug={params.product_slug} initialProducts={products} />
		</main>
	);
}
