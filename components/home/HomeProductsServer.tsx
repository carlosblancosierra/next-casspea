import { Product } from '@/types/products';
import HomeProductsGrid from './HomeProductsGrid';
import { orderRow } from './orderRow';

async function fetchProducts(): Promise<Product[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/products/?active=true`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

const CATEGORY = 'signature-boxes';

/** The signature boxes, after any products named in `leadSlugs` (e.g. the Advent calendar). */
export default async function HomeProductsServer({ leadSlugs = [] }: { leadSlugs?: string[] }) {
    const products = await fetchProducts();
    const row = orderRow(products, CATEGORY, leadSlugs);
    return <HomeProductsGrid products={row} categorySlug={CATEGORY} leadSlugs={leadSlugs} />;
}
