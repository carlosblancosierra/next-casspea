// components/ProductInfo.tsx

import React from 'react';
import { ProductType } from '@/types/products';
import { StarIcon,  } from '@heroicons/react/20/solid';

interface ProductInfoProps {
  product: ProductType;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    return (
        <div className="md:py-8">
            <div id="product-info">
                <div className="flex flex-col gap-y-2 md:gap-y-4 lg:max-w-[500px] mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        {product.name}
                    </h2>
                     <p className="text-xl">
                        ￡{product.price} GBP
                    </p>
                    {/* Reviews */}
                    <div className="">
                        <h3 className="sr-only">Reviews</h3>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400'/>
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400'/>
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400'/>
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400'/>
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-gray-200'/>
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
