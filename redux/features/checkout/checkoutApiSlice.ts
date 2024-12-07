import { apiSlice } from '@/redux/services/apiSlice';
import { CheckoutSession, CheckoutSessionRequest } from '@/types/checkout';
import { toast } from 'react-toastify';

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getSession: builder.query<CheckoutSession, void>({
            query: () => '/checkout/session/',
        }),

        updateSession: builder.mutation<CheckoutSession, Partial<CheckoutSessionRequest>>({
            query: (checkoutData) => ({
                url: '/checkout/session/',
                method: 'POST',
                body: checkoutData,
            }),
        }),

        createStripeCheckoutSession: builder.mutation<any, void>({
            query: () => ({
                url: '/checkout/stripe/create-session/',
                method: 'POST'
            }),
        }),
    })
});

export const {
    useCreateStripeCheckoutSessionMutation,
    useGetSessionQuery,
    useUpdateSessionMutation
} = checkoutApiSlice;
