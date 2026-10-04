// components/ProductInfo.tsx

import React from 'react';
import { Product as ProductType } from '@/types/products';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import PreorderCountdown from './PreorderCountdown';
import TrustpilotRating from '@/components/common/TrustpilotRating';
import { formatCurrency } from '@/utils/currency';
import { pricePerPiece } from '@/components/packs/value';

interface ProductInfoProps {
    product: ProductType;
    /** Show "£x per bonbon" — signature boxes only. */
    showPerPiece?: boolean;
}

/**
 * Name, proof, price, promise — in the order a buyer checks them, directly
 * above the builder so the decision is made in one column. The rating sits
 * under the name and scrolls to this page's reviews rather than leaving for
 * Trustpilot, the same as on the home page hero.
 */
const ProductInfo: React.FC<ProductInfoProps> = ({ product, showPerPiece = false }) => {
    const { discountedPrice, discount_percentage } = useProductDiscountedPrice(product.id, product);
    const perPiece = showPerPiece ? pricePerPiece(product) : null;

    return (
        <div id="product-info" className="flex flex-col gap-y-3">
            {product.preorder && product.preorder_finish_date && (
                <PreorderCountdown preorderFinishDate={product.preorder_finish_date} />
            )}
            <h1 className="text-3xl md:text-4xl font-bold font-playfair leading-tight text-primary-text dark:text-primary-text-light">
                {product.seo_title || product.name}
            </h1>
            <TrustpilotRating href="#reviews" className="!justify-start" />
            <div className="space-y-1">
                {product.is_preorder_active && (
                    <p className="text-sm text-primary-text dark:text-primary-text-light">
                        <span className="font-medium">Regular price:</span> {formatCurrency(product.base_price)}
                    </p>
                )}
                {discountedPrice ? (
                    <p className="flex items-center gap-2 text-2xl font-semibold text-primary-text dark:text-primary-text-light">
                        {formatCurrency(discountedPrice)}
                        <span className="text-base font-normal line-through opacity-60">{formatCurrency(product.current_price)}</span>
                        <span className="rounded bg-accent px-2 py-0.5 text-sm text-accent-text">{discount_percentage}% off</span>
                    </p>
                ) : (
                    <p className="text-2xl font-semibold text-primary-text dark:text-primary-text-light">
                        {formatCurrency(product.current_price)}
                    </p>
                )}
                {perPiece && (
                    <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
                        {formatCurrency(perPiece)} per bonbon · {product.units_per_box} hand-painted pieces
                    </p>
                )}
            </div>
            {product.description && (
                <p className="text-sm leading-relaxed text-primary-text/90 dark:text-primary-text-light/90">
                    {product.description}
                </p>
            )}
        </div>
    );
};

export default ProductInfo;
