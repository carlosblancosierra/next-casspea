'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetCartQuery, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { track } from '@/utils/analytics';
import type { Promo } from './campaign';

type Status = 'idle' | 'applying' | 'applied' | 'copied';

/**
 * The announcement bar's content while a Black Friday promo is running.
 *
 * The pill applies the code to the basket in one tap. It never replaces a code
 * that is already in the basket: subscribers get a better code by email, and
 * swapping it for the public one would cost them money.
 */
export default function PromoAnnouncement({ promo }: { promo: Promo }) {
    const { data: cart } = useGetCartQuery();
    const [updateCart] = useUpdateCartMutation();
    const [status, setStatus] = useState<Status>('idle');

    const existingCode = cart?.discount?.code;

    const handleApply = async () => {
        setStatus('applying');
        try {
            await updateCart({ discount_code: promo.code, remove_discount: false }).unwrap();
            setStatus('applied');
            track('promo_code_applied', { promo_id: promo.id, code: promo.code, source: 'announcement_bar' });
        } catch {
            // The basket refused it (say, nothing in it yet): hand them the code instead.
            try {
                await navigator.clipboard.writeText(promo.code);
            } catch {
                // Clipboard blocked; the code is on screen anyway.
            }
            setStatus('copied');
        }
    };

    const pillClasses =
        'rounded-full bg-accent px-3.5 py-1 text-sm font-semibold text-accent-text shadow-sm transition-opacity hover:opacity-90 disabled:opacity-70';

    let pill: React.ReactNode;
    if (existingCode) {
        pill = (
            <span className={pillClasses}>
                Code {existingCode} applied
            </span>
        );
    } else if (status === 'applied') {
        pill = <span className={pillClasses}>{promo.code} applied ✓</span>;
    } else if (status === 'copied') {
        pill = <span className={pillClasses}>Code {promo.code} copied</span>;
    } else {
        pill = (
            <button type="button" onClick={handleApply} disabled={status === 'applying'} className={pillClasses}>
                Use code {promo.code}
            </button>
        );
    }

    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-2 md:flex-row md:gap-x-6">
            <p className="m-0 text-center text-sm leading-6 text-primary-text-light">
                <span className="font-semibold uppercase tracking-widest text-accent">{promo.label}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <Link href="/shop-now" className="font-medium underline-offset-4 hover:underline">
                    {promo.headline}
                </Link>
            </p>
            {pill}
        </div>
    );
}
