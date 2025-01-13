import React from 'react';
import { CartItem as CartItemType } from '@/types/carts';

interface ReadOnlyCartItemProps {
    entry: CartItemType;
}

const ReadOnlyCartItem: React.FC<ReadOnlyCartItemProps> = ({ entry }) => {
    const renderFlavorSelections = () => {
        if (entry.box_customization?.selection_type === 'PICK_AND_MIX' &&
            entry.box_customization.flavor_selections?.length > 0) {
            return (
                <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {entry.box_customization.flavor_selections.map((selection) => (
                        <div key={selection.flavor.id}>
                            {selection.quantity}x {selection.flavor.name}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-[1fr,3fr] gap-4 border border-gray-200 bg-white p-4 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
            {/* Product Image */}
            <div className="col-span-1">
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
            </div>

            {/* Product Info */}
            <div className="col-span-1 space-y-2">
                <p className="text-md !leading-5 font-medium text-gray-900 dark:text-white">
                    {entry.quantity} x {entry.product.name}
                </p>

                <p className="text-base font-bold text-gray-900 dark:text-white">
                    £{(parseFloat(entry.discounted_price || entry.base_price) * entry.quantity).toFixed(2)}
                </p>

                <p className="flex flex-wrap items-center gap-2">
                    <span className="items-center rounded-md  px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {entry.box_customization?.selection_type === 'PICK_AND_MIX' && 'Pick & Mix'}
                        {entry.box_customization?.selection_type === 'RANDOM' && 'Surprise Me'}
                    </span>

                    {entry.box_customization?.allergens?.map((allergen) => (
                        <span
                            key={allergen.id}
                            className="items-center rounded-md  px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                        >
                            {allergen.name} Free
                        </span>
                    ))}
                </p>

                {/* Flavor Selections */}
                {renderFlavorSelections()}
            </div>
        </div>
    );
};

export default ReadOnlyCartItem;
