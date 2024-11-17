import React from 'react';
import { Product as ProductType } from '@/types/products';
import Link from 'next/link';

export default function ProductCard({ product }: { product: ProductType }) {
    return (
        <div
            key={product.name}
            className="group relative shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                    alt={product.name}
                    src={product.image}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
            </div>
            <p className="text-md font-medium text-gray-900 dark:text-white mt-4">￡ {product.base_price}</p>
            <div className="flex justify-between mt-1">
                <div>
                    <h3 className="text-xs md:text-sm text-gray-700 dark:text-gray-300 h-12">
                        <Link href={`/store/${product.slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>

                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.weight} g</p>
                </div>
            </div>
        </div>
    );
}
