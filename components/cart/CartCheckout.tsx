'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DiscountForm from './DiscountForm';
import EmailForm from './EmailForm';
import GiftMessage from './GiftMessage';
import ShippingDateForm from './ShippingDateForm';
import { useGetCartQuery, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { CartUpdate } from '@/types/carts';
import Link from 'next/link';
import { useUpdateSessionMutation, useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';

export default function CartCheckout() {

    const { data: cart, isLoading, error: cartError } = useGetCartQuery();
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
    const [addDiscount, setAddDiscount] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
        <div className="space-y-4 mt-4">
            {/* Order Summary - Moved to top */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-main-bg p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 px-5">
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
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setShowModal(true);
                                    }
                                    setAddShippingDate(e.target.checked);
                                }}
                                className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-2"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Add Shipping Date
                            </span>
                        </label>
                        {addShippingDate && (
                            <div className="ml-6">
                                <ShippingDateForm onShippingDateChange={setShippingDate} />
                            </div>
                        )}
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center bg-black bg-opacity-50">
                            <div className="relative w-full max-w-md max-h-full">
                                <div className="relative bg-main-bg rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            Shipping Date Information
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-4 md:p-5">
                                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                            The shipping date is the date we will ship your order. Your delivery date depends on the selected shipping method.
                                        </p>
                                    </div>
                                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            type="button"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            I understand
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gift Message Option */}
                    <div className="mt-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={addGiftMessage}
                                onChange={(e) => setAddGiftMessage(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-2"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Add Gift Message</span>
                        </label>
                        {addGiftMessage && (
                            <div className="ml-6">
                                <GiftMessage onGiftMessageChange={setGiftMessage} />
                            </div>
                        )}
                    </div>

                    {/* Discount Option - Updated */}
                    <div className="mt-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={addDiscount}
                                onChange={(e) => setAddDiscount(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary
                                    dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-2"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Add Discount Code
                            </span>
                        </label>
                        {addDiscount && (
                            <div className="ml-6">
                                <DiscountForm />
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

                {/* <Link
                    href="/shop-now/"
                    className="inline-flex items-center justify-center rounded-md bg-pink-600 px-4 py-3 text-sm font-semibold text-white w-full mt-4"
                >
                    <span>Keep Shopping</span>
                </Link> */}

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={!email || isProcessing}
                        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white
                            shadow-sm hover:bg-primary-2 focus-visible:outline focus-visible:outline-2
                            focus-visible:outline-offset-2 focus-visible:outline-primary
                            disabled:bg-gray-300 dark:disabled:bg-gray-700 dark:bg-primary-2
                            dark:hover:bg-primary dark:focus-visible:outline-primary-2
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
