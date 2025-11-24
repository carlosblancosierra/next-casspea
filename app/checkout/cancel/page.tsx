'use client';

import React from 'react';
import Link from 'next/link';

const ErrorPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-main-bg-dark">
            <div className="main-bg dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-text-primary-text">Order Failed</h1>
                <p className="mt-4 text-text-primary-text">
                    Unfortunately, your order could not be processed at this time.
                </p>
                <p className="mt-2 text-text-primary-text">
                    Please try again or contact our support team for assistance.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                    <Link href="/checkout/address" className="inline-block bg-primary text-text-primary-text px-6 py-3 rounded-md hover:bg-primary">
                        Retry Order
                    </Link>
                    <Link href="/cart" className="inline-block bg-gray-600 text-text-primary-text px-6 py-3 rounded-md hover:bg-gray-700">
                        Return to Cart
                    </Link>
                    <Link href="/support" className="inline-block bg-gray-600 text-text-primary-text px-6 py-3 rounded-md hover:bg-gray-700">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
