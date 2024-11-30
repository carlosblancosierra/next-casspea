import { apiSlice } from '@/redux/services/apiSlice';
import { CheckoutSession, CheckoutSessionRequest, StripeCheckoutSessionResponse } from '@/types/checkout';
import { ShippingOption } from '@/types/shipping';
import { setCheckoutSession, setError } from './checkoutSlice';

interface UpdateShippingOptionRequest {
    checkoutSessionId: number;
    shippingOptionId: number;
}

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation<CheckoutSession, CheckoutSessionRequest>({
            query: (checkoutData) => ({
                url: '/checkout/session/',
                method: 'POST',
                body: checkoutData,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCheckoutSession(data));
                } catch (error) {
                    dispatch(setError('Failed to create checkout session'));
                }
            },
        }),

        updateShippingOption: builder.mutation<CheckoutSession, UpdateShippingOptionRequest>({
            query: ({ checkoutSessionId, shippingOptionId }) => ({
                url: `/checkout/session/${checkoutSessionId}/shipping-option/`,
                method: 'POST',
                body: { shipping_option_id: shippingOptionId }
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCheckoutSession(data));
                } catch (error) {
                    dispatch(setError('Failed to update shipping option'));
                }
            },
        }),

        createStripeCheckoutSession: builder.mutation<StripeCheckoutSessionResponse, void>({
            query: () => ({
                url: '/checkout/stripe/create-checkout-session',
                method: 'POST',
            }),
            transformResponse: (response: StripeCheckoutSessionResponse) => response,
            onQueryStarted(_, { queryFulfilled }) {
                queryFulfilled.then((result) => {
                    window.location.href = result.data.url;
                });
            },
        }),
    }),
});

export const {
    useCreateCheckoutSessionMutation,
    useCreateStripeCheckoutSessionMutation,
    useUpdateShippingOptionMutation,
} = checkoutApiSlice;
