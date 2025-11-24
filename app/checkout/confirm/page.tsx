import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';

export default function ConfirmPage() {
    return (
        <main className="mx-auto max-w-3xl md:py-8 py-4 px-4 sm:px-6 bg-main-bg dark:bg-main-bg-dark min-h-screen">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-text-primary-text">
                    Confirm Order
                </h1>
                <CheckoutConfirm />
            </div>
        </main>
    );
}
