'use client';

import type { Flavour } from '@/types/flavours';
import { useGetAdventLandingQuery } from '@/redux/features/products/productApiSlice';
import type { Variant } from './content';
import AdventLanding from './AdventLanding';

/**
 * The landing before it is live. The API only answers staff then, and the
 * staff member's token lives in the browser, so the content is fetched here
 * rather than on the server. Everyone else sees the page as missing.
 */
export default function AdventPreview({ variant, flavours }: { variant: Variant; flavours: Flavour[] }) {
    const { data, isLoading } = useGetAdventLandingQuery();

    if (isLoading) {
        return <p className="py-24 text-center text-gray-600 dark:text-gray-400">Loading…</p>;
    }
    if (!data) {
        return (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
                <h1 className="m-0 font-playfair text-3xl font-bold">This page isn&apos;t available</h1>
                <a href="/shop-now/advent-calendar" className="text-primary underline underline-offset-4">
                    See the Advent Calendar
                </a>
            </div>
        );
    }
    return (
        <>
            {!data.live && (
                <p className="m-0 bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-text">
                    Staff preview: this page is not live. Switch it on in Django admin → Products → Advent landing.
                </p>
            )}
            <AdventLanding variant={variant} product={data.product} exclusives={data.flavours} flavours={flavours} />
        </>
    );
}
