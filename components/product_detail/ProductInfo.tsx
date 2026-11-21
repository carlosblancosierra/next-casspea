// components/ProductInfo.tsx

import React from 'react';
import { Product as ProductType } from '@/types/products';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import PreorderCountdown from './PreorderCountdown';
import ChristmasDeliveryCountdown from '@/components/common/ChristmasDeliveryCountdown';

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
                    {product.slug === 'advent-calendar' && <ChristmasDeliveryCountdown />}
                    <h2 className="text-2xl md:text-3xl font-extrabold font-playfair text-primary-text dark:text-primary-text-light">
                        {product.seo_title}
                    </h2>
                    <div className="space-y-1">
                        {product.is_preorder_active && (
                            <p className="text-sm text-primary-text dark:text-primary-text-light">
                                <span className="font-medium">Regular price:</span> £{product.base_price} GBP
                            </p>
                        )}
                        {discountedPrice ? (
                            // Same as the shop cards: the price they pay, then the real price struck through.
                            <p className="flex flex-wrap items-baseline gap-x-2 text-xl text-primary-text dark:text-primary-text-light">
                                <span className="font-semibold">
                                    <span className="sr-only">Now </span>£{discountedPrice} GBP
                                </span>
                                <s className="text-base text-gray-500 dark:text-gray-400">
                                    <span className="sr-only">Was </span>£{product.current_price}
                                </s>
                                <span className="self-center rounded bg-primary px-1.5 py-0.5 text-sm font-medium text-primary-text-light">{discount_percentage}% off</span>
                            </p>
                        ) : (
                            <p className="text-xl text-primary-text dark:text-primary-text-light">
                                £{product.current_price} GBP
                            </p>
                        )}
                    </div>
                    <p className="font-normal text-sm text-primary-text dark:text-primary-text-light">
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
