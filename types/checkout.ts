import { Address } from './addresses';

export type CheckoutSessionRequest = {
    email?: string;
    shipping_address?: Address | null;
    billing_address?: Address | null;
    shipping_option_id?: number;
}

export type CheckoutSession = {
    /**
     * null for a guest who has not given an email yet: the API answers with an
     * unsaved session for their cart and saves it when the email arrives
     * (casspea-v2 BUG-10). The steps after the cart need a saved one, see
     * useRequireCheckoutSession.
     */
    id: number | null;
    shipping_address: Address | null;
    billing_address: Address | null;
    /** null until a guest gives it, and always null for a logged-in customer. */
    email: string | null;
    phone: string | null;
    created: string;
    updated: string;
    payment_status: string;
    stripe_payment_intent: string | null;
    stripe_session_id: string | null;
    cart: number;
}

export type StripeCheckoutSessionResponse = {
    url: string;
}

