import { Product } from '@/types/products';
import HomeProductsGrid from './HomeProductsGrid';

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

export default async function HomeProductsServer() {
    const products = await fetchProducts();
    const boxes = products.filter(p => p.category?.slug === 'signature-boxes');
    return <HomeProductsGrid products={boxes} />;
}
