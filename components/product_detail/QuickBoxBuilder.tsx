'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiCheck, FiRefreshCw, FiShoppingCart } from 'react-icons/fi';

import FlavourPicker from './FlavourPicker';
import AllergenSelection from './AllergenSelection';
import Spinner from '@/components/common/Spinner';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import { useAddCartItemMutation, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { ID_MAP, PRICE_MAP, ALLERGENS } from '@/components/packs/constants';
import { formatCurrency } from '@/utils/currency';
import { Flavour as FlavourType } from '@/types/flavours';
import { Product } from '@/types/products';
import { CartItemBoxFlavorSelection, CartItemRequest } from '@/types/carts';

/**
 * The challenger in the box-builder experiment.
 *
 * Generalised from the Father's Day landing's pre-build (FathersDayPreBuild):
 * the box arrives already full, so "add to cart" is one click and editing is
 * optional rather than compulsory. Three things had to change to make it a
 * fair test on a product page:
 *
 *  - the size picker is gone. The page is already for one specific box, and a
 *    size picker in the variant would mean a win could not be attributed to
 *    the builder.
 *  - the allergen question stays. The control asks it of everyone; a variant
 *    that silently sent `allergens: []` would make this "asks about nut
 *    allergies vs doesn't" rather than a UX test, and the winner would ship
 *    that gap to every customer.
 *  - the Father's Day curation and palette become neutral defaults.
 */

const MAX_CURATED = 8;

/** Distribute `size` chocolates round-robin across the curated flavours. */
export function buildPrebuild(size: number, curated: FlavourType[]): CartItemBoxFlavorSelection[] {
    if (!curated.length) return [];
    const n = Math.min(curated.length, MAX_CURATED);
    const chosen = curated.slice(0, n);
    const selections = chosen.map<CartItemBoxFlavorSelection>(f => ({ flavor: f, quantity: 0 }));
    for (let i = 0; i < size; i++) {
        selections[i % n].quantity += 1;
    }
    return selections.filter(s => s.quantity > 0);
}

/** Compact horizontally-scrollable option row for pack extras. */
function OptionRow({
    items,
    selectedId,
    onSelect,
    allowNone,
    noneLabel = 'None',
    label,
}: {
    items: Product[];
    selectedId: number | null;
    onSelect: (p: Product | null) => void;
    allowNone?: boolean;
    noneLabel?: string;
    label: string;
}) {
    return (
        <div role="group" aria-label={label} className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {allowNone && (
                <button
                    type="button"
                    onClick={() => onSelect(null)}
                    aria-pressed={selectedId === null}
                    className={`shrink-0 snap-start w-24 rounded-lg border-2 p-2 text-center transition-colors ${
                        selectedId === null
                            ? 'border-primary bg-primary/5 dark:border-primary-2 dark:bg-primary-2/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
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
                                ? 'border-primary bg-primary/5 dark:border-primary-2 dark:bg-primary-2/10'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }`}
                    >
                        <div className="relative h-16 w-full rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {p.image && (
                                <Image src={p.image} alt={p.name} fill sizes="96px" className="object-cover" />
                            )}
                            {selected && (
                                <span className="absolute top-1 right-1 bg-primary dark:bg-primary-2 text-primary-text-light rounded-full p-0.5">
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

interface QuickBoxBuilderProps {
    product: Product;
    /** Fired once the item is actually in the cart, never on the attempt. */
    onAddedToCart?: () => void;
}

const QuickBoxBuilder: React.FC<QuickBoxBuilderProps> = ({ product, onAddedToCart }) => {
    const router = useRouter();
    const { data: products, isLoading: productsLoading } = useGetProductsQuery();
    const { data: flavoursData, isLoading: flavoursLoading } = useGetFlavoursQuery();
    const [addToCart, { isLoading: adding }] = useAddCartItemMutation();
    const [updateCart] = useUpdateCartMutation();

    // Fixed by the page, not chosen here.
    const size = product.units_per_box || 0;
    const isSoldOut = !!product.sold_out;
    // Summer Break clearance boxes are Surprise Me only — no flavour picking.
    const surpriseOnly = !!product.disable_flavour_selection;

    const [indulgent, setIndulgent] = useState<boolean>(false);
    const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>([]);
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>(null);

    const [chocolateBark, setChocolateBark] = useState<Product | null>(null);
    const [hotChocolate, setHotChocolate] = useState<Product | null>(null);
    const [giftCard, setGiftCard] = useState<Product | null>(null);
    const [giftMessage, setGiftMessage] = useState<string>('');

    const inStock = (p: Product) => p.active !== false && !p.sold_out;

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

    /**
     * The house selection: whatever the shop lists first, filtered by the
     * allergens the customer named. No seasonal curation here — the landing's
     * "Dad" keyword list does not generalise to a product page.
     */
    const curatedFlavours = useMemo<FlavourType[]>(() => {
        if (!flavoursData?.length) return [];
        return flavoursData
            .filter(f => f.active !== false)
            .filter(f => !selectedAllergens.some(id => (f.allergens ?? []).some(a => a.id === id)))
            .slice(0, MAX_CURATED);
    }, [flavoursData, selectedAllergens]);

    // (Re)fill the box whenever the curated set changes — including when the
    // customer names an allergen, which must remove those flavours from a box
    // we filled for them before they told us.
    useEffect(() => {
        if (surpriseOnly) return;
        setFlavours(buildPrebuild(size, curatedFlavours));
    }, [size, curatedFlavours, surpriseOnly]);

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

    const deleteFlavour = (index: number) => setFlavours(prev => prev.filter((_, i) => i !== index));
    const handleDeleteAllFlavours = () => setFlavours([]);
    const resetToOurPicks = () => setFlavours(buildPrebuild(size, curatedFlavours));

    const plainPrice = Number(product.current_price ?? product.base_price ?? 0);
    const packPrice = PRICE_MAP[size];
    const displayPrice = indulgent ? packPrice : plainPrice;

    const packId = ID_MAP[size];
    const indulgencePack = (products ?? []).find(p => p.id === packId);
    const packAvailable = Boolean(packId) && !indulgencePack?.sold_out;

    // The allergen question is answered before the box can be added — the same
    // gate the control applies at its step 2.
    const canAddToCart =
        !isSoldOut
        && allergenOption !== null
        && (isFull || isSurprise)
        && (indulgent ? packAvailable : true)
        && !adding;

    const handleAddToCart = async () => {
        if (isSoldOut) {
            toast.error('This box is sold out.');
            return;
        }
        if (allergenOption === null) {
            toast.error('Please tell us about allergens before adding to your cart.');
            return;
        }

        const fillsBox = isFull && !surpriseOnly;
        const selectionType: 'PICK_AND_MIX' | 'RANDOM' = fillsBox ? 'PICK_AND_MIX' : 'RANDOM';
        const flavorSelections = fillsBox
            ? flavours.filter(f => f.flavor?.id).map(f => ({ flavor: f.flavor!.id, quantity: f.quantity }))
            : [];
        const allergens = allergenOption === 'SPECIFY' ? selectedAllergens : [];

        let request: CartItemRequest;
        if (indulgent) {
            if (!packId) {
                toast.error('This indulgence pack is unavailable right now.');
                return;
            }
            request = {
                product: packId,
                quantity: 1,
                pack_customization: {
                    selection_type: selectionType,
                    allergens,
                    flavor_selections: flavorSelections,
                    chocolate_bark: chocolateBark?.id ?? undefined,
                    hot_chocolate: hotChocolate?.id ?? undefined,
                    gift_card: giftCard?.id ?? undefined,
                },
            };
        } else {
            request = {
                product: product.id,
                quantity: 1,
                box_customization: {
                    selection_type: selectionType,
                    allergens,
                    flavor_selections: flavorSelections,
                },
            };
        }

        try {
            if (indulgent && giftCard && giftMessage.trim() !== '') {
                await updateCart({ gift_message: giftMessage }).unwrap();
            }
            await addToCart(request).unwrap();
            // Only now: a failed add is not a funnel step.
            onAddedToCart?.();
            toast.success('Added to your cart!');
            router.push('/cart');
        } catch (error) {
            toast.error('Failed to add to cart. Please try again.');
            console.error('Quick box builder add to cart error:', error);
        }
    };

    if (isSoldOut) {
        return (
            <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold text-primary-text dark:text-primary-text-light">
                    {surpriseOnly ? 'Summer Break Box' : 'Signature Box'}
                </h2>
                <p className="text-sm text-primary-text dark:text-primary-text-light">
                    This box is currently sold out. Please check back soon or explore our other boxes.
                </p>
                <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full py-3 rounded bg-gray-400 text-primary-text dark:text-primary-text-light cursor-not-allowed"
                >
                    Sold Out
                </button>
            </div>
        );
    }

    if (productsLoading || flavoursLoading) {
        return (
            <div className="py-16 flex items-center justify-center">
                <Spinner md />
            </div>
        );
    }

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary-text dark:text-primary-text-light">
                    Your box of {size}
                </h2>
                <p className="mt-1 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                    We&apos;ve filled it with our most-loved flavours. Change anything you like, or add
                    it as it is.
                </p>
            </div>

            {/* Kept from the control, and deliberately not buried: this is the
                only question in the flow whose answer is about safety. */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-3">
                    Any allergens to avoid?
                </h3>
                <AllergenSelection
                    allergens={ALLERGENS}
                    selectedAllergens={selectedAllergens}
                    setSelectedAllergens={setSelectedAllergens}
                    allergenOption={allergenOption}
                    setAllergenOption={setAllergenOption}
                />
            </div>

            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light mb-3">
                    Make it an indulgence pack?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setIndulgent(false)}
                        aria-pressed={!indulgent}
                        className={`text-left rounded-xl border-2 p-4 transition-colors ${
                            !indulgent
                                ? 'border-primary bg-primary/5 dark:border-primary-2 dark:bg-primary-2/10'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }`}
                    >
                        <p className="font-bold text-primary-text dark:text-primary-text-light">Just the box</p>
                        <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70 mt-1">
                            Our signature box of handmade bonbons — {formatCurrency(plainPrice)}
                        </p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setIndulgent(true)}
                        disabled={!packAvailable}
                        aria-pressed={indulgent}
                        className={`text-left rounded-xl border-2 p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            indulgent
                                ? 'border-primary bg-primary/5 dark:border-primary-2 dark:bg-primary-2/10'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }`}
                    >
                        <p className="font-bold text-primary-text dark:text-primary-text-light">Indulgence pack</p>
                        <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70 mt-1">
                            {packAvailable
                                ? <>Plus chocolate bark &amp; hot chocolate — {formatCurrency(packPrice)}</>
                                : 'Sold out at this size'}
                        </p>
                    </button>
                </div>
            </div>

            {indulgent && (
                <div className="space-y-5">
                    {barks.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-primary-text dark:text-primary-text-light mb-2">
                                Chocolate bark
                            </p>
                            <OptionRow
                                label="Chocolate bark"
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
                                label="Hot chocolate"
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
                                label="Gift card"
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
                                    placeholder="Add a message (optional)…"
                                    aria-label="Gift message"
                                    rows={2}
                                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary-2"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}

            {!surpriseOnly && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-text dark:text-primary-text-light">
                            Your flavours
                        </h3>
                        <button
                            type="button"
                            onClick={resetToOurPicks}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary dark:text-primary-2 hover:underline"
                        >
                            <FiRefreshCw size={12} /> Reset to our picks
                        </button>
                    </div>
                    <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70 mb-3">
                        {isSurprise
                            ? "No flavours chosen — we'll surprise you with our best picks."
                            : remainingChocolates > 0
                            ? `Add ${remainingChocolates} more to fill the box, or clear all and let us surprise you.`
                            : 'Box full and ready to go. Swap anything you like.'}
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
                        selectedAllergens={selectedAllergens}
                        availableFlavours={flavoursData}
                    />
                </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-end justify-between mb-4">
                    <span className="text-primary-text dark:text-primary-text-light">Total</span>
                    <span className="text-3xl font-bold text-primary-text dark:text-primary-text-light">
                        {formatCurrency(displayPrice)}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-autumn dark:bg-primary-2 text-primary-text-light font-semibold py-4 text-lg shadow hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-wait"
                >
                    {adding ? 'Adding…' : (<><FiShoppingCart /> Add to cart</>)}
                </button>
                {/* The button stays clickable and says what is missing, rather
                    than greying out and explaining nothing. */}
                {!canAddToCart && !adding && (
                    <p className="text-xs text-center text-primary-text/70 dark:text-primary-text-light/70 mt-2">
                        {allergenOption === null
                            ? 'Answer the allergen question to continue.'
                            : 'Fill the box or clear all flavours to continue.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default QuickBoxBuilder;
