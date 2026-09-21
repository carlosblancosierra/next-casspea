import React from 'react';
import { BadgeColor, Product as ProductType } from '@/types/products';
import Link from 'next/link';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import Image from 'next/image';

// The backend stores a colour key, not a hex, because Tailwind compiles class
// names at build time — a hex could only be applied as an inline style, and a
// free colour picker is how a badge ends up unreadable. Every one of these
// clears 4.5:1 against white text.
const BADGE_CLASSES: Record<BadgeColor, string> = {
    slate: 'bg-slate-700',
    green: 'bg-green-700',
    amber: 'bg-amber-700',
    rose: 'bg-rose-700',
    violet: 'bg-violet-700',
};

interface ProductCardProps {
    product: ProductType;
    useAlternateImage?: boolean;
    /**
     * Render the featured, double-width card. Uses the product's wide image,
     * which is a separate upload rather than a CSS crop: at double width a
     * square image would also be double height, and this card has to stay
     * level with the ordinary cards beside it.
     */
    wide?: boolean;
}

export default function ProductCard({ product, useAlternateImage = false, wide = false }: ProductCardProps) {
    const { discountedPrice, discount_percentage } = useProductDiscountedPrice(product.id, product);
    // Use the alternate image if available and requested
    const displayImage = useAlternateImage && product.gallery_images && product.gallery_images.length > 0
        ? product.gallery_images[0].image
        : product.image;

    // Only honour `wide` when there is an image shaped for it; without one the
    // card would just be a stretched square, twice as tall as its neighbours.
    const isWide = wide && !!product.wide_image;

    const badge = product.badge_active && product.badge_text ? product.badge_text : null;
    const badgeClass = BADGE_CLASSES[product.badge_color ?? 'slate'] ?? BADGE_CLASSES.slate;

    const isSummerBreakBox = product.category?.slug === 'summer-break-boxes';
    // "Was" price comes straight from the product data (compare_at_price), not hardcoded.
    const summerOriginal = isSummerBreakBox && product.compare_at_price
        ? product.compare_at_price
        : undefined;

    const isSoldOut = !!product.sold_out;

    return (
        <Link
            href={`/shop-now/${product.slug}`}
            aria-label={isSoldOut ? `${product.name} — sold out` : product.name}
            className="block group relative shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark hover:opacity-90 transition-opacity"
        >
            {isSummerBreakBox && !isSoldOut && (
                <span className="absolute top-3 left-3 z-10 rounded-full bg-pink-600 px-2 py-0.5 text-xs font-bold text-white shadow">
                    25% OFF
                </span>
            )}
            {isSoldOut && (
                <span className="absolute top-3 left-3 z-10 rounded-full bg-gray-800/90 px-2 py-0.5 text-xs font-bold text-white shadow">
                    Sold out
                </span>
            )}
            {/* Right-hand slot, so a sold-out best seller shows both. */}
            {badge && (
                <span className={`absolute top-3 right-3 z-10 rounded-full px-2 py-0.5 text-xs font-bold text-white shadow ${badgeClass}`}>
                    {badge}
                </span>
            )}
            {/* The featured card is only wide on phones, where it spans both
                columns; from `sm:` up the grid is 3-4 across and it goes back
                to being an ordinary square card with the ordinary image. Two
                containers rather than one, because the two states need
                different artwork as well as a different shape. */}
            {isWide && (
                <div className="sm:hidden aspect-[2/1] w-full overflow-hidden rounded-md bg-gray-200 dark:bg-main-bg-dark group-hover:opacity-75">
                    <Image
                        alt={product.name}
                        src={product.wide_image || '/images/default-product.png'}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className={`h-full w-full object-cover object-center ${isSoldOut ? 'opacity-40 grayscale' : ''}`}
                    />
                </div>
            )}
            <div className={`aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-main-bg-dark group-hover:opacity-75 ${isWide ? 'hidden sm:block' : ''}`}>
                {displayImage && (
                    <Image
                        alt={product.name}
                        src={displayImage || '/images/default-product.png'}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className={`h-full w-full object-cover object-center lg:h-full lg:w-full ${isSoldOut ? 'opacity-40 grayscale' : ''}`}
                    />
                )}
            </div>
            {summerOriginal ? (
                <p className="text-md font-medium text-primary-text dark:text-primary-text-light mt-4">
                    ￡ {product.current_price}
                    <span className="ml-1 text-xs line-through text-primary-text dark:text-primary-text-light">￡ {summerOriginal}</span>
                </p>
            ) : discountedPrice ? (
                <p className="text-md font-medium text-primary-text dark:text-primary-text-light mt-4">
                    ￡ {discountedPrice}
                    <span className="ml-1 text-xs line-through text-primary-text dark:text-primary-text-light">￡ {product.current_price}</span>
                </p>
            ) : (
                <p className="text-md font-medium text-primary-text dark:text-primary-text-light mt-4">￡ {product.current_price}</p>
            )}
            <div className="flex justify-between mt-1">
                <div>
                    <h3 className="text-xs md:text-sm text-primary-text dark:text-primary-text-light h-12">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-primary-text dark:text-primary-text-light">{product.weight} g</p>
                </div>
            </div>
        </Link>
    );
}
