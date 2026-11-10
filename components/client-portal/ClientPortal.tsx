'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import { toast } from 'react-toastify';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { ClientPageItem, UnlockedClientPage } from '@/types/clients';
import { formatCurrency } from '@/utils/currency';
import ClientFlavourRow, { snapToStep } from './ClientFlavourRow';
import ClientLogos from './ClientLogos';

const playfair = Playfair_Display({ subsets: ['latin'] });

const stepOf = (item: ClientPageItem) => Math.max(1, item.product.quantity_step ?? 1);
const priceOf = (item: ClientPageItem) => Number(item.product.current_price ?? item.product.base_price ?? 0);
// The product's own picture wins; the linked flavour's photo is only a
// fallback for products without one.
const imageOf = (item: ClientPageItem) =>
    item.product.thumbnail || item.product.image || item.flavour?.image || null;
// A box holds several chocolates; anything else is sold as single pieces.
const isBox = (item: ClientPageItem) => (item.product.units_per_box ?? 1) > 1;
// Product names are "<Client> - <what it is>" (e.g. "McLaren - Individual
// Chocolate - Vanilla Pecan", "Wild at Heart - Box of 9"): show the last part.
const nameOf = (item: ClientPageItem) => item.flavour?.name ?? item.product.name.split(' - ').pop() ?? item.product.name;

export default function ClientPortal({ page }: { page: UnlockedClientPage }) {
    const router = useRouter();
    const [addCartItem] = useAddCartItemMutation();
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [adding, setAdding] = useState(false);

    const items = page.items.filter(item => !item.product.sold_out);
    // Snap here too, so a half-typed value never counts towards the total.
    const selected = items
        .map(item => ({ item, quantity: snapToStep(quantities[item.product.id] ?? 0, stepOf(item)) }))
        .filter(line => line.quantity > 0);
    const totalPieces = selected.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = selected.reduce((sum, line) => sum + line.quantity * priceOf(line.item), 0);
    const steps = Array.from(new Set(items.map(stepOf)));
    const commonStep = steps.length === 1 ? steps[0] : null;
    const allBoxes = items.length > 0 && items.every(isBox);
    const totalLabel = allBoxes
        ? `${totalPieces} ${totalPieces === 1 ? 'box' : 'boxes'}`
        : `${totalPieces} pcs`;

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            // One request per line, in order, so a failure says which one.
            for (const { item, quantity } of selected) {
                await addCartItem({
                    product: item.product.id,
                    quantity,
                    // Boxes on a client page are "Surprise Me": we choose the
                    // flavours, as with the Summer Break boxes.
                    ...(isBox(item) && {
                        box_customization: { selection_type: 'RANDOM', allergens: [], flavor_selections: [] },
                    }),
                }).unwrap();
            }
            toast.success('Added to your cart!');
            router.push('/cart');
        } catch (error) {
            console.error('Client page add to cart error:', error);
            toast.error('Something went wrong adding to your cart. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="py-8">
            {/* The surface follows the active palette (theme/palettes.js); the
                client's own colour is only an accent, so it never fights the
                site theme or breaks white-text contrast. */}
            <section
                className="mb-10 overflow-hidden rounded-xl border-l-8 bg-gradient-primary text-primary-text-light shadow-lg"
                style={{ borderLeftColor: page.brand_color || undefined }}
            >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-10">
                    <ClientLogos name={page.name} logo={page.logo} brandColor={page.brand_color} />
                    <div className="md:ml-6">
                        <p className="text-xs uppercase tracking-widest opacity-80">Private collection</p>
                        <h1 className={`${playfair.className} text-3xl font-bold md:text-4xl`}>{page.name}</h1>
                        {page.welcome_message && (
                            <p className="mt-2 max-w-xl text-sm opacity-90 md:text-base">{page.welcome_message}</p>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-3">
                <section className="min-w-0 lg:col-span-2">
                    <div className="mb-1 flex flex-wrap items-end justify-between gap-3">
                        <h2 className={`${playfair.className} text-2xl font-bold text-primary-text dark:text-primary-text-light`}>
                            {allBoxes ? 'Chocolate boxes' : 'Individual chocolates'}
                        </h2>
                        {commonStep && commonStep > 1 && (
                            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-text shadow">
                                Packs of {commonStep}
                            </span>
                        )}
                    </div>
                    <p className="mb-4 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                        {allBoxes
                            ? "Choose how many of each box you'd like. Each box is filled with a selection of our flavours."
                            : commonStep && commonStep > 1
                              ? `Choose how many of each flavour you'd like, in multiples of ${commonStep}.`
                              : "Choose how many of each flavour you'd like."}
                    </p>

                    {items.length === 0 ? (
                        <p className="rounded-lg border border-gray-200 p-6 text-center text-primary-text/60 dark:border-gray-700 dark:text-primary-text-light/60">
                            There&apos;s nothing available right now. Please check back soon.
                        </p>
                    ) : (
                        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-main-bg shadow-md dark:divide-gray-700 dark:border-gray-700 dark:bg-main-bg-dark">
                            {items.map(item => (
                                <ClientFlavourRow
                                    key={item.id}
                                    name={nameOf(item)}
                                    description={item.flavour?.mini_description || (isBox(item) ? undefined : item.product.description)}
                                    image={imageOf(item)}
                                    quantity={quantities[item.product.id] ?? 0}
                                    step={stepOf(item)}
                                    unitPrice={priceOf(item)}
                                    onChange={q => setQuantities(prev => ({ ...prev, [item.product.id]: q }))}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <aside className="h-fit rounded-lg border border-gray-200 bg-main-bg p-5 shadow-lg dark:border-gray-700 dark:bg-main-bg-dark lg:sticky lg:top-24">
                    <h3 className="mb-3 text-lg font-semibold text-primary-text dark:text-primary-text-light">Your selection</h3>
                    {selected.length === 0 ? (
                        <p className="mb-4 text-sm text-primary-text/50 dark:text-primary-text-light/50">Nothing selected yet.</p>
                    ) : (
                        <ul className="mb-4 space-y-2 text-sm text-primary-text dark:text-primary-text-light">
                            {selected.map(({ item, quantity }) => (
                                <li key={item.id} className="flex justify-between gap-2">
                                    <span>
                                        {quantity} × {nameOf(item)}
                                    </span>
                                    <span>{formatCurrency(quantity * priceOf(item))}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold text-primary-text dark:border-gray-700 dark:text-primary-text-light">
                        <span>Subtotal ({totalLabel})</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-primary-text/60 dark:text-primary-text-light/60">
                        Shipping and discounts are calculated at checkout.
                    </p>
                    <button
                        type="button"
                        disabled={totalPieces === 0 || adding}
                        onClick={handleAddToCart}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-autumn py-4 text-lg font-semibold text-primary-text-light shadow transition-opacity hover:opacity-95 disabled:opacity-60 dark:bg-primary-2"
                    >
                        <ShoppingBagIcon className="h-5 w-5" />
                        {adding ? 'Adding…' : 'Add to cart'}
                    </button>
                </aside>
            </div>
        </div>
    );
}
