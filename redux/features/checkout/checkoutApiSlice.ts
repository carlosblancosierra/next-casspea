import { apiSlice } from '@/redux/services/apiSlice';
import { CheckoutSession, CheckoutSessionRequest, StripeCheckoutSessionResponse } from '@/types/checkout';
import { setCheckoutSession, setError } from './checkoutSlice';

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
} = checkoutApiSlice;
