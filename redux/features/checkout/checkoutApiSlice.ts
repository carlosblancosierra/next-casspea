import { apiSlice } from '@/redux/services/apiSlice';
import { CheckoutSession, CheckoutSessionRequest } from '@/types/checkout';
import { setCheckoutSession } from './checkoutSlice';
import { toast } from 'react-toastify';

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getSession: builder.query<CheckoutSession, void>({
            query: () => '/checkout/session/',
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCheckoutSession(data));
                    console.log('checkout session', data);
                } catch {
                    // TODO: Handle error if needed
                    toast.error('Error');
                }
            },
        }),

        createSession: builder.mutation<CheckoutSession, Partial<CheckoutSessionRequest>>({
            query: (checkoutData) => ({
                url: '/checkout/session/',
                method: 'POST',
                body: checkoutData,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCheckoutSession(data));
                    console.log('checkout session', data);
                } catch {
                    // TODO: Handle error if needed
                    toast.error('Error');
                }
            },
        }),

        createStripeCheckoutSession: builder.mutation<any, void>({
            query: () => ({
                url: '/checkout/create-stripe-session/',
                method: 'POST'
            }),
        }),

        updateShippingOption: builder.mutation<CheckoutSession, { shipping_option_id: string }>({
            query: ({ shipping_option_id }) => ({
                url: `/checkout/session/${shipping_option_id}/shipping-option/`,
                method: 'POST',
                body: { shipping_option_id }
            }),
        })
    })
});

export const {
    useCreateStripeCheckoutSessionMutation,
    useUpdateShippingOptionMutation,
    useGetSessionQuery,
    useCreateSessionMutation
} = checkoutApiSlice;
