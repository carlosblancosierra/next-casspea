import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ProductDetail from '@/components/product_detail/ProductDetail';
import { getProduct, getProducts } from '@/utils/products';
import { ADVENT_PATH } from '@/components/advent/content';
import { getAdventLandingData } from '@/components/advent/AdventLanding';
import { packRedirectTarget } from '@/components/packs/constants';
import { productJsonLd } from '@/utils/seo';
import { jsonLdScript } from '@/components/advent/jsonLd';

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
	const [products, advent] = await Promise.all([
		getProducts({ revalidate: false }),
		getAdventLandingData(),
	]);

	// Once the Advent landing is switched live it is where the calendar is
	// sold, so every link to its product page (shop grids, home rows, old
	// bookmarks) lands there. Temporary: switching it off brings this page back.
	if (advent?.live && advent.product?.slug === params.product_slug) redirect(ADVENT_PATH);

	const product = products.find((candidate) => candidate.slug === params.product_slug);
	if (product) {
		const target = packRedirectTarget(product, products);
		if (target) redirect(target);
	}

	return (
		<main className="mx-auto max-w-screen-2xl">
			{product && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd(product)) }}
				/>
			)}
			<ProductDetail slug={params.product_slug} initialProducts={products} />
		</main>
	);
}
