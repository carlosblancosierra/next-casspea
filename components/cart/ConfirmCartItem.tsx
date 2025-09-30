import React from 'react';
import { CartItem as CartItemType } from '@/types/carts';

interface ConfirmCartItemProps {
    entry: CartItemType;
}

const ConfirmCartItem: React.FC<ConfirmCartItemProps> = ({ entry }) => {
    const boxSize = entry.product.units_per_box;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-gray-200 bg-main-bg p-4 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
            {/* Product Image */}
            <a href="#" className="col-span-1">
                <img
                    className="w-full dark:hidden"
                    src={entry.product.image || 'https://via.placeholder.com/150'}
                    alt={entry.product.name}
                />
                <img
                    className="w-full hidden dark:block"
                    src={entry.product.image || 'https://via.placeholder.com/150'}
                    alt={entry.product.name}
                />
            </a>

            {/* Product Info */}
            <div className="col-span-1 space-y-2">
                <p className="text-md font-medium text-gray-900 hover:underline dark:text-white">
                    {entry.product.name}
                </p>

                <p className="text-base font-bold text-gray-900 dark:text-white">
                    £{entry.product.current_price}
                </p>

                {/* Quantity */}
                <div className="flex items-center space-x-2 !mt-4">
                    <span className="px-2 py-1 min-w-[40px] text-center font-medium text-gray-900 dark:text-white">
                        Quantity: {entry.quantity}
                    </span>
                </div>

                {/* Remove Button (Optional) */}
                {/* You can include a remove button here if needed */}
            </div>
        </div>
    );
};

export default ConfirmCartItem;
