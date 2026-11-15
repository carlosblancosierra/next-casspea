import type { Product } from '@/types/products';
import { TRUSTPILOT_REVIEW_COUNT, TRUSTPILOT_SCORE } from '@/components/common/TrustpilotRating';
import { ADVENT_PATH, COPY, IMAGES } from './content';

const SITE = 'https://www.casspea.co.uk';

/** schema.org availability from the API's flags, sold out first. */
export function availability(product: Product | null): string {
    if (product?.sold_out || product?.active === false) return 'https://schema.org/OutOfStock';
    if (product?.is_preorder_active) return 'https://schema.org/PreOrder';
    return 'https://schema.org/InStock';
}

/** The Product block search engines read for price, stock and stars. */
export function productJsonLd(product: Product | null, price: string) {
    const image = product?.image || IMAGES.hero;
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product?.name || 'CassPea Advent Calendar 2026',
        description: COPY.seo.description,
        image: [image],
        sku: product ? String(product.id) : undefined,
        brand: { '@type': 'Brand', name: 'CassPea' },
        offers: {
            '@type': 'Offer',
            url: `${SITE}${ADVENT_PATH}`,
            price,
            priceCurrency: 'GBP',
            availability: availability(product),
            // The calendar is a 2026 product; the offer ends with the season.
            priceValidUntil: '2026-12-24',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'CassPea' },
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: TRUSTPILOT_SCORE,
            reviewCount: TRUSTPILOT_REVIEW_COUNT,
            bestRating: '5',
        },
    };
}

/** Serialised for a <script> tag: `<` escaped so no string can close it. */
export function jsonLdScript(data: unknown): string {
    return JSON.stringify(data).replace(/</g, '\\u003c');
}
