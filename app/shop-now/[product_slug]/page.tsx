import type { Metadata } from 'next';
import ProductDetail from '@/components/product_detail/ProductDetail';
import { getProduct, getProducts } from '@/utils/products';

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

	return (
		<main className="mx-auto max-w-screen-2xl">
			<ProductDetail slug={params.product_slug} initialProducts={products} />
		</main>
	);
}
