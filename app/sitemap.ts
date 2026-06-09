import type { MetadataRoute } from 'next';
import { Product } from '@/types/products';

const BASE_URL = 'https://www.casspea.co.uk';

async function fetchProducts(): Promise<Product[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/products/?active=true`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE_URL}/shop-now/`, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/flavours/`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/personalised/`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/about-us/`, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/help/`, changeFrequency: 'monthly', priority: 0.4 },
    ];

    const products = await fetchProducts();
    const productPages: MetadataRoute.Sitemap = products.map(p => ({
        url: `${BASE_URL}/shop-now/${p.slug}/`,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticPages, ...productPages];
}
