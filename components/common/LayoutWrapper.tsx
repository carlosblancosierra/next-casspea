'use client';

import { Suspense } from 'react';
import { useDiscountCode } from '@/hooks/useDiscountCode';
import WhatsAppFAB from './WhatsAppFAB';

// Separate client component for discount code handling
function DiscountCodeHandler() {
    useDiscountCode();
    return null;
}

// Main wrapper that minimizes client-side code
function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={null}>
                <DiscountCodeHandler />
            </Suspense>
            {children}
            <WhatsAppFAB />
        </>
    );
}

export default LayoutWrapper;
