import React from 'react';
import { getDayTotals } from './ordersUtils';
import { Order } from '@/types/orders';

interface DaySummaryProps {
    dateOrders: Order[];
}

const DaySummary: React.FC<DaySummaryProps> = ({ dateOrders }) => {
    const { products, flavors, randomBoxes } = getDayTotals(dateOrders);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-4">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Day Summary</h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                    {/* Products Column */}
                    <div className="p-4">
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Products</h4>
                        <div className="space-y-1">
                            {Object.entries(products).map(([name, qty]) => (
                                <div key={name} className="text-sm text-gray-900 dark:text-gray-100">
                                    {name}: {qty}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Pick & Mix Column */}
                    <div className="p-4">
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Pick & Mix Flavors</h4>
                        <div className="space-y-1">
                            {Object.entries(flavors).length > 0 ?
                                Object.entries(flavors).map(([name, qty]) => (
                                    <div key={name} className="text-sm text-gray-900 dark:text-gray-100">
                                        {name}: {qty}
                                    </div>
                                )) :
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                    No Pick & Mix Flavors
                                </div>
                            }
                        </div>
                    </div>
                    {/* Random Boxes Column */}
                    <div className="p-4">
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Other Flavors</h4>
                        <div className="space-y-1">
                            {Object.entries(randomBoxes).length > 0 ?
                                Object.entries(randomBoxes).map(([key, qty]) => (
                                    <div key={key} className="text-sm text-gray-900 dark:text-gray-100">
                                        {key === 'Random' ? `Random: ${qty}` : `${key}: ${qty}`}
                                    </div>
                                )) :
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                    No Random Boxes
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DaySummary; 