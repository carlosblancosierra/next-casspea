'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { CheckoutSession } from '@/types/checkout';

/**
 * The checkout steps after the cart need a saved checkout session. A guest
 * gets one when they give their email on the cart page. Until then the API
 * answers with an unsaved session whose id is null (casspea-v2 BUG-10), and
 * nothing these steps send can be saved: the address step got a 400 and the
 * payment button ended in "Failed to process payment". Such a guest (someone
 * who opens /checkout/confirm directly, say) goes back to the cart, where
 * "Continue to Checkout" asks for the email.
 *
 * Returns true while that redirect is under way, so the step can render
 * nothing instead of a form that cannot be sent.
 *
 * Pass isFetching: while the session is being refetched, data can still be an
 * old copy from before the guest gave their email, and acting on it sent
 * guests who had just given it back to the cart.
 */
export function useRequireCheckoutSession(
    session: CheckoutSession | undefined,
    isFetching = false,
): boolean {
    const router = useRouter();
    const needsEmail = !isFetching && session !== undefined && session.id === null;

    useEffect(() => {
        if (!needsEmail) return;
        toast.info('Please enter your email to continue to checkout.');
        router.replace('/cart');
    }, [needsEmail, router]);

    return needsEmail;
}
