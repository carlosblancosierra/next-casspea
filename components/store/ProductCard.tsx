import React from 'react';
import { Product as ProductType } from '@/types/products';
import Link from 'next/link';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import Image from 'next/image';

interface ProductCardProps {
    product: ProductType;
    useAlternateImage?: boolean;
}

export default function ProductCard({ product, useAlternateImage = false }: ProductCardProps) {
    const { discountedPrice, discount_percentage } = useProductDiscountedPrice(product.id, product);
    const displayImage = useAlternateImage && product.gallery_images && product.gallery_images.length > 0
        ? product.gallery_images[0].image
        : product.image;

    return (
        <Link
            href={`/shop-now/${product.slug}`}
            className="block group relative shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark hover:opacity-90 transition-opacity"
        >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800 group-hover:opacity-75">
                {displayImage && (
                    <Image
                        alt={product.name}
                        src={displayImage}
                        width={0}
                        height={0}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="h-full w-full object-cover object-center"
                    />
                )}
            </div>

            {/* Price */}
            {discountedPrice ? (
                <p className="text-md font-medium text-primary-text dark:text-primary-text-light mt-3">
                    £{discountedPrice}
                    <span className="ml-1 text-xs line-through text-gray-400">£{product.current_price}</span>
                    <span className="ml-1 text-xs text-green-600 dark:text-green-400 font-semibold">{discount_percentage}% off</span>
                </p>
            ) : (
                <p className="text-md font-medium text-primary-text dark:text-primary-text-light mt-3">
                    £{product.current_price}
                </p>
            )}

            {/* Name & meta */}
            <div className="mt-1">
                <h3 className="text-xs md:text-sm text-primary-text dark:text-primary-text-light line-clamp-2 leading-snug min-h-[2.5rem]">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {product.units_per_box ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.units_per_box} pieces
                        </span>
                    ) : product.weight ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.weight}g
                        </span>
                    ) : null}
                    {product.sold_out && (
                        <span className="text-xs text-red-500 font-medium">Sold out</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
