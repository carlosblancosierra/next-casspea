'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Playfair_Display } from 'next/font/google';
import { FiCheck, FiGift, FiPackage, FiRefreshCw, FiShoppingCart } from 'react-icons/fi';

import FlavourPicker from '@/components/product_detail/FlavourPicker';
import Spinner from '@/components/common/Spinner';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import { useAddCartItemMutation, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { ID_MAP, PRICE_MAP } from '@/components/packs/constants';
import { Flavour as FlavourType } from '@/types/flavours';
import { Product } from '@/types/products';
import { CartItemBoxFlavorSelection, CartItemRequest } from '@/types/carts';

const playfair = Playfair_Display({ subsets: ['latin'] });

const BOX_SIZES = [9, 15, 24, 48];

// Curated "for Dad" flavour profile — matched by name against the live flavour list,
// in priority order. Falls back to the first available flavours if none match.
const DAD_FLAVOUR_KEYWORDS = [
  'whisky', 'whiskey', 'salted caramel', 'caramel', 'espresso', 'coffee',
  'dark', 'sea salt', 'hazelnut', 'praline', 'gianduja', 'rum', 'cognac', 'orange',
];

const MAX_CURATED = 8;

/** Distribute `size` chocolates round-robin across the curated flavours. */
function buildPrebuild(size: number, curated: FlavourType[]): CartItemBoxFlavorSelection[] {
  if (!curated.length) return [];
  const n = Math.min(curated.length, MAX_CURATED);
  const chosen = curated.slice(0, n);
  const selections = chosen.map<CartItemBoxFlavorSelection>(f => ({ flavor: f, quantity: 0 }));
  for (let i = 0; i < size; i++) {
    selections[i % n].quantity += 1;
  }
  return selections.filter(s => s.quantity > 0);
}

const money = (value: number) => `£${value.toFixed(2)}`;

/** Compact horizontally-scrollable selectable option row for pack extras. */
function OptionRow({
  items,
  selectedId,
  onSelect,
  allowNone,
  noneLabel = 'None',
}: {
  items: Product[];
  selectedId: number | null;
  onSelect: (p: Product | null) => void;
  allowNone?: boolean;
  noneLabel?: string;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
      {allowNone && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={selectedId === null}
          className={`shrink-0 snap-start w-24 rounded-lg border-2 p-2 text-center transition-colors ${
            selectedId === null
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
          }`}
        >
          <div className="h-16 flex items-center justify-center text-xs text-primary-text dark:text-primary-text-light">
            {noneLabel}
          </div>
        </button>
      )}
      {items.map(p => {
        const selected = p.id === selectedId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            aria-pressed={selected}
            className={`shrink-0 snap-start w-24 rounded-lg border-2 p-2 text-left transition-colors ${
              selected
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
            }`}
          >
            <div className="relative h-16 w-full rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
              {p.image && (
                <Image src={p.image} alt={p.name} fill sizes="96px" className="object-cover" />
              )}
              {selected && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-0.5">
                  <FiCheck size={12} />
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] leading-tight text-primary-text dark:text-primary-text-light line-clamp-2">
              {p.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default function FathersDayPreBuild() {
  const router = useRouter();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const { data: flavoursData, isLoading: flavoursLoading } = useGetFlavoursQuery();
  const [addToCart, { isLoading: adding }] = useAddCartItemMutation();
  const [updateCart] = useUpdateCartMutation();

  const [size, setSize] = useState<number>(15);
  const [indulgent, setIndulgent] = useState<boolean>(true);
  const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>([]);

  // Pack extras (only used when indulgent)
  const [chocolateBark, setChocolateBark] = useState<Product | null>(null);
  const [hotChocolate, setHotChocolate] = useState<Product | null>(null);
  const [giftCard, setGiftCard] = useState<Product | null>(null);
  const [giftMessage, setGiftMessage] = useState<string>('');

  const inStock = (p: Product) => p.active !== false && !p.sold_out;

  const signatureBoxes = useMemo(
    () => (products ?? []).filter(p => p.category?.slug === 'signature-boxes'),
    [products]
  );
  const barks = useMemo(
    () => (products ?? []).filter(p => p.category?.slug === 'chocolate-barks' && inStock(p)),
    [products]
  );
  const hotChocolates = useMemo(
    () => (products ?? []).filter(p => p.category?.slug === 'hot-chocolate' && inStock(p)),
    [products]
  );
  const giftCards = useMemo(
    () => (products ?? []).filter(p => p.category?.slug === 'gift-cards' && inStock(p)),
    [products]
  );
  const boxForSize = (s: number) => signatureBoxes.find(p => p.units_per_box === s);

  const curatedFlavours = useMemo<FlavourType[]>(() => {
    if (!flavoursData?.length) return [];
    const result: FlavourType[] = [];
    const seen = new Set<number>();
    for (const keyword of DAD_FLAVOUR_KEYWORDS) {
      for (const flavour of flavoursData) {
        if (seen.has(flavour.id) || flavour.active === false) continue;
        if (flavour.name.toLowerCase().includes(keyword)) {
          result.push(flavour);
          seen.add(flavour.id);
        }
      }
    }
    if (result.length === 0) {
      return flavoursData.filter(f => f.active !== false).slice(0, MAX_CURATED);
    }
    return result.slice(0, MAX_CURATED);
  }, [flavoursData]);

  // (Re)fill the box with Dad's curated picks whenever the size or curated set changes.
  useEffect(() => {
    setFlavours(buildPrebuild(size, curatedFlavours));
  }, [size, curatedFlavours]);

  // Pre-select sensible pack-extra defaults so the box stays "quick" to add.
  useEffect(() => {
    if (chocolateBark === null && barks.length) setChocolateBark(barks[0]);
  }, [barks, chocolateBark]);
  useEffect(() => {
    if (hotChocolate === null && hotChocolates.length) setHotChocolate(hotChocolates[0]);
  }, [hotChocolates, hotChocolate]);

  const selectedCount = flavours.reduce((acc, f) => acc + f.quantity, 0);
  const remainingChocolates = Math.max(0, size - selectedCount);
  const isFull = remainingChocolates === 0 && flavours.length > 0;
  const isSurprise = flavours.length === 0;

  // ---- Flavour editing handlers (mirror ProductFormBoxes) ----
  const handleAddFlavour = (flavour: FlavourType) => {
    if (remainingChocolates <= 0) {
      toast.error(`Your ${size}-piece box is full.`);
      return;
    }
    setFlavours(prev => {
      const idx = prev.findIndex(f => f.flavor?.id === flavour.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { flavor: flavour, quantity: 1 }];
    });
  };

  const handleFlavourChange = (index: number, field: string, value: string | number) => {
    setFlavours(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const incrementQuantity = (index: number) => {
    if (remainingChocolates <= 0) return;
    setFlavours(prev => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: next[index].quantity + 1 };
      return next;
    });
  };

  const decrementQuantity = (index: number) => {
    setFlavours(prev => {
      if (prev[index].quantity <= 1) return prev.filter((_, i) => i !== index);
      const next = [...prev];
      next[index] = { ...next[index], quantity: next[index].quantity - 1 };
      return next;
    });
  };

  const deleteFlavour = (index: number) => {
    setFlavours(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAllFlavours = () => setFlavours([]);

  const resetToDadsPicks = () => setFlavours(buildPrebuild(size, curatedFlavours));

  // ---- Pricing ----
  const plainPrice = (() => {
    const box = boxForSize(size);
    const raw = box?.current_price ?? box?.base_price;
    return raw ? Number(raw) : undefined;
  })();
  const packPrice = PRICE_MAP[size];
  const displayPrice = indulgent ? packPrice : plainPrice;

  const packAvailable = Boolean(ID_MAP[size]);
  const plainAvailable = Boolean(boxForSize(size));

  // ---- Add to cart ----
  const canAddToCart =
    (isFull || isSurprise) && (indulgent ? packAvailable : plainAvailable) && !adding;

  const handleAddToCart = async () => {
    const fillsBox = isFull;
    const selectionType: 'PICK_AND_MIX' | 'RANDOM' = fillsBox ? 'PICK_AND_MIX' : 'RANDOM';
    const flavorSelections = fillsBox
      ? flavours.filter(f => f.flavor?.id).map(f => ({ flavor: f.flavor!.id, quantity: f.quantity }))
      : [];

    let request: CartItemRequest;
    if (indulgent) {
      const packId = ID_MAP[size];
      if (!packId) {
        toast.error('This indulgence pack is unavailable right now.');
        return;
      }
      request = {
        product: packId,
        quantity: 1,
        pack_customization: {
          selection_type: selectionType,
          flavor_selections: flavorSelections,
          chocolate_bark: chocolateBark?.id ?? undefined,
          hot_chocolate: hotChocolate?.id ?? undefined,
          gift_card: giftCard?.id ?? undefined,
        },
      };
    } else {
      const box = boxForSize(size);
      if (!box) {
        toast.error('This box size is unavailable right now.');
        return;
      }
      request = {
        product: box.id,
        quantity: 1,
        box_customization: { selection_type: selectionType, allergens: [], flavor_selections: flavorSelections },
      };
    }

    try {
      if (indulgent && giftCard && giftMessage.trim() !== '') {
        await updateCart({ gift_message: giftMessage }).unwrap();
      }
      await addToCart(request).unwrap();
      toast.success("Dad's box added to your cart!");
      router.push('/cart');
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
      console.error("Father's Day add to cart error:", error);
    }
  };

  if (productsLoading || flavoursLoading) {
    return (
      <section className="py-16 flex items-center justify-center">
        <Spinner md />
      </section>
    );
  }

  return (
    <section id="build-dads-box" className="scroll-mt-24 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-2">
            Father&apos;s Day · Ready in minutes
          </span>
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-primary-text dark:text-white`}>
            Build Dad&apos;s Box
          </h2>
          <p className="mt-3 text-primary-text dark:text-primary-text-light max-w-2xl mx-auto">
            We&apos;ve pre-picked a bold, dad-worthy flavour line-up. Choose a size, keep our picks or
            swap in your own, and add it to your cart in seconds.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-main-bg dark:bg-main-bg-dark shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left: choices */}
            <div className="p-6 md:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700">
              {/* Step 1: box type */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-3">
                  1. Choose the experience
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIndulgent(true)}
                    aria-pressed={indulgent}
                    className={`text-left rounded-xl border-2 p-4 transition-colors ${
                      indulgent
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                        : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <FiGift className="text-amber-600 dark:text-amber-400" size={20} />
                      {indulgent && <FiCheck className="text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="mt-2 font-bold text-primary-text dark:text-white">Indulgence Pack</p>
                    <p className="text-xs text-primary-text dark:text-primary-text-light mt-1">
                      The box plus gourmet chocolate bark &amp; luxury hot chocolate.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndulgent(false)}
                    aria-pressed={!indulgent}
                    className={`text-left rounded-xl border-2 p-4 transition-colors ${
                      !indulgent
                        ? 'border-slate-700 bg-slate-100 dark:border-slate-400 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <FiPackage className="text-slate-700 dark:text-slate-300" size={20} />
                      {!indulgent && <FiCheck className="text-slate-700 dark:text-slate-300" />}
                    </div>
                    <p className="mt-2 font-bold text-primary-text dark:text-white">Just the Box</p>
                    <p className="text-xs text-primary-text dark:text-primary-text-light mt-1">
                      Our signature box of handmade bonbons — simple and classic.
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 2: size */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-3">
                  2. Pick a size
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BOX_SIZES.map(s => {
                    const price = indulgent
                      ? PRICE_MAP[s]
                      : (() => {
                          const b = signatureBoxes.find(p => p.units_per_box === s);
                          const raw = b?.current_price ?? b?.base_price;
                          return raw ? Number(raw) : undefined;
                        })();
                    const selected = s === size;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={selected}
                        className={`rounded-xl border-2 py-3 px-2 text-center transition-colors ${
                          selected
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                        }`}
                      >
                        <p className="font-bold text-lg text-primary-text dark:text-white">{s}</p>
                        <p className="text-[11px] text-primary-text dark:text-primary-text-light">pieces</p>
                        {price !== undefined && (
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-1">
                            {money(price)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 (indulgent only): pack extras */}
              {indulgent && (
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light">
                    3. Add the indulgent extras
                  </h3>

                  {barks.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-primary-text dark:text-primary-text-light mb-2">
                        Chocolate bark
                      </p>
                      <OptionRow
                        items={barks}
                        selectedId={chocolateBark?.id ?? null}
                        onSelect={setChocolateBark}
                      />
                    </div>
                  )}

                  {hotChocolates.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-primary-text dark:text-primary-text-light mb-2">
                        Hot chocolate
                      </p>
                      <OptionRow
                        items={hotChocolates}
                        selectedId={hotChocolate?.id ?? null}
                        onSelect={setHotChocolate}
                      />
                    </div>
                  )}

                  {giftCards.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-primary-text dark:text-primary-text-light mb-2">
                        Gift card (optional)
                      </p>
                      <OptionRow
                        items={giftCards}
                        selectedId={giftCard?.id ?? null}
                        onSelect={setGiftCard}
                        allowNone
                        noneLabel="No card"
                      />
                      {giftCard && (
                        <textarea
                          value={giftMessage}
                          onChange={e => setGiftMessage(e.target.value)}
                          placeholder="Add a message for Dad (optional)…"
                          rows={2}
                          className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-main-bg dark:bg-slate-800 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: flavours */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light">
                    {indulgent ? '4.' : '3.'} Dad&apos;s flavours
                  </h3>
                  <button
                    type="button"
                    onClick={resetToDadsPicks}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline"
                  >
                    <FiRefreshCw size={12} /> Reset to our picks
                  </button>
                </div>
                <p className="text-xs text-primary-text dark:text-primary-text-light mb-3">
                  {isSurprise
                    ? "No flavours selected — we'll surprise Dad with our best bold picks."
                    : remainingChocolates > 0
                    ? `Add ${remainingChocolates} more to fill the box, or clear all to let us surprise him.`
                    : 'Box full — ready to go. Swap any flavour you like.'}
                </p>
                <FlavourPicker
                  flavours={flavours}
                  remainingChocolates={remainingChocolates}
                  maxChocolates={size}
                  handleAddFlavour={handleAddFlavour}
                  handleFlavourChange={handleFlavourChange}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                  deleteFlavour={deleteFlavour}
                  handleDeleteAllFlavours={handleDeleteAllFlavours}
                  selectedAllergens={[]}
                  availableFlavours={flavoursData}
                />
              </div>
            </div>

            {/* Right: summary + CTA */}
            <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/40 flex flex-col">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-4">
                Your Father&apos;s Day box
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-primary-text dark:text-primary-text-light">Box</dt>
                  <dd className="font-medium text-primary-text dark:text-white">{size} pieces</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-primary-text dark:text-primary-text-light">Type</dt>
                  <dd className="font-medium text-primary-text dark:text-white">
                    {indulgent ? 'Indulgence Pack' : 'Signature Box'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-primary-text dark:text-primary-text-light">Flavours</dt>
                  <dd className="font-medium text-primary-text dark:text-white text-right">
                    {isSurprise ? 'Surprise selection' : `${selectedCount} of ${size} chosen`}
                  </dd>
                </div>
                {indulgent && (
                  <>
                    {chocolateBark && (
                      <div className="flex justify-between">
                        <dt className="text-primary-text dark:text-primary-text-light">Bark</dt>
                        <dd className="font-medium text-primary-text dark:text-white text-right">
                          {chocolateBark.name}
                        </dd>
                      </div>
                    )}
                    {hotChocolate && (
                      <div className="flex justify-between">
                        <dt className="text-primary-text dark:text-primary-text-light">Hot chocolate</dt>
                        <dd className="font-medium text-primary-text dark:text-white text-right">
                          {hotChocolate.name}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-primary-text dark:text-primary-text-light">Gift card</dt>
                      <dd className="font-medium text-primary-text dark:text-white text-right">
                        {giftCard ? giftCard.name : 'None'}
                      </dd>
                    </div>
                  </>
                )}
              </dl>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-end justify-between">
                <span className="text-primary-text dark:text-primary-text-light">Total</span>
                <span className={`${playfair.className} text-3xl font-bold text-primary-text dark:text-white`}>
                  {displayPrice !== undefined ? money(displayPrice) : '—'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-fathers-day text-white font-semibold py-4 text-lg shadow hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? (
                  'Adding…'
                ) : (
                  <>
                    <FiShoppingCart /> Add Dad&apos;s box to cart
                  </>
                )}
              </button>
              {!canAddToCart && !adding && remainingChocolates > 0 && (
                <p className="text-xs text-center text-amber-700 dark:text-amber-400 mt-2">
                  Fill the box or clear all flavours to continue.
                </p>
              )}
              <p className="text-[11px] text-center text-primary-text dark:text-primary-text-light mt-3">
                Free UK delivery options at checkout · Handmade in London
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
