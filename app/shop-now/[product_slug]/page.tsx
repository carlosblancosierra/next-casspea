import type { Metadata } from 'next';
import ProductDetail from '@/components/product_detail/ProductDetail';
import { Product } from '@/types/products';

const BASE_URL = 'https://www.casspea.co.uk';

async function fetchProduct(slug: string): Promise<Product | null> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_HOST}/api/products/${slug}/`,
			{ next: { revalidate: 300 } }
		);
		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

export async function generateMetadata(
	{ params }: { params: { product_slug: string } }
): Promise<Metadata> {
	const product = await fetchProduct(params.product_slug);
	if (!product) {
		return { title: 'CassPea Hand Crafted Chocolates' };
	}
	const description = product.seo_description
		|| product.description
		|| `${product.name} — luxury handcrafted chocolates from CassPea, made in London.`;
	return {
		title: `${product.name} | CassPea Chocolates`,
		description,
		alternates: { canonical: `${BASE_URL}/shop-now/${product.slug}/` },
		openGraph: {
			title: `${product.name} | CassPea Chocolates`,
			description,
			url: `${BASE_URL}/shop-now/${product.slug}/`,
			type: 'website',
			...(product.image && { images: [{ url: product.image }] }),
		},
	};
}

function ProductJsonLd({ product }: { product: Product }) {
	const price = product.current_price || product.base_price;
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		description: product.seo_description || product.description,
		...(product.image && { image: product.image }),
		url: `${BASE_URL}/shop-now/${product.slug}/`,
		brand: { '@type': 'Brand', name: 'CassPea' },
		...(price && {
			offers: {
				'@type': 'Offer',
				price,
				priceCurrency: 'GBP',
				availability: 'https://schema.org/InStock',
				url: `${BASE_URL}/shop-now/${product.slug}/`,
			},
		}),
	};
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}

export default async function Page({ params }: { params: { product_slug: string } }) {
	const product = await fetchProduct(params.product_slug);
	return (
		<main className='mx-auto max-w-screen-2xl'>
			{product && <ProductJsonLd product={product} />}
			<ProductDetail slug={params.product_slug} />
		</main>
	);
}
