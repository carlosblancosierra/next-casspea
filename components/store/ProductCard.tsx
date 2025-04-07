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
    // Use the alternate image if available and requested
    const displayImage = useAlternateImage && product.gallery_images && product.gallery_images.length > 0 
        ? product.gallery_images[0].image 
        : product.image;

    return (
        <Link
            href={`/shop-now/${product.slug}`}
            className="block group relative shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-gray-800 hover:opacity-90 transition-opacity"
        >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 lg:aspect-none group-hover:opacity-75 lg:h-80">
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
            {discountedPrice ? (
                <p className="text-md font-medium text-gray-900 dark:text-white mt-4">
                    ￡ {discountedPrice}
                    <span className="ml-1 text-xs line-through text-gray-500">￡ {product.base_price}</span>
                </p>
            ) : (
                <p className="text-md font-medium text-gray-900 dark:text-white mt-4">￡ {product.base_price}</p>
            )}
            <div className="flex justify-between mt-1">
                <div>
                    <h3 className="text-xs md:text-sm text-gray-700 dark:text-gray-300 h-12">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.weight} g</p>
                </div>
            </div>
        </Link>
    );
}
