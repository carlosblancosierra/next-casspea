import { apiSlice } from '@/redux/services/apiSlice';
import { CheckoutSession, CheckoutSessionRequest } from '@/types/checkout';

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrCreateSession: builder.query<CheckoutSession, void>({
            query: () => '/checkout/session/',
            providesTags: ['CheckoutSession']
        }),

        updateSession: builder.mutation<CheckoutSession, Partial<CheckoutSessionRequest>>({
            query: (checkoutData) => ({
                url: '/checkout/session/',
                method: 'POST',
                body: checkoutData,
            }),
            invalidatesTags: ['CheckoutSession']
        }),

        createStripeCheckoutSession: builder.mutation<any, void>({
            query: () => ({
                url: '/checkout/create-stripe-session/',
                method: 'POST'
            }),
            invalidatesTags: ['CheckoutSession']
        }),

        updateShippingOption: builder.mutation<CheckoutSession, { shipping_option_id: string }>({
            query: ({ shipping_option_id }) => ({
                url: `/checkout/session/${shipping_option_id}/shipping-option/`,
                method: 'POST',
                body: { shipping_option_id }
            }),
            invalidatesTags: ['CheckoutSession']
        })
    })
});

export const {
    useGetOrCreateSessionQuery,
    useUpdateSessionMutation,
    useCreateStripeCheckoutSessionMutation,
    useUpdateShippingOptionMutation
} = checkoutApiSlice;
