import React from 'react';
import { Product as ProductType } from '@/types/products';
import Link from 'next/link';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import Image from 'next/image';

interface ProductCardProps {
    product: ProductType;
    useAlternateImage?: boolean;
}

// Original (pre-25%-off) prices for the Summer Break clearance boxes, keyed by
// number of chocolates, so the card can show the crossed-out "was" price.
const SUMMER_BREAK_ORIGINALS: Record<number, string> = {
    9: '14.99',
    15: '24.99',
    24: '39.99',
    48: '74.99',
};

export default function ProductCard({ product, useAlternateImage = false }: ProductCardProps) {
    const { discountedPrice, discount_percentage } = useProductDiscountedPrice(product.id, product);
    // Use the alternate image if available and requested
    const displayImage = useAlternateImage && product.gallery_images && product.gallery_images.length > 0
        ? product.gallery_images[0].image
        : product.image;

    const isSummerBreakBox = product.category?.slug === 'summer-break-boxes';
    const summerOriginal = isSummerBreakBox && product.units_per_box
        ? SUMMER_BREAK_ORIGINALS[product.units_per_box]
        : undefined;

    return (
        <Link
            href={`/shop-now/${product.slug}`}
            className="block group relative shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark hover:opacity-90 transition-opacity"
        >
            {isSummerBreakBox && (
                <span className="absolute top-3 left-3 z-10 rounded-full bg-pink-600 px-2 py-0.5 text-xs font-bold text-white shadow">
                    25% OFF
                </span>
            )}
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-main-bg-dark group-hover:opacity-75">
                {displayImage && (
                    <Image
                        alt={product.name}
                        src={displayImage || '/images/default-product.png'}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
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
