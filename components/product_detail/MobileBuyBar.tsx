'use client';

import React, { useEffect, useState } from 'react';
import { track } from '@/utils/analytics';
import { buttonClasses } from '@/components/common/Button';

/** CSS variable the WhatsApp button adds to its bottom offset, so the bar never covers it. */
export const BUY_BAR_HEIGHT_VAR = '--buy-bar-height';
const BAR_HEIGHT = '76px';

interface MobileBuyBarProps {
    /** The product's form (box builder or general form). The bar shows while it is off screen. */
    targetRef: React.RefObject<HTMLElement>;
    productId: number;
    name: string;
    price?: string;
    /** The price after the basket's discount code, when there is one. */
    discountedPrice?: string | null;
    /** Boxes are built in several steps, so the bar can't add to the bag itself. */
    isBox: boolean;
    soldOut: boolean;
}

/**
 * Phones are 89% of traffic and convert a third as well as desktop: on a
 * phone the form and its button scroll away under the gallery and the
 * accordion. This bar keeps the next step one tap away. It never adds to the
 * bag on its own, because boxes need flavours and allergens first; it takes
 * the shopper back to the form, where the one real Add to Cart lives.
 */
const MobileBuyBar: React.FC<MobileBuyBarProps> = ({ targetRef, productId, name, price, discountedPrice, isBox, soldOut }) => {
    const [formOffScreen, setFormOffScreen] = useState(false);

    useEffect(() => {
        const target = targetRef.current;
        if (!target || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(([entry]) => setFormOffScreen(!entry.isIntersecting), {
            // Count the form as gone once less than a sliver of it is left.
            threshold: 0.05,
        });
        observer.observe(target);
        return () => observer.disconnect();
    }, [targetRef]);

    useEffect(() => {
        const root = document.documentElement.style;
        if (formOffScreen) root.setProperty(BUY_BAR_HEIGHT_VAR, BAR_HEIGHT);
        else root.removeProperty(BUY_BAR_HEIGHT_VAR);
        return () => {
            root.removeProperty(BUY_BAR_HEIGHT_VAR);
        };
    }, [formOffScreen]);

    if (!formOffScreen) return null;

    const label = soldOut ? 'Sold out' : isBox ? 'Build your box' : 'Order now';

    const goToForm = () => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        track('mobile_buy_bar_click', { product_id: productId, kind: isBox ? 'box' : 'general' });
    };

    return (
        <section
            aria-label="Buy this product"
            className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark shadow-lg px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-primary-text dark:text-primary-text-light">{name}</p>
                    {price && (discountedPrice ? (
                        <p className="text-sm text-primary-text dark:text-primary-text-light">
                            <span className="font-semibold"><span className="sr-only">Now </span>£{Number(discountedPrice).toFixed(2)}</span>
                            <s className="ml-1.5 text-xs text-gray-500 dark:text-gray-400"><span className="sr-only">Was </span>£{Number(price).toFixed(2)}</s>
                        </p>
                    ) : (
                        <p className="text-sm text-primary-text dark:text-primary-text-light">£{Number(price).toFixed(2)}</p>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={goToForm}
                    disabled={soldOut}
                    className={buttonClasses({ size: 'sm', className: 'min-h-[44px] shrink-0 !px-5' })}
                >
                    {label}
                </button>
            </div>
        </section>
    );
};

export default MobileBuyBar;
