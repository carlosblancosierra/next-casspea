'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ConfirmPage: React.FC = () => {
    return (
        <section className="main-bg dark:bg-gray-900">
            <div className="px-4 mx-auto lg:py-16 lg:px-6 gap-4">
                <div className="grid lg:grid-cols-2 gap-2 items-center">
                    {/* Image Section */}
                    <div className="">
                        <Image
                            src="/home/gallery/2.jpg"
                            alt="Order success"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="rounded-lg w-full h-full"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col md:ml-10 lg:text-left text-center gap-2 md:gap-10 justify-start h-full mt-4">
                        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            Order Placed Successfully!
                        </h2>

                        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
                            Thank you for your purchase. We're excited to prepare your order!
                        </p>

                        <div className="space-y-4">
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                                You will receive:
                            </p>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    An order confirmation email shortly
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    A shipping notification with tracking details
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8">
                            <Link
                                href="/shop-now/"
                                className="inline-flex items-center justify-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary focus:ring-4 focus:ring-primary-light dark:focus:ring-primary transition-colors"
                            >
                                Continue Shopping
                                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConfirmPage;
