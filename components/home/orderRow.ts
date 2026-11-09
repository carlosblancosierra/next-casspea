// Plain module (no 'use client') so both the server component and the client
// grid can call it.
import { Product } from '@/types/products';

/**
 * The products in `categorySlug`, with the products named in `leadSlugs` put
 * in front, in that order. A lead product can come from any category (the
 * Advent calendar is not a signature box) and is never listed twice.
 */
export function orderRow(all: Product[], categorySlug?: string, leadSlugs: string[] = []): Product[] {
    const leads = leadSlugs
        .map((slug) => all.find((p) => p.slug === slug))
        .filter((p): p is Product => !!p);
    const rest = all.filter(
        (p) => (!categorySlug || p.category?.slug === categorySlug) && !leadSlugs.includes(p.slug)
    );
    return [...leads, ...rest];
}
