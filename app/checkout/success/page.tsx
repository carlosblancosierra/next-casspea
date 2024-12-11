'use client';

import React from 'react';
import Link from 'next/link';

const ConfirmPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-3xl font-bold text-green-600">Order Placed Successfully!</h1>
                <div className="mt-4 space-y-3">
                    <p className="text-gray-700 dark:text-gray-300">
                        Thank you for your purchase. You will receive:
                    </p>
                    <ul className="text-gray-600 dark:text-gray-400 text-sm">
                        <li>• An order confirmation email shortly</li>
                        <li>• A shipping notification with tracking information when your order ships</li>
                    </ul>
                </div>
                <Link href="/shop" className="mt-8 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default ConfirmPage;
