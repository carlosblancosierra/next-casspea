'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useDiscountCode } from '@/hooks/useDiscountCode';
import WhatsAppFAB from './WhatsAppFAB';

// Separate client component for discount code handling
function DiscountCodeHandler() {
    useDiscountCode();
    return null;
}

// Main wrapper that minimizes client-side code
function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Nothing floats over the checkout. Once someone is paying, a chat button
    // is a way out of the flow, and on mobile it sits on top of the pay
    // button — the one control that must never be competed with.
    const isCheckout = pathname?.startsWith('/checkout') ?? false;

    return (
        <>
            <Suspense fallback={null}>
                <DiscountCodeHandler />
            </Suspense>
            {children}
            {!isCheckout && <WhatsAppFAB />}
        </>
    );
}

export default LayoutWrapper;
