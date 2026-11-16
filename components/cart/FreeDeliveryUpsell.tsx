'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAddCartItemMutation, useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { formatCurrency } from '@/utils/currency';
import { track } from '@/utils/analytics';
import type { CartItem } from '@/types/carts';

/** Royal Mail Regular 48 is free over this (see the shipping option's description). */
export const FREE_DELIVERY_THRESHOLD = 56;
/** The smallest signature box: £37.50 (box of 15) + £23 clears the threshold. */
export const UPSELL_SLUG = '9-bonbons';

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Reuse what the shopper already told us they can't eat, so the extra box is safe for the same person. */
function cartAllergens(items: CartItem[]): number[] {
    const ids = new Set<number>();
    items.forEach(item =>
        item.box_customization?.allergens?.forEach(allergen => ids.add(allergen.id)),
    );
    return Array.from(ids).sort((a, b) => a - b);
}

/**
 * Shows how far the cart is from free delivery and, when it isn't there yet,
 * offers the box of 9 in one tap as a chef's surprise selection. Tracked as
 * upsell_shown / upsell_added; the add itself is tracked as add_to_cart by
 * redux/analyticsMiddleware like every other add.
 */
const FreeDeliveryUpsell: React.FC = () => {
    const { data: cart } = useGetCartQuery();
    const { data: products } = useGetProductsQuery();
    const [addCartItem, { isLoading }] = useAddCartItemMutation();
    const [added, setAdded] = useState(false);
    const shownFor = useRef<string | null>(null);

    const items = cart?.items ?? [];
    const total = round2(Number(cart?.discounted_total ?? 0));
    const remaining = round2(Math.max(0, FREE_DELIVERY_THRESHOLD - total));
    const qualifies = items.length > 0 && remaining === 0;
    const offer = products?.find(p => p.slug === UPSELL_SLUG && !p.sold_out);
    const showOffer = items.length > 0 && !qualifies && !!offer && !added;

    useEffect(() => {
        if (!showOffer || !offer) return;
        // Once per cart total, not on every refetch.
        const key = `${offer.id}:${total}`;
        if (shownFor.current === key) return;
        shownFor.current = key;
        track('upsell_shown', { product_id: offer.id, remaining, cart_total: total });
    }, [showOffer, offer, remaining, total]);

    if (!items.length) return null;

    if (qualifies) {
        return (
            <p
                role="status"
                className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200"
            >
                You&apos;ve unlocked free UK delivery.
            </p>
        );
    }

    const percent = Math.round((total / FREE_DELIVERY_THRESHOLD) * 100);
    const price = offer?.current_price ?? offer?.base_price;

    const handleAdd = async () => {
        if (!offer) return;
        try {
            await addCartItem({
                product: offer.id,
                quantity: 1,
                box_customization: { selection_type: 'RANDOM', allergens: cartAllergens(items) },
            }).unwrap();
            setAdded(true);
            track('upsell_added', { product_id: offer.id, remaining });
            toast.success(`${offer.name} added to your cart`);
        } catch {
            toast.error('Could not add the box. Please try again.');
        }
    };

    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-main-bg p-4 shadow-sm dark:border-gray-700 dark:bg-main-bg-dark">
            <p className="text-sm font-medium text-primary-text dark:text-primary-text-light">
                You&apos;re {formatCurrency(remaining)} away from free UK delivery.
            </p>
            <div
                role="progressbar"
                aria-label="Progress towards free delivery"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
            >
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>
            {showOffer && offer && (
                <div className="mt-4 flex flex-col gap-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        A box of 9 is our smallest gift: perfect as a stocking filler, and it gets you there.
                    </p>
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isLoading}
                        className="min-h-[44px] w-full rounded-lg border-2 border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-text-light disabled:opacity-60 dark:border-primary-light dark:text-primary-text-light"
                    >
                        {isLoading ? 'Adding…' : `Add a Surprise Box of 9 · ${formatCurrency(price)}`}
                    </button>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Chef&apos;s selection, keeping to any allergens you chose for your other boxes.
                    </p>
                </div>
            )}
        </div>
    );
};

export default FreeDeliveryUpsell;
