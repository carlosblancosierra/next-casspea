import { Product } from '@/types/products';
import { PRICE_MAP } from './constants';

/**
 * What an indulgence pack is worth against buying its parts one by one.
 *
 * The pack is sold as a bundle at PRICE_MAP[size]; this adds up the real
 * shelf prices of what goes in it so the page can say "worth £X, save £Y".
 * Every figure comes from live product prices, never a typed-in "worth" —
 * a saving the shop cannot back up is worse than no saving at all — and when
 * the parts do not add up to more than the pack, there is no saving to show.
 */

const price = (p?: Product | null): number => {
    const value = Number(p?.current_price ?? p?.base_price ?? 0);
    return Number.isFinite(value) ? value : 0;
};

const inStock = (p: Product) => p.active !== false && !p.sold_out;

/** The cheapest in-stock product in a category: the honest floor for "worth". */
export function cheapestIn(products: Product[], categorySlug: string): Product | null {
    return products
        .filter(p => p.category?.slug === categorySlug && inStock(p) && price(p) > 0)
        .sort((a, b) => price(a) - price(b))[0] ?? null;
}

export interface PackValue {
    packPrice: number;
    separatePrice: number;
    /** 0 when buying the parts separately is not actually dearer. */
    saving: number;
}

/**
 * The pack's price against the box plus the extras chosen for it. Extras that
 * are null (no gift card picked, say) simply are not counted. Returns null when
 * there is no pack at this size.
 */
export function packValue(
    box: Product,
    extras: Array<Product | null | undefined>,
): PackValue | null {
    const size = box.units_per_box ?? 0;
    const packPrice = PRICE_MAP[size];
    if (!packPrice) return null;

    const separatePrice = round2(price(box) + extras.reduce((sum, p) => sum + price(p), 0));
    const saving = Math.max(0, round2(separatePrice - packPrice));
    return { packPrice, separatePrice, saving };
}

/** Price per piece for a box, or null for anything that is not a multi-piece box. */
export function pricePerPiece(p: Product): number | null {
    const units = p.units_per_box ?? 0;
    const total = price(p);
    if (units < 2 || total <= 0) return null;
    return round2(total / units);
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}
