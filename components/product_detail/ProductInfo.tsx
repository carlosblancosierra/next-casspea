// components/ProductInfo.tsx

import React, { useState, useEffect } from 'react';
import { Product as ProductType } from '@/types/products';
import { StarIcon } from '@heroicons/react/20/solid';
import { useProductDiscountedPrice } from '@/utils/useProductDiscountedPrice';
import Image from 'next/image';

interface ProductInfoProps {
    product: ProductType;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const { discountedPrice, discount_percentage } = useProductDiscountedPrice(product.id, product);
    const preorderFinishDate = product.preorder_finish_date 
        ? new Date(product.preorder_finish_date) 
        : new Date();
    const preorderFinishDateFormatted = preorderFinishDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long'
    });

    // Function to calculate remaining time until the finish date
    const calculateTimeLeft = () => {
        const difference = preorderFinishDate.getTime() - new Date().getTime();
        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [preorderFinishDate]);

    return (
        <div className="md:py-8">
            <div id="product-info">
                <div className="flex flex-col gap-y-2 md:gap-y-4 lg:max-w-[500px] mx-auto">
                    {product.preorder && (
                        <div className="w-fit rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-pink-500/10 bg-pink-500 text-white border border-pink-500">
                            {/* Preorder tag with finish date */}
                            <span >
                                Preorder ends on {preorderFinishDateFormatted}
                            </span>
                            {/* Countdown */}
                            <div className="flex gap-5">
                                <div>
                                    <span className="countdown font-mono text-sm mr-1">
                                        <span style={{ "--value": timeLeft.days } as React.CSSProperties} aria-live="polite" aria-label={`${timeLeft.days} days`}>
                                            {timeLeft.days}
                                        </span>
                                    </span>
                                    days
                                </div>
                                <div>
                                    <span className="countdown font-mono text-sm mr-1">
                                        <span style={{ "--value": timeLeft.hours } as React.CSSProperties} aria-live="polite" aria-label={`${timeLeft.hours} hours`}>
                                            {timeLeft.hours}
                                        </span>
                                    </span>
                                    hours
                                </div>
                                <div>
                                    <span className="countdown font-mono text-sm mr-1">
                                        <span style={{ "--value": timeLeft.minutes } as React.CSSProperties} aria-live="polite" aria-label={`${timeLeft.minutes} min`}>
                                            {timeLeft.minutes}
                                        </span>
                                    </span>
                                    min
                                </div>
                                <div>
                                    <span className="countdown font-mono text-sm mr-1">
                                        <span style={{ "--value": timeLeft.seconds } as React.CSSProperties} aria-live="polite" aria-label={`${timeLeft.seconds} sec`}>
                                            {timeLeft.seconds}
                                        </span>
                                    </span>
                                    sec
                                </div>
                            </div>
                        </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-extrabold font-playfair">
                        {product.seo_title}
                    </h2>
                    <div className="space-y-1">
                        {discountedPrice ? (
                            <>
                                <p className="text-xl text-gray-900 font-semibold">
                                    <span className="text-gray-900 dark:text-gray-100">￡{discountedPrice} GBP</span>
                                    <span className="ml-1 text-white bg-[#CC0C38] p-1 text-sm rounded -mt-2">{discount_percentage}% off</span>
                                </p>
                                <p className="text-sm text-gray-900 dark:text-gray-100 line-through">
                                    ￡{product.base_price} GBP
                                </p>
                            </>
                        ) : (
                            <p className="text-xl text-gray-900 dark:text-gray-100">
                                ￡{product.base_price} GBP
                            </p>
                        )}
                    </div>
                    {/* Reviews */}
                    <div className="">
                        <h3 className="sr-only">Reviews</h3>
                        <div className="">
                            {/* <div className="flex items-center">
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400' />
                                <div className="relative inline-flex">
                                    <StarIcon className='h-5 w-5 flex-shrink-0 text-yellow-400 [clip-path:inset(0_50%_0_0)]' />
                                    <StarIcon className='absolute inset-0 h-5 w-5 flex-shrink-0 text-gray-200 [clip-path:inset(0_0_0_48%)]' />
                                </div>
                            </div> */}
                            <div className="w-1/2">
                                <Image
                                    src="/home/stars-4.5.svg"
                                    alt="Trustpilot Starts 4.3"
                                    width={200}
                                    height={100}
                                    className="mx-auto mb-1"
                                />
                            </div>
                            <div className="w-full">
                                <a href="https://uk.trustpilot.com/review/www.casspea.co.uk" className="text-xs font-medium">
                                    4.3 out of 5 stars (30 Reviews)
                                </a>
                            </div>
                        </div>
                    </div>

                    <p className="font-normal text-sm">
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
