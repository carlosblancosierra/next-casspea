'use client';

import { useState } from 'react';
import { Product as ProductType } from '@/types/products';
import BoxBuilderFlow from './BoxBuilderFlow';

interface Props {
    product: ProductType;
}

export default function ProductFormBoxes({ product }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const maxChocolates = product.units_per_box || 0;

    return (
        <>
            <div className="space-y-4 p-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">From</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        £{parseFloat(product.price || '0').toFixed(2)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-full py-4 px-6 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
                >
                    Build Your Box
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Customise your {maxChocolates}-piece box in a few easy steps
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                        { icon: '🎨', label: 'Pick your own flavours' },
                        { icon: '✨', label: 'Or let us surprise you' },
                        { icon: '🎁', label: 'Upgrade to a gift pack' },
                        { icon: '🚚', label: 'Next-day delivery available' },
                    ].map(f => (
                        <div key={f.label} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{f.icon}</span>
                            <span>{f.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {isOpen && <BoxBuilderFlow product={product} onClose={() => setIsOpen(false)} />}
        </>
    );
}
