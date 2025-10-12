// components/ProductInfo.tsx

import React from 'react';
import { Product as ProductType } from '@/types/products';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import PreorderCountdown from './PreorderCountdown';

interface ProductInfoProps {
    product: ProductType;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const { discountedPrice, discount_percentage } = useProductDiscountedPrice(product.id, product);

    return (
        <div className="md:pb-4">
            <div id="product-info">
                <div className="flex flex-col gap-y-2 md:gap-y-4 lg:max-w-[500px] mx-auto">
                    {product.preorder && product.preorder_finish_date && (
                        <PreorderCountdown preorderFinishDate={product.preorder_finish_date} />
                    )}
                    <h2 className="text-2xl md:text-3xl font-extrabold font-playfair">
                        {product.seo_title}
                    </h2>
                    <div className="space-y-1">
                        {product.is_preorder_active && (
                            <p className="text-sm text-gray-900 dark:text-gray-100 ">
                                <span className="font-medium">Regular price:</span> £{product.base_price} GBP
                            </p>
                        )}
                        {discountedPrice ? (
                            <p className="text-xl text-gray-900 font-semibold">
                                <span className="text-gray-900 dark:text-gray-100">£{discountedPrice} GBP</span>
                                <span className="ml-1 text-white bg-[#CC0C38] p-1 text-sm rounded -mt-2">{discount_percentage}% off</span>
                            </p>
                        ) : (
                            <p className="text-xl text-gray-900 dark:text-gray-100">
                                £{product.current_price} GBP
                            </p>
                        )}
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
