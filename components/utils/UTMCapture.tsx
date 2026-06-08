'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { captureUTMs } from '@/lib/utm';

// Silently captures UTM params from the landing URL into sessionStorage.
// Must be rendered inside a Suspense boundary (useSearchParams requirement).
export default function UTMCapture() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams) {
            captureUTMs(new URLSearchParams(searchParams.toString()));
        }
    }, [searchParams]);

    return null;
}
