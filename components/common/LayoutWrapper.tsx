'use client';

import { Suspense } from 'react';
import { useDiscountCode } from '@/hooks/useDiscountCode';

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
        </>
    );
}

export default LayoutWrapper;
