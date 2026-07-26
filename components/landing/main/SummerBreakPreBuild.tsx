'use client';

// SummerBreakPreBuild: quick-buy for the 25%-off Summer Break clearance boxes.
// Mirrors the Father's Day pre-build UX, but these boxes are "Surprise Me" only
// (no flavour picking) — customers just pick a size and their allergens.

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Playfair_Display } from 'next/font/google';
import { FiCheck, FiShoppingCart } from 'react-icons/fi';

import Spinner from '@/components/common/Spinner';
import AllergenSelection from '@/components/product_detail/AllergenSelection';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import { Product } from '@/types/products';
import { CartItemRequest } from '@/types/carts';

const playfair = Playfair_Display({ subsets: ['latin'] });

// Same allergens offered in the standard box customiser.
const ALLERGENS = [
  { name: 'Gluten', id: 2 },
  { name: 'Alcohol', id: 5 },
  { name: 'Nut', id: 6 },
];

const money = (value: number) => `£${value.toFixed(2)}`;

export default function SummerBreakPreBuild() {
  const router = useRouter();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const [addToCart, { isLoading: adding }] = useAddCartItemMutation();
  const { isClosed: storeClosed, reopenLabel } = useStoreStatus();

  const [size, setSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>('NONE');
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);

  const inStock = (p: Product) => p.active !== false && !p.sold_out;

  const summerBoxes = useMemo(
    () => (products ?? []).filter(p => p.category?.slug === 'summer-break-boxes' && inStock(p)),
    [products]
  );
  // Sizes come straight from the live products, not a hardcoded list.
  const availableSizes = useMemo(
    () => Array.from(
      new Set(summerBoxes.map(p => p.units_per_box).filter((n): n is number => !!n))
    ).sort((a, b) => a - b),
    [summerBoxes]
  );
  const boxForSize = (s: number | null) =>
    s == null ? undefined : summerBoxes.find(p => p.units_per_box === s);

  // Default the selected size to a sensible box once the products load.
  useEffect(() => {
    if (size === null && availableSizes.length) {
      setSize(availableSizes.includes(24) ? 24 : availableSizes[0]);
    }
  }, [availableSizes, size]);

  const selectedBox = boxForSize(size);
  const unitPrice = selectedBox?.current_price ? Number(selectedBox.current_price) : undefined;
  // "Was" price comes from the product data (compare_at_price).
  const wasPrice = selectedBox?.compare_at_price ? Number(selectedBox.compare_at_price) : undefined;
  const total = unitPrice !== undefined ? unitPrice * quantity : undefined;

  const canAddToCart = Boolean(selectedBox) && !adding && !storeClosed;

  const handleAddToCart = async () => {
    if (storeClosed) {
      toast.error(`Our shop is closed for Summer Break. We'll be back on ${reopenLabel}.`);
      return;
    }
    const box = boxForSize(size);
    if (!box) {
      toast.error('This box size is unavailable right now.');
      return;
    }

    const request: CartItemRequest = {
      product: box.id,
      quantity,
      box_customization: {
        selection_type: 'RANDOM',
        allergens: allergenOption === 'SPECIFY' ? selectedAllergens : [],
        flavor_selections: [],
      },
    };

    try {
      await addToCart(request).unwrap();
      toast.success('Summer Break box added to your cart!');
      router.push('/cart');
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
      console.error('Summer Break add to cart error:', error);
    }
  };

  if (productsLoading) {
    return (
      <section className="py-16 flex items-center justify-center">
        <Spinner md />
      </section>
    );
  }

  if (summerBoxes.length === 0) {
    return (
      <section id="build-summer-box" className="scroll-mt-24 py-12">
        <div className="max-w-2xl mx-auto text-center px-4">
          <p className="text-primary-text dark:text-primary-text-light">
            Our Summer Break boxes aren&apos;t available right now. Please check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="build-summer-box" className="scroll-mt-24 py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-pink-600 dark:text-pink-400 mb-2">
            Summer Break Sale · 25% Off · Ready in minutes
          </span>
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-primary-text dark:text-white`}>
            Build your Summer Break Box
          </h2>
          <p className="mt-3 text-primary-text dark:text-primary-text-light max-w-2xl mx-auto">
            We&apos;re clearing the kitchen before our summer break — grab a handmade box at{' '}
            <b>25% off</b>. Pick a size and your allergens, and we&apos;ll surprise you with the flavours.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-main-bg dark:bg-main-bg-dark shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left: choices */}
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 min-w-0 overflow-x-hidden">
              {/* Step 1: size */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-3">
                  1. Pick a size
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableSizes.map(s => {
                    const b = boxForSize(s);
                    const price = b?.current_price ? Number(b.current_price) : undefined;
                    const selected = s === size;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={selected}
                        className={`rounded-xl border-2 py-3 px-2 text-center transition-colors ${
                          selected
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40'
                            : 'border-slate-200 dark:border-slate-700 hover:border-pink-300'
                        }`}
                      >
                        {b?.image && (
                          <div className="relative w-full aspect-square rounded-md overflow-hidden mb-1.5 bg-white dark:bg-slate-800">
                            <Image src={b.image} alt={`Box of ${s} chocolates`} fill sizes="120px" className="object-cover" />
                          </div>
                        )}
                        <p className="font-bold text-lg text-primary-text dark:text-white">{s}</p>
                        <p className="text-[11px] text-primary-text dark:text-primary-text-light">pieces</p>
                        {price !== undefined && (
                          <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mt-1">
                            {money(price)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: allergens */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-3">
                  2. Any allergens to avoid?
                </h3>
                <AllergenSelection
                  allergens={ALLERGENS}
                  selectedAllergens={selectedAllergens}
                  setSelectedAllergens={setSelectedAllergens}
                  allergenOption={allergenOption}
                  setAllergenOption={setAllergenOption}
                />
              </div>

              {/* Step 3: quantity */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-3">
                  3. How many boxes?
                </h3>
                <select
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="block w-full sm:w-40 rounded-lg border border-slate-300 dark:border-slate-600 bg-main-bg dark:bg-slate-800 text-primary-text dark:text-white px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: summary + CTA */}
            <div className="p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900/40 flex flex-col min-w-0">
              {(() => {
                const boxImage = selectedBox?.image ?? selectedBox?.gallery_images?.[0]?.image;
                return boxImage ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-white dark:bg-slate-800">
                    <Image
                      src={boxImage}
                      alt={selectedBox?.name ?? 'Summer Break box'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                ) : null;
              })()}
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-4">
                Your Summer Break box
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-primary-text dark:text-primary-text-light">Box</dt>
                  <dd className="font-medium text-primary-text dark:text-white">
                    {selectedBox?.units_per_box ?? '—'} pieces
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-primary-text dark:text-primary-text-light">Flavours</dt>
                  <dd className="font-medium text-primary-text dark:text-white text-right">Surprise selection</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-primary-text dark:text-primary-text-light">Allergens</dt>
                  <dd className="font-medium text-primary-text dark:text-white text-right">
                    {allergenOption === 'SPECIFY' && selectedAllergens.length
                      ? ALLERGENS.filter(a => selectedAllergens.includes(a.id)).map(a => a.name).join(', ')
                      : 'None'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-primary-text dark:text-primary-text-light">Quantity</dt>
                  <dd className="font-medium text-primary-text dark:text-white text-right">{quantity}</dd>
                </div>
              </dl>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-end justify-between">
                <span className="text-primary-text dark:text-primary-text-light">Total</span>
                <span className="text-right">
                  {wasPrice !== undefined && (
                    <span className="block text-xs line-through text-primary-text dark:text-primary-text-light">
                      {money(wasPrice * quantity)}
                    </span>
                  )}
                  <span className={`${playfair.className} text-3xl font-bold text-primary-text dark:text-white`}>
                    {total !== undefined ? money(total) : '—'}
                  </span>
                </span>
              </div>

              {storeClosed && (
                <div className="mt-4 flex items-start bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    We&apos;re closed for Summer Break and not taking new orders right now. We&apos;ll be back on{' '}
                    <b>{reopenLabel}</b>.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold py-4 text-lg shadow hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {storeClosed ? (
                  'Closed for Summer Break'
                ) : adding ? (
                  'Adding…'
                ) : (
                  <>
                    <FiShoppingCart /> Add to cart
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-primary-text dark:text-primary-text-light mt-3">
                <FiCheck className="inline mb-0.5" /> Already 25% off · No code needed · Handmade in London
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
