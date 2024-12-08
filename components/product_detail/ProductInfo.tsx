// components/ProductInfo.tsx

import React from 'react';
import { Product as ProductType } from '@/types/products';
import { StarIcon } from '@heroicons/react/20/solid';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';

interface ProductInfoProps {
    product: ProductType;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const { discountedPrice, discount_percentage } = useProductDiscountedPrice(product.id, product);

    return (
        <div className="md:py-8">
            <div id="product-info">
                <div className="flex flex-col gap-y-2 md:gap-y-4 lg:max-w-[500px] mx-auto">
                    <h2 className="text-2xl md:text-3xl font-extrabold font-playfair">
                        {product.seo_title}
                    </h2>
                    <div className="space-y-1">
                        {discountedPrice ? (
                            <>
                                <p className="text-xl text-gray-900 font-semibold">
                                    <span className="text-gray-900">￡{discountedPrice} GBP</span>
                                    <span className="ml-1 text-white bg-[#CC0C38] p-1 text-sm rounded -mt-2">{discount_percentage}% off</span>
                                </p>
                                <p className="text-sm text-gray-900 dark:text-gray-100 line-through">
                                    ￡{product.base_price} GBP
                                </p>
                            </>
                        ) : (
                            <p className="text-xl text-gray-900 dark:text-gray-100">
                                ￡{product.base_price} GBP
                            </p>
                        )}
                    </div>
                    {/* Reviews */}
                    <div className="">
                        <h3 className="sr-only">Reviews</h3>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <div className="relative inline-flex">
                                    <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400 [clip-path:inset(0_50%_0_0)]' />
                                    <StarIcon className='absolute inset-0 h-5 w-5 flex-shrink-0 text-gray-200 [clip-path:inset(0_0_0_48%)]' />
                                </div>
                            </div>
                            <p className="sr-only">4.1 out of 5 stars</p>
                            <a href="https://uk.trustpilot.com/review/www.casspea.co.uk" className="ml-3 text-xs font-medium">
                                13 reviews
                            </a>
                        </div>
                    </div>

                    <p className="font-normal text-sm">
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
