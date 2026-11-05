'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { ShoppingBagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import Spinner from '@/components/common/Spinner';
import { formatCurrency } from '@/utils/currency';
import ClientFlavourRow, { snapToStep } from './ClientFlavourRow';
import { ClientPageConfig } from './clientPages';

const playfair = Playfair_Display({ subsets: ['latin'] });

const initials = (name: string) =>
    name
        .split(/\s+/)
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export default function ClientPortal({ client }: { client: ClientPageConfig }) {
    const { data: flavours, isLoading, error } = useGetFlavoursQuery();
    const offered = useMemo(
        () => (flavours ?? []).slice(0, client.flavourCount),
        [flavours, client.flavourCount],
    );
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [added, setAdded] = useState(false);

    const step = client.quantityStep;
    // Snap here too, so a half-typed value never counts towards the total.
    const selected = offered
        .map(flavour => ({ flavour, quantity: snapToStep(quantities[flavour.id] ?? 0, step) }))
        .filter(item => item.quantity > 0);
    const totalPieces = selected.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = totalPieces * client.unitPrice;

    const setQuantity = (id: number, quantity: number) => {
        setAdded(false);
        setQuantities(prev => ({ ...prev, [id]: quantity }));
    };

    // Mock only: the cart is not wired up yet.
    const handleAddToCart = () => setAdded(true);

    return (
        <div className="py-8">
            {/* Client hero */}
            <section
                className="mb-10 overflow-hidden rounded-xl text-primary-text-light shadow-lg"
                style={{ background: `linear-gradient(120deg, #002B57 0%, ${client.brandColor} 100%)` }}
            >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-10">
                    <div className="flex items-center gap-4">
                        <div
                            className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-2xl font-bold"
                            style={{ color: client.brandColor }}
                        >
                            {client.logo ? (
                                <Image src={client.logo} alt={client.name} fill sizes="80px" className="object-contain p-2" />
                            ) : (
                                initials(client.name)
                            )}
                        </div>
                        <span className="text-2xl font-light opacity-70">×</span>
                        <div className="rounded-lg bg-white px-3 py-2">
                            <Image src="/logos/black.png" alt="CassPea" width={112} height={32} className="h-auto w-28" />
                        </div>
                    </div>
                    <div className="md:ml-6">
                        <p className="text-xs uppercase tracking-widest opacity-80">Private collection</p>
                        <h1 className={`${playfair.className} text-3xl font-bold md:text-4xl`}>{client.name}</h1>
                        <p className="mt-2 max-w-xl text-sm opacity-90 md:text-base">{client.welcomeMessage}</p>
                    </div>
                </div>
                {client.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 bg-black/20 px-6 py-2 text-xs md:px-10">
                        {client.highlights.map(text => (
                            <span key={text}>{text}</span>
                        ))}
                    </div>
                )}
            </section>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Flavours */}
                <section className="lg:col-span-2">
                    <div className="mb-1 flex items-end justify-between gap-3">
                        <h2 className={`${playfair.className} text-2xl font-bold text-primary-text dark:text-primary-text-light`}>
                            Individual chocolates
                        </h2>
                        <span className="rounded-full bg-amber-700 px-2 py-0.5 text-xs font-bold text-white shadow">
                            Packs of {step}
                        </span>
                    </div>
                    <p className="mb-4 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                        Choose how many of each flavour you&apos;d like, in multiples of {step}.
                    </p>

                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Spinner md />
                        </div>
                    ) : error || offered.length === 0 ? (
                        <p className="rounded-lg border border-gray-200 p-6 text-center text-primary-text/60 dark:border-gray-700 dark:text-primary-text-light/60">
                            Flavours are unavailable right now. Please check back soon.
                        </p>
                    ) : (
                        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-main-bg shadow-md dark:divide-gray-700 dark:border-gray-700 dark:bg-main-bg-dark">
                            {offered.map(flavour => (
                                <ClientFlavourRow
                                    key={flavour.id}
                                    flavour={flavour}
                                    quantity={quantities[flavour.id] ?? 0}
                                    step={step}
                                    unitPrice={client.unitPrice}
                                    onChange={q => setQuantity(flavour.id, q)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Summary */}
                <aside className="h-fit rounded-lg border border-gray-200 bg-main-bg p-5 shadow-lg dark:border-gray-700 dark:bg-main-bg-dark lg:sticky lg:top-24">
                    <h3 className="mb-3 text-lg font-semibold text-primary-text dark:text-primary-text-light">Your selection</h3>
                    {selected.length === 0 ? (
                        <p className="mb-4 text-sm text-primary-text/50 dark:text-primary-text-light/50">Nothing selected yet.</p>
                    ) : (
                        <ul className="mb-4 space-y-2 text-sm text-primary-text dark:text-primary-text-light">
                            {selected.map(({ flavour, quantity }) => (
                                <li key={flavour.id} className="flex justify-between gap-2">
                                    <span>
                                        {quantity} × {flavour.name}
                                    </span>
                                    <span>{formatCurrency(quantity * client.unitPrice)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold text-primary-text dark:border-gray-700 dark:text-primary-text-light">
                        <span>Subtotal ({totalPieces} pcs)</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-primary-text/60 dark:text-primary-text-light/60">
                        Shipping and discounts are calculated at checkout.
                    </p>
                    <button
                        type="button"
                        disabled={totalPieces === 0}
                        onClick={handleAddToCart}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-autumn py-4 text-lg font-semibold text-primary-text-light shadow transition-opacity hover:opacity-95 disabled:opacity-60 dark:bg-primary-2"
                    >
                        <ShoppingBagIcon className="h-5 w-5" />
                        Add to cart
                    </button>
                    {added && (
                        <p className="mt-2 flex items-center justify-center gap-1 text-sm text-green-700 dark:text-green-400">
                            <CheckCircleIcon className="h-4 w-4" />
                            Preview only: the cart isn&apos;t connected yet.
                        </p>
                    )}
                </aside>
            </div>
        </div>
    );
}
