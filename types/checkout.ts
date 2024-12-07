import { Address } from './addresses';

export type CheckoutSessionRequest = {
    email?: string;
    shipping_address?: Address | null;
    billing_address?: Address | null;
    shipping_option_id?: number;
}

export type CheckoutSession = {
    id: number;
    shipping_address: Address | null;
    billing_address: Address | null;
    email: string;
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

