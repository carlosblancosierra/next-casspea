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

        createEmbeddedCheckoutSession: builder.mutation<any, void>({
            query: () => ({
                url: '/checkout/stripe/embedded/create-session/',
                method: 'POST'
            }),
        }),

        getEmbeddedCheckoutSessionResult: builder.query<any, string>({
            query: (sessionId) => ({
                url: `/checkout/stripe/embedded/result/?session_id=${sessionId}`,
                method: 'GET'
            }),
        }),

        updateShippingOption: builder.mutation<CheckoutSession, { checkoutSessionId: number, data: { shipping_option_id: number, pickup_date?: string, pickup_time?: string } }>({
            query: ({ checkoutSessionId, data }) => ({
                url: `/checkout/session/${checkoutSessionId}/shipping-option/`,
                method: 'POST',
                body: data,
            }),
        }),
    })
});

export const {
    useCreateStripeCheckoutSessionMutation,
    useGetSessionQuery,
    useUpdateSessionMutation,
    useCreateEmbeddedCheckoutSessionMutation,
    useGetEmbeddedCheckoutSessionResultQuery,
    useUpdateShippingOptionMutation
} = checkoutApiSlice;
