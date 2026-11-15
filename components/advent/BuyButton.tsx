'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { ADVENT_SLUG } from './content';

/**
 * The page's money button. Adds the calendar to the cart with the same
 * mutation as the product page and goes to /cart, where checkout carries on as
 * normal. add_to_cart is tracked by redux/analyticsMiddleware, like every
 * other add-to-cart button, so it is not tracked again here.
 *
 * Without a product id (the API did not answer when the page was built) it
 * falls back to a plain link to the product page, which can still sell it.
 */

interface Props {
    productId: number | null;
    productName: string;
    soldOut?: boolean;
    label: string;
    size?: 'md' | 'lg';
    className?: string;
}

const BASE =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gradient-autumn font-medium text-primary-button-text ' +
    'transition-opacity hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary-light disabled:cursor-not-allowed disabled:opacity-60';
const SIZES = {
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl leading-7',
};

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

export default function BuyButton({ productId, productName, soldOut, label, size = 'lg', className = '' }: Props) {
    const router = useRouter();
    const [addToCart, { isLoading }] = useAddCartItemMutation();
    const classes = `${BASE} ${SIZES[size]} ${className}`;

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

    const handleClick = async () => {
        try {
            await addToCart({ product: productId, quantity: 1 }).unwrap();
            toast.success(`${productName} added to cart!`);
            router.push('/cart');
        } catch {
            toast.error('Failed to add item to cart');
        }
    };

    return (
        <button type="button" onClick={handleClick} disabled={isLoading} className={classes}>
            {isLoading ? 'Adding to cart…' : label}
            {!isLoading && <Arrow />}
        </button>
    );
}
