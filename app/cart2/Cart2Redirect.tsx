'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { enableNewShippingPreview } from '@/constants/featureFlags';

export default function Cart2Redirect() {
    const router = useRouter();

    useEffect(() => {
        enableNewShippingPreview();
        router.replace('/cart');
    }, [router]);

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-sm text-primary-text dark:text-primary-text-light">
                Enabling the new checkout preview&hellip;
            </p>
        </div>
    );
}
