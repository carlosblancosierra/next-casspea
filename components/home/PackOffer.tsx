import Link from 'next/link';
import Image from 'next/image';
import { FiCheck } from 'react-icons/fi';
import { getProducts } from '@/utils/products';
import { ID_MAP, PACK_QUERY_PARAM } from '@/components/packs/constants';
import { cheapestIn, packValue } from '@/components/packs/value';
import { formatCurrency } from '@/utils/currency';
import { Product } from '@/types/products';

/**
 * The indulgence pack, shown as an offer rather than as one more product card:
 * every part of the gift listed with its own shelf price, then the pack price
 * and the difference. The stack is what makes a bundle feel like a deal.
 *
 * Built around the box of 24 when there is one — the middle of the range —
 * and otherwise the largest size that has both a box and a pack. Prices are
 * live; the extras are the cheapest in stock, so "worth" is a floor and never
 * an inflated number. When there is no saving, the line says nothing.
 */

const PREFERRED_SIZE = 24;
const SIGNATURE = 'signature-boxes';

function pickBox(products: Product[]): Product | null {
    const boxes = products.filter(
        p => p.category?.slug === SIGNATURE && p.active !== false && !p.sold_out && ID_MAP[p.units_per_box ?? 0],
    );
    const packOk = (b: Product) => {
        const pack = products.find(p => p.id === ID_MAP[b.units_per_box ?? 0]);
        return !pack?.sold_out;
    };
    const available = boxes.filter(packOk);
    return (
        available.find(b => b.units_per_box === PREFERRED_SIZE)
        ?? available.sort((a, b) => (b.units_per_box ?? 0) - (a.units_per_box ?? 0))[0]
        ?? null
    );
}

export default async function PackOffer() {
    const products = await getProducts();
    const box = pickBox(products);
    if (!box) return null;

    const bark = cheapestIn(products, 'chocolate-barks');
    const hot = cheapestIn(products, 'hot-chocolate');
    const card = cheapestIn(products, 'gift-cards');
    const value = packValue(box, [bark, hot, card]);
    if (!value) return null;

    const lines = [
        { label: `Signature box of ${box.units_per_box} hand-painted bonbons`, price: box.current_price },
        bark && { label: 'Our chocolate bark', price: bark.current_price },
        hot && { label: 'Luxury hot chocolate', price: hot.current_price },
        card && { label: 'Gift card with your own message', price: card.current_price },
    ].filter(Boolean) as { label: string; price?: string }[];

    const href = `/shop-now/${box.slug}?${PACK_QUERY_PARAM}=1`;

    return (
        <div className="grid overflow-hidden rounded-2xl bg-secondary-bg text-primary-text-light md:grid-cols-2">
            <div className="relative min-h-[260px]">
                <Image
                    src="/home/2026/01/4.jpg"
                    alt="An open CassPea box of hand-painted bonbons"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">The whole gift, done</p>
                <h2 className="font-playfair text-3xl font-bold md:text-4xl">The Indulgence Pack</h2>
                <p className="text-sm opacity-90">
                    Everything they need for a night in, in one box. You choose the flavours and write the card; we
                    do the rest.
                </p>

                <ul className="space-y-2">
                    {lines.map(line => (
                        <li key={line.label} className="flex items-start justify-between gap-4 text-sm">
                            <span className="flex items-start gap-2">
                                <FiCheck aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                                {line.label}
                            </span>
                            <span className="opacity-80">{formatCurrency(line.price)}</span>
                        </li>
                    ))}
                </ul>

                <div className="border-t border-white/20 pt-4">
                    {value.saving > 0 && (
                        <p className="text-sm opacity-80">
                            Bought separately: <span className="line-through">{formatCurrency(value.separatePrice)}</span>
                        </p>
                    )}
                    <p className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-playfair text-4xl font-bold">{formatCurrency(value.packPrice)}</span>
                        {value.saving > 0 && (
                            <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-text">
                                You save {formatCurrency(value.saving)}
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Link
                        href={href}
                        className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-lg font-semibold text-accent-text hover:opacity-90"
                    >
                        Build your Indulgence Pack
                    </Link>
                    <Link href="/shop-now/categories/packs" className="text-sm underline underline-offset-4 opacity-90 hover:opacity-100">
                        Other sizes
                    </Link>
                </div>
            </div>
        </div>
    );
}
