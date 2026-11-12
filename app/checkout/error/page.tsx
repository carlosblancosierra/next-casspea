import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Something went wrong',
    robots: { index: false, follow: false },
};

/**
 * Where checkout sends people when it cannot tell how the payment went: the
 * embedded checkout's result could not be read (/checkout/result), or
 * casspea-v2's StripeSuccessView and StripeCancelView. The page did not exist
 * until BUG-14, so all of those ended on a 404.
 */
export default function CheckoutErrorPage() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-main-bg px-4 dark:bg-main-bg-dark">
            <div className="max-w-md text-center">
                <h1 className="text-3xl font-bold text-primary-text dark:text-primary-text-light">
                    Something went wrong
                </h1>
                <p className="mt-4 text-primary-text dark:text-primary-text-light">
                    We couldn&apos;t finish your checkout.
                </p>
                <p className="mt-2 text-primary-text dark:text-primary-text-light">
                    If your payment went through, you&apos;ll get a confirmation email in a few minutes.
                    If not, your basket is saved and you can try again.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/cart"
                        className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-text-light hover:bg-primary-2 dark:bg-primary-2 dark:hover:bg-primary"
                    >
                        Back to your basket
                    </Link>
                    <Link
                        href="/contact"
                        className="rounded-md border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-text-light dark:border-primary-2 dark:text-primary-2"
                    >
                        Contact us
                    </Link>
                </div>
            </div>
        </main>
    );
}
