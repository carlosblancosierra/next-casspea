'use client';

import { useState, useEffect, useRef } from 'react';
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
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [modalEmail, setModalEmail] = useState('');

    // here, when load the page, get the session
    const { data: checkoutSession, isLoading: isSessionLoading } = useGetSessionQuery();

    // Update useEffect to handle loading state
    useEffect(() => {
        if (!isSessionLoading && checkoutSession?.email) {
            setEmail(checkoutSession.email);
        }
    }, [checkoutSession, isSessionLoading]);

    // Add the useEffect hook after the cart is retrieved to set the gift message from the cart
    useEffect(() => {
        if (cart?.gift_message) {
            setGiftMessage(cart.gift_message);
            setAddGiftMessage(true);
        }
    }, [cart]);

    if (!cart || cart.items.length === 0) {
        return null;
    }

    const handleValidEmail = async (newEmail: string) => {
        setEmail(newEmail);
    };

    const handleModalEmailChange = (newEmail: string) => {
        setModalEmail(newEmail);
    };

    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(parseFloat(value));
    };

    const handleCheckout = async () => {
        console.log('handleCheckout email', email);
        
        // If no email, open modal to collect it
        if (!email) {
            setModalEmail(''); // Reset modal email
            setShowEmailModal(true);
            return;
        }

        // Proceed with checkout
        await proceedToCheckout(email);
    };

    const handleModalCheckout = async () => {
        if (!modalEmail) return;
        
        // Set the email from modal
        setEmail(modalEmail);
        setShowEmailModal(false);
        
        // Proceed with checkout
        await proceedToCheckout(modalEmail);
    };

    const proceedToCheckout = async (emailToUse: string) => {
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

            await updateSession({ email: emailToUse }).unwrap();

            router.push(`/checkout/gift-card`);

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
                <p className="text-xl font-semibold text-primary-text">Order summary</p>

                <div className="space-y-4">
                    {/* Original Price */}
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-primary-text">Original price</dt>
                        <dd className="text-base font-medium text-primary-text">
                            {formatCurrency(cart.base_total)}
                        </dd>
                    </dl>

                    {/* Discount if applied */}
                    {cart.discount && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-primary-text">
                                Discount ({cart.discount.code})
                            </dt>
                            <dd className="text-base font-medium text-green-600 dark:text-green-400">
                                -{formatCurrency(cart.total_savings)}
                            </dd>
                        </dl>
                    )}

                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-primary-text">Shipping</dt>
                        <dd className="text-base font-medium text-primary-text">
                            Next Step
                        </dd>
                    </dl>
                </div>

                {/* Total */}
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-primary-text">Total</dt>
                    <dd className="text-base font-bold text-primary-text">
                        {formatCurrency(cart.discounted_total)}
                    </dd>
                </dl>
            </div>

            {/* Optional Fields Section */}
            <div className="border-b border-gray-900/10 pb-4 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-base font-semibold text-primary-text">Order Options</h2>
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
                            <span className="text-sm font-medium text-primary-text">
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
                                        <h3 className="text-xl font-medium text-primary-text">
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
                                        <p className="text-base leading-relaxed text-primary-text">
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
                    {/* <div className="mt-4">
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
                                <GiftMessage onGiftMessageChange={setGiftMessage} initialMessage={giftMessage} />
                            </div>
                        )}
                    </div> */}

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
                            <span className="text-sm font-medium text-primary-text">
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

            {/* Contact Information - Optional */}
            {email && (
                <div className="border-b border-gray-900/10 pb-6 dark:border-gray-700">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-primary-text">
                                    Email Confirmed
                                </h3>
                                <p className="mt-1 text-sm text-primary-text">
                                    {email}
                                </p>
                            </div>
                            <button
                                onClick={() => setEmail('')}
                                className="text-sm text-primary-text font-medium"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Button Section */}
            <div className="border-b border-gray-900/10 pb-12 dark:border-gray-700">
                <div className="space-y-4">

                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className={`w-full rounded-md px-4 py-4 text-xl font-bold text-primary-text
                            shadow-lg transition-all duration-200 flex items-center justify-center
                            ${isProcessing
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-wait opacity-70'
                                : 'bg-gradient-autumn dark:bg-primary-2 hover:shadow-xl hover:scale-[1.02] dark:hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                Continue to Checkout
                                <svg className="w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="flex items-start bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            <p className="text-sm text-primary-text">{error}</p>
                        </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3 space-y-2">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                            <p className="text-xs text-primary-text">
                                {email ? "You'll review your complete order and enter shipping details on the next page" : "Click the button above to continue. We'll ask for your email in the next step."}
                            </p>
                        </div>
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            <p className="text-xs text-primary-text">
                                Advent Calendar shipping begins on November 21st
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/shop-now/"
                        className="inline-flex items-center justify-center rounded-md text-primary dark:text-primary-2 px-4 py-3 text-sm font-semibold w-full border border-primary dark:border-primary-2 hover:bg-primary hover:text-white dark:hover:bg-primary-2 dark:hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>

            {/* Email Collection Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div 
                            className="fixed inset-0 bg-gray-500 dark:bg-main-bg-dark bg-opacity-75 dark:bg-opacity-80 transition-opacity" 
                            aria-hidden="true"
                            onClick={() => setShowEmailModal(false)}
                        ></div>

                        {/* Center modal */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-main-bg dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-primary-text" id="modal-title">
                                        One More Step
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-primary-text">
                                            Please enter your email address to continue to checkout. We'll send your order confirmation here.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <EmailForm initialEmail={modalEmail} onValidEmail={handleModalEmailChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    disabled={!modalEmail}
                                    onClick={handleModalCheckout}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-primary-text focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm
                                        ${modalEmail
                                            ? 'bg-primary dark:bg-primary-2 hover:bg-primary-2 dark:hover:bg-primary focus:ring-primary'
                                            : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                                        }`}
                                >
                                    Continue to Checkout
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-main-bg dark:bg-gray-700 text-base font-medium text-primary-text hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:col-start-1 sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
