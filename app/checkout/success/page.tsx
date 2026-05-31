'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CheckoutSuccessUnitsSold from '@/components/checkout/CheckoutSuccessUnitsSold';

const ConfirmPage: React.FC = () => {
    const params = useParams<{ session_id: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = params?.session_id || searchParams?.get('session_id');

    useEffect(() => {
        if (!sessionId) {
            router.replace('/cart');
            return;
        }
        if (typeof window !== 'undefined' && (window as any).gtag && typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', 'purchase', {
                transaction_id: sessionId,
            });
        }
    }, [sessionId, router]);

    if (!sessionId) return null;

    return (
        <section className="main-bg dark:bg-main-bg-dark">
            <div className="px-4 mx-auto lg:py-16 lg:px-6 gap-4">
                <div className="grid lg:grid-cols-2 gap-2 items-center">
                    {/* Image Section */}
                    <div>
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
                    <div className="flex flex-col md:ml-10 lg:text-left text-center gap-2 md:gap-6 justify-start h-full mt-4">
                        <CheckoutSuccessUnitsSold className="mb-4" />
                        <h2 className="text-3xl tracking-tight font-extrabold text-primary-text dark:text-primary-text-light sm:text-4xl">
                            Order Placed Successfully!
                        </h2>

                        <p className="font-light text-primary-text dark:text-primary-text-light sm:text-xl">
                            Thank you for your purchase. We're excited to prepare your order!
                        </p>

                        <div className="space-y-4">
                            <p className="font-medium text-primary-text dark:text-primary-text-light">
                                You will receive:
                            </p>
                            <ul className="space-y-2 text-primary-text dark:text-primary-text-light">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    An order confirmation email shortly
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    A shipping notification with tracking details
                                </li>
                            </ul>
                        </div>

                        <div className="mt-2">
                            <Link
                                href="/shop-now/"
                                className="inline-flex items-center justify-center py-3 px-5 text-base font-medium text-center text-primary-text dark:text-primary-text-light rounded-lg bg-primary hover:bg-primary focus:ring-4 focus:ring-primary-light dark:focus:ring-primary transition-colors"
                            >
                                Continue Shopping
                                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>

                        {/* Post-purchase engagement */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <a
                                href="https://uk.trustpilot.com/evaluate/www.casspea.co.uk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Image src="/home/stars-4.5.svg" alt="Trustpilot" width={64} height={16} />
                                <span className="text-sm font-medium text-primary-text dark:text-primary-text-light">
                                    Loved it? Leave us a review on Trustpilot →
                                </span>
                            </a>

                            <a
                                href="https://www.instagram.com/casspecachocolates/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-lg">📸</span>
                                <span className="text-sm text-primary-text dark:text-primary-text-light">
                                    Share your gift on Instagram{' '}
                                    <span className="font-medium">@CassPeaChocolates #CassPea</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConfirmPage;
