import { apiSlice } from '@/redux/services/apiSlice';
import { CheckoutSession, CheckoutSessionRequest } from '@/types/checkout';
import { toast } from 'react-toastify';

export interface StoreStatus {
    open: boolean;
    deadline: string | null;
    reopen_label: string;
}

export const checkoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getStoreStatus: builder.query<StoreStatus, void>({
            query: () => '/checkout/store-status/',
        }),

        getSession: builder.query<CheckoutSession, void>({
            query: () => '/checkout/session/',
            providesTags: ['CheckoutSession'],
        }),

        updateSession: builder.mutation<CheckoutSession, Partial<CheckoutSessionRequest>>({
            query: (checkoutData) => ({
                url: '/checkout/session/',
                method: 'POST',
                body: checkoutData,
            }),
            // The cart page reads the session before the guest gives an email,
            // so the cache holds an unsaved one (id null). Without updating it,
            // the next step read that stale copy and sent the guest back to the
            // cart to give their email again, in a loop. Put the saved session
            // in the cache right away, and refetch it as well.
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(checkoutApiSlice.util.updateQueryData('getSession', undefined, () => data));
                } catch {
                    // The caller shows the error.
                }
            },
            invalidatesTags: ['CheckoutSession'],
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
    useGetStoreStatusQuery,
    useCreateStripeCheckoutSessionMutation,
    useGetSessionQuery,
    useUpdateSessionMutation,
    useCreateEmbeddedCheckoutSessionMutation,
    useGetEmbeddedCheckoutSessionResultQuery,
    useUpdateShippingOptionMutation
} = checkoutApiSlice;
