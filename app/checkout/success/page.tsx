'use client';

import React from 'react';
import Link from 'next/link';

const ConfirmPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-green-600">Order Successful!</h1>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
                <Link href="/shop" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default ConfirmPage;
