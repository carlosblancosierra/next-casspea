'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DiscountForm from './DiscountForm';
import EmailForm from './EmailForm';
import GiftMessage from './GiftMessage';
import ShippingDateForm from './ShippingDateForm';
import { useCreateCheckoutSessionMutation } from '@/redux/features/checkout/checkoutApiSlice';
import { useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { CartUpdate } from '@/types/carts';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/features/carts/cartSlice';

export default function CartCheckout() {
    const router = useRouter();
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();
    const [updateCart] = useUpdateCartMutation();
    const cart = useAppSelector(selectCart);
    const [addShippingDate, setAddShippingDate] = useState(false);
    const [addGiftMessage, setAddGiftMessage] = useState(false);
    const [shippingDate, setShippingDate] = useState<string>('');
    const [giftMessage, setGiftMessage] = useState<string>('');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        if (!email) return;

        setIsProcessing(true);
        setError(null);

        try {
            // First update cart with shipping date and gift message if provided
            if (addShippingDate || addGiftMessage) {
                const cartUpdate: CartUpdate = {
                    shipping_date: addShippingDate ? shippingDate : undefined,
                    gift_message: addGiftMessage ? giftMessage : undefined,
                };
                await updateCart(cartUpdate).unwrap();
            }

            // Then create checkout session
            const checkoutSession = await createCheckoutSession({
                email
            }).unwrap();

            // If successful, redirect to address page
            router.push('/checkout/address');

        } catch (err) {
            console.error('Checkout error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4 px-5">

            {/* Optional Fields Section */}
            <div className="border-b border-gray-900/10 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Order Options</h2>
                    </div>
                </div>

                <div className="mt-4 space-y-4">
                    {/* Shipping Date Option */}
                    <div className="">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={addShippingDate}
                                onChange={(e) => setAddShippingDate(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm font-medium text-gray-900">Add Shipping Date</span>
                        </label>
                        {!addShippingDate && (
                            <p className="text-xs text-gray-500 ml-6">
                                Otherwise, we will ship ASAP (1-2 business days)
                            </p>
                        )}
                        {addShippingDate && (
                            <div className="ml-6">
                                <p className="text-xs text-gray-500 mb-4">
                                    Please note: this is the shipping date, delivery date will be based on the shipping option you select next. Otherwise, we will ship ASAP (1-2 business days).
                                </p>
                                <ShippingDateForm onShippingDateChange={setShippingDate} />
                            </div>
                        )}
                    </div>

                    {/* Gift Message Option */}
                    <div className="mt-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={addGiftMessage}
                                onChange={(e) => setAddGiftMessage(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm font-medium text-gray-900">Add Gift Message</span>
                        </label>
                        {addGiftMessage && (
                            <div className="ml-6">
                                <GiftMessage onGiftMessageChange={setGiftMessage} />
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Discount Section */}
            <div className="border-b border-gray-900/10 pb-2">
                <h2 className="text-base font-semibold text-gray-900">Discount Code</h2>
                {/* <p className="mt-1 text-sm text-gray-600">
                    Enter your discount code if you have one
                </p> */}
                <div className="mt-2">
                    <DiscountForm />
                </div>
            </div>

            {/* Order Summary */}
            <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

            <div className="space-y-4">
                <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">${cart?.total}</dd>
                </dl>

                <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                    <dd className="text-base font-medium text-green-600">-$0.00</dd>
                </dl>

                {/* <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Shipping</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">$0.00</dd>
        </dl> */}
            </div>

            <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                <dd className="text-base font-bold text-gray-900 dark:text-white">${cart?.total}</dd>
            </dl>

            {/* Contact Information */}
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold text-gray-900">Ready to checkout?</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Enter your email address to continue to checkout
                </p>
                <div className="mt-6">
                    <EmailForm
                        onEmailSubmit={(email) => setEmail(email)}
                        initialEmail={email}
                    />
                </div>


                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={!email}
                        className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white
                            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                            focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                            disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Continue to checkout
                    </button>
                    <p className="mt-3 text-sm text-gray-500 text-center">
                        You'll be able to review your order before it's final
                    </p>
                </div>
            </div>
        </div>
    );
}
