import type { MetadataRoute } from 'next';
import type { Product, ProductCategory } from '@/types/products';
import { availability } from '@/components/advent/jsonLd';
import { ADVENT_SLUG } from '@/components/advent/content';

export const SITE_URL = 'https://www.casspea.co.uk';

/**
 * Pages worth indexing that aren't driven by the products API. Campaign and
 * partner landings (gold, blue, thermomix, past seasons) are left out on
 * purpose: they're reached from ads and emails, not search.
 */
const PUBLIC_PAGES: Array<{ path: string; priority: number }> = [
    { path: '/', priority: 1 },
    { path: '/shop-now', priority: 0.9 },
    { path: '/shop-now/categories', priority: 0.7 },
    { path: '/flavours', priority: 0.7 },
    { path: '/personalised', priority: 0.7 },
    { path: '/about-us', priority: 0.5 },
    { path: '/faq', priority: 0.4 },
    { path: '/contact', priority: 0.4 },
    { path: '/subscribe', priority: 0.3 },
    { path: '/blog/why-chocolate-tastes-different', priority: 0.3 },
];

/** Paying, signed-in or staff-only pages. Never useful in search. */
const PRIVATE_PATHS = ['/cart', '/checkout/', '/admin/', '/orders', '/auth/', '/addresses/', '/clients/', '/dev', '/unsubscribe'];

interface SitemapInput {
    products: Product[];
    categories: ProductCategory[];
    /** The Advent landing is staff-only until it's switched live. */
    adventLive: boolean;
    now?: Date;
}

export function sitemapEntries({ products, categories, adventLive, now = new Date() }: SitemapInput): MetadataRoute.Sitemap {
    const entry = (path: string, priority: number) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority,
    });
    return [
        ...PUBLIC_PAGES.map(({ path, priority }) => entry(path, priority)),
        ...(adventLive ? [entry('/advent-calendar', 0.9)] : []),
        ...categories.filter(c => c.slug).map(c => entry(`/shop-now/categories/${c.slug}`, 0.7)),
        ...products
            .filter(p => p.slug && p.active !== false)
            // Live, the calendar's product page redirects to the landing: list the landing only.
            .filter(p => !(adventLive && p.slug === ADVENT_SLUG))
            .map(p => entry(`/shop-now/${p.slug}`, 0.8)),
    ];
}

export function robotsRules(): MetadataRoute.Robots {
    return {
        rules: { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}

/**
 * The Product block for a product page: price, stock and image for rich
 * results. No aggregateRating: our Trustpilot score is for the shop, and
 * Google treats site-wide reviews on a product as misleading markup.
 */
export function productJsonLd(product: Product) {
    const price = product.current_price ?? product.base_price;
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.seo_description || product.description || undefined,
        image: product.image ? [product.image] : undefined,
        sku: String(product.id),
        category: product.category?.name,
        brand: { '@type': 'Brand', name: 'CassPea' },
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/shop-now/${product.slug}`,
            price,
            priceCurrency: 'GBP',
            availability: availability(product),
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'CassPea' },
        },
    };
}
