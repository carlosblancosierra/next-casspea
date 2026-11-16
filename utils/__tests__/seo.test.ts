import { productJsonLd, robotsRules, sitemapEntries, SITE_URL } from '@/utils/seo';
import type { Product, ProductCategory } from '@/types/products';

const box = {
    id: 4,
    name: 'Signature Box of 9',
    slug: '9-bonbons',
    description: 'Nine hand-painted bonbons.',
    current_price: '23.00',
    base_price: '23.00',
    image: 'https://cdn.example.com/box-9.jpg',
    active: true,
    sold_out: false,
    category: { id: 1, name: 'Signature Boxes', slug: 'signature-boxes' },
} as Product;

const now = new Date('2026-11-16T00:00:00Z');

describe('sitemapEntries', () => {
    it('lists the public pages, every active product and every category', () => {
        const urls = sitemapEntries({
            products: [box, { ...box, id: 5, slug: 'old-box', active: false }],
            categories: [{ id: 1, name: 'Signature Boxes', slug: 'signature-boxes' } as ProductCategory],
            adventLive: false,
            now,
        }).map(e => e.url);
        expect(urls).toContain(`${SITE_URL}/`);
        expect(urls).toContain(`${SITE_URL}/shop-now`);
        expect(urls).toContain(`${SITE_URL}/shop-now/9-bonbons`);
        expect(urls).toContain(`${SITE_URL}/shop-now/categories/signature-boxes`);
        expect(urls).not.toContain(`${SITE_URL}/shop-now/old-box`);
        expect(urls).not.toContain(`${SITE_URL}/advent-calendar`);
        expect(urls.some(u => /\/(cart|checkout|admin|orders)/.test(u))).toBe(false);
    });

    it('adds the Advent landing only once it is live', () => {
        const urls = sitemapEntries({ products: [], categories: [], adventLive: true, now }).map(e => e.url);
        expect(urls).toContain(`${SITE_URL}/advent-calendar`);
        expect(urls).not.toContain(`${SITE_URL}/advent-calendar/early-access`);
    });
});

describe('robotsRules', () => {
    it('keeps crawlers out of private pages and points at the sitemap', () => {
        const robots = robotsRules();
        const rule = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;
        expect(rule.allow).toBe('/');
        expect(rule.disallow).toEqual(expect.arrayContaining(['/cart', '/checkout/', '/admin/', '/orders']));
        expect(robots.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    });
});

describe('productJsonLd', () => {
    it('describes the product with its own URL, price and stock', () => {
        const ld = productJsonLd(box);
        expect(ld).toMatchObject({
            '@type': 'Product',
            name: 'Signature Box of 9',
            image: ['https://cdn.example.com/box-9.jpg'],
            sku: '4',
            offers: {
                url: `${SITE_URL}/shop-now/9-bonbons`,
                price: '23.00',
                priceCurrency: 'GBP',
                availability: 'https://schema.org/InStock',
            },
        });
        // Site-wide Trustpilot reviews are not reviews of this product.
        expect(ld).not.toHaveProperty('aggregateRating');
    });

    it('marks sold-out products as out of stock', () => {
        expect(productJsonLd({ ...box, sold_out: true }).offers.availability).toBe('https://schema.org/OutOfStock');
    });
});
