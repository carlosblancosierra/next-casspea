'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DiscountForm from './DiscountForm';
import EmailForm from './EmailForm';
import ShippingDateForm from './ShippingDateForm';
import { useGetCartQuery, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { CartUpdate } from '@/types/carts';
import Link from 'next/link';
import { useUpdateSessionMutation, useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';

export default function CartCheckout() {
    const { data: cart, isLoading } = useGetCartQuery();
    const router = useRouter();

    const [updateSession] = useUpdateSessionMutation();
    const [updateCart] = useUpdateCartMutation();

    const [shippingDate, setShippingDate] = useState<string>('');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showShippingDate, setShowShippingDate] = useState(false);
    const [showDiscount, setShowDiscount] = useState(false);
    const [showShippingInfo, setShowShippingInfo] = useState(false);

    const { data: checkoutSession, isLoading: isSessionLoading } = useGetSessionQuery();

    useEffect(() => {
        if (!isSessionLoading && checkoutSession?.email) {
            setEmail(checkoutSession.email);
        }
    }, [checkoutSession, isSessionLoading]);

    if (!cart || cart.items.length === 0) return null;

    const formatCurrency = (value: string) =>
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(parseFloat(value));

    const handleCheckout = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            if (showShippingDate && shippingDate) {
                const cartUpdate: CartUpdate = { shipping_date: shippingDate };
                await updateCart(cartUpdate).unwrap();
            }
            await updateSession({ email }).unwrap();
            router.push('/checkout/gift-card');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4 mt-4">
            {/* Order summary */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-main-bg-dark p-5 space-y-3">
                <p className="text-base font-bold text-gray-900 dark:text-white">Order Summary</p>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>{formatCurrency(cart.base_total)}</span>
                    </div>

                    {cart.discount && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Discount ({cart.discount.code})</span>
                            <span>−{formatCurrency(cart.total_savings)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span className="text-gray-400 dark:text-gray-500 italic">Next step</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                        {formatCurrency(cart.discounted_total)}
                    </span>
                </div>
            </div>

            {/* Optional: Discount code */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowDiscount(v => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {cart.discount ? `Code applied: ${cart.discount.code}` : 'Have a discount code?'}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${showDiscount ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {showDiscount && (
                    <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-800">
                        <DiscountForm />
                    </div>
                )}
            </div>

            {/* Optional: Shipping date */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowShippingDate(v => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {shippingDate ? `Ships: ${shippingDate}` : 'Request a shipping date'}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${showShippingDate ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {showShippingDate && (
                    <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 pt-3">
                            Pick the date we should ship your order. Delivery time depends on the shipping method you choose in the next step.
                        </p>
                        <ShippingDateForm onShippingDateChange={setShippingDate} />
                    </div>
                )}
            </div>

            {/* Email */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirmation email
                    </p>
                    {email && (
                        <button onClick={() => setEmail('')} className="text-xs text-primary hover:underline">
                            Change
                        </button>
                    )}
                </div>

                {email ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        {email}
                    </div>
                ) : (
                    <EmailForm initialEmail={email} onValidEmail={setEmail} />
                )}
            </div>

            {/* CTA */}
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isProcessing || !email}
                    className={`w-full rounded-xl px-4 py-4 text-base font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isProcessing || !email
                            ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-autumn text-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing…
                        </>
                    ) : !email ? (
                        'Enter email to continue'
                    ) : (
                        <>
                            Continue to Checkout
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>

                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                )}

                <Link
                    href="/shop-now/"
                    className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors py-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue shopping
                </Link>
            </div>
        </div>
    );
}
