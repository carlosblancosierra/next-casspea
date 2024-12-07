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
                    console.error('Error fetching checkout session');
                }
            },
        }),

        updateSession: builder.mutation<CheckoutSession, Partial<CheckoutSessionRequest>>({
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
                    console.error('Error updating checkout session');
                }
            },
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
