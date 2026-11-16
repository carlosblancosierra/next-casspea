'use client';

import React from 'react';
import Link from 'next/link';
import { buttonClasses } from '@/components/common/Button';

const ErrorPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-main-bg-dark">
            <div className="main-bg dark:bg-main-bg-dark p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-primary-text dark:text-primary-text-light">Order Failed</h1>
                <p className="mt-4 text-primary-text dark:text-primary-text-light">
                    Unfortunately, your order could not be processed at this time.
                </p>
                <p className="mt-2 text-primary-text dark:text-primary-text-light">
                    Please try again or contact our support team for assistance.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/checkout/address" className={buttonClasses()}>
                        Retry Order
                    </Link>
                    <Link href="/cart" className={buttonClasses({ variant: 'secondary' })}>
                        Return to Cart
                    </Link>
                    <Link href="/contact" className={buttonClasses({ variant: 'tertiary' })}>
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
