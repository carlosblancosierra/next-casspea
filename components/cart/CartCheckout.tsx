'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DiscountForm from './DiscountForm';
import EmailForm from './EmailForm';
import GiftMessage from './GiftMessage';
import ShippingDateForm from './ShippingDateForm';
import { useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { CartUpdate } from '@/types/carts';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/features/carts/cartSlice';
import { useUpdateSessionMutation, useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';

export default function CartCheckout() {

    const cart = useAppSelector(selectCart);
    const router = useRouter();

    const [updateSession] = useUpdateSessionMutation();
    const [updateCart] = useUpdateCartMutation();
    const [addShippingDate, setAddShippingDate] = useState(false);
    const [addGiftMessage, setAddGiftMessage] = useState(false);
    const [shippingDate, setShippingDate] = useState<string>('');
    const [giftMessage, setGiftMessage] = useState<string>('');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // here, when load the page, get the session
    const { data: checkoutSession, isLoading: isSessionLoading } = useGetSessionQuery();

    // Update useEffect to handle loading state
    useEffect(() => {
        if (!isSessionLoading && checkoutSession?.email) {
            setEmail(checkoutSession.email);
        }
    }, [checkoutSession, isSessionLoading]);

    if (!cart || cart.items.length === 0) {
        return null;
    }

    const handleValidEmail = async (newEmail: string) => {
        setEmail(newEmail);
    };

    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(parseFloat(value));
    };

    const handleCheckout = async () => {
        console.log('handleCheckout email', email);
        if (!email) return;

        setIsProcessing(true);
        setError(null);

        try {
            if (addShippingDate || addGiftMessage) {
                const cartUpdate: CartUpdate = {
                    shipping_date: addShippingDate ? shippingDate : undefined,
                    gift_message: addGiftMessage ? giftMessage : undefined,
                };
                await updateCart(cartUpdate).unwrap();
            }

            await updateSession({ email }).unwrap();

            router.push(`/checkout/address`);

        } catch (err) {
            console.error('Checkout error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4 px-5">
            {/* Order Summary - Moved to top */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

                <div className="space-y-4">
                    {/* Original Price */}
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                            {formatCurrency(cart.base_total)}
                        </dd>
                    </dl>

                    {/* Discount if applied */}
                    {cart.discount && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                                Discount ({cart.discount.code})
                            </dt>
                            <dd className="text-base font-medium text-green-600 dark:text-green-400">
                                -{formatCurrency(cart.total_savings)}
                            </dd>
                        </dl>
                    )}

                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Shipping</dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                            Next Step
                        </dd>
                    </dl>
                </div>

                {/* Total */}
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                        {formatCurrency(cart.discounted_total)}
                    </dd>
                </dl>
            </div>

            {/* Discount Section */}
            <div className="border-b border-gray-900/10 pb-2 dark:border-gray-700">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-200">Discount Code</h2>
                <div className="mt-2">
                    <DiscountForm />
                </div>
            </div>

            {/* Optional Fields Section */}
            <div className="border-b border-gray-900/10 pb-4 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-200">Order Options</h2>
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
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Add Shipping Date
                            </span>
                        </label>
                        {!addShippingDate && (
                            <p className="text-xs mt-1 text-gray-500 ml-6 dark:text-gray-400">
                                Otherwise, we will ship ASAP (1-2 business days)
                            </p>
                        )}
                        {addShippingDate && (
                            <div className="ml-6">
                                <p className="mt-1 text-xs text-gray-500 mb-4 dark:text-gray-400">
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
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Add Gift Message</span>
                        </label>
                        {addGiftMessage && (
                            <div className="ml-6">
                                <GiftMessage onGiftMessageChange={setGiftMessage} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-gray-900/10 pb-12 dark:border-gray-700">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-200">Ready to checkout?</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Enter your email address to continue to checkout
                </p>
                <div className="mt-6">
                    <EmailForm initialEmail={email} onValidEmail={handleValidEmail} />
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={!email || isProcessing}
                        className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white
                            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                            focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                            disabled:bg-gray-300 dark:disabled:bg-gray-700 dark:bg-indigo-500
                            dark:hover:bg-indigo-600 dark:focus-visible:outline-indigo-500
                            disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isProcessing ? 'Processing...' : 'Continue to checkout'}
                    </button>
                    {error && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                            {error}
                        </p>
                    )}
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        You'll be able to review your order before it's final
                    </p>
                </div>
            </div>
        </div>
    );
}
