'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import AllergenSelection from '@/components/product_detail/AllergenSelection';
import { PICKABLE_ALLERGENS } from '@/components/product_detail/allergenOptions';
import { buttonClasses } from '@/components/common/Button';
import { ADVENT_SLUG, COPY } from './content';

/**
 * The page's money button. Adds the calendar to the cart with the same
 * mutation as the product page and goes to /cart, where checkout carries on as
 * normal. add_to_cart is tracked by redux/analyticsMiddleware, like every
 * other add-to-cart button, so it is not tracked again here.
 *
 * When the product lets customers pick allergens (as the product page does),
 * the button first asks for them in a dialog and sends them with the item.
 *
 * Without a product id (the API did not answer when the page was built) it
 * falls back to a plain link to the product page, which can still sell it.
 */

interface Props {
    productId: number | null;
    productName: string;
    soldOut?: boolean;
    canPickAllergens?: boolean;
    label: string;
    size?: 'md' | 'lg';
    className?: string;
}


function Arrow() {
    return (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function BuyButton({ productId, productName, soldOut, canPickAllergens, label, size = 'lg', className = '' }: Props) {
    const router = useRouter();
    const [addToCart, { isLoading }] = useAddCartItemMutation();
    const [askAllergens, setAskAllergens] = useState(false);
    const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>(null);
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const classes = buttonClasses({ size, className });

    if (productId === null) {
        return (
            <Link href={`/shop-now/${ADVENT_SLUG}`} className={classes}>
                {label} <Arrow />
            </Link>
        );
    }

    if (soldOut) {
        return (
            <button type="button" disabled className={classes}>
                Sold out
            </button>
        );
    }

    const add = async () => {
        try {
            await addToCart({
                product: productId,
                quantity: 1,
                ...(canPickAllergens
                    ? { box_customization: { allergens: allergenOption === 'SPECIFY' ? selectedAllergens : [] } }
                    : {}),
            }).unwrap();
            toast.success(`${productName} added to cart!`);
            router.push('/cart');
        } catch {
            toast.error('Failed to add item to cart');
        }
    };

    const handleClick = () => (canPickAllergens ? setAskAllergens(true) : add());
    const allergensChosen = allergenOption === 'NONE' || (allergenOption === 'SPECIFY' && selectedAllergens.length > 0);

    return (
        <>
            <button type="button" onClick={handleClick} disabled={isLoading} className={classes}>
                {isLoading ? 'Adding to cart…' : label}
                {!isLoading && <Arrow />}
            </button>
            {canPickAllergens && (
                <Dialog open={askAllergens} onClose={() => setAskAllergens(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-main-bg p-6 shadow-xl dark:bg-main-bg-dark">
                            <DialogTitle className="m-0 font-playfair text-2xl font-bold text-primary-text dark:text-primary-text-light">
                                {COPY.hero.allergenHeading}
                            </DialogTitle>
                            <AllergenSelection
                                allergens={PICKABLE_ALLERGENS}
                                selectedAllergens={selectedAllergens}
                                setSelectedAllergens={setSelectedAllergens}
                                allergenOption={allergenOption}
                                setAllergenOption={setAllergenOption}
                            />
                            <button
                                type="button"
                                onClick={add}
                                disabled={!allergensChosen || isLoading}
                                className={buttonClasses({ size: 'md', fullWidth: true })}
                            >
                                {isLoading ? 'Adding to cart…' : COPY.hero.allergenConfirm}
                            </button>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </>
    );
}
