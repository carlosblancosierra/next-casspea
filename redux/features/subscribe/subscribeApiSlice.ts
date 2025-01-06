import { apiSlice } from '@/redux/services/apiSlice';

interface SubscribeResponse {
    message: string;
    error?: string;
}

interface SubscribeRequest {
    email: string;
}

const subscribeApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        subscribeToNewsletter: builder.mutation<SubscribeResponse, SubscribeRequest>({
            query: (data) => ({
                url: '/leads/subscribe/',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: SubscribeResponse) => response,
            transformErrorResponse: (response: { status: number; data: any }) => {
                return {
                    message: 'Subscription failed',
                    error: response.data?.error || 'An unexpected error occurred'
                };
            },
        }),
    }),
});

export const {
    useSubscribeToNewsletterMutation,
} = subscribeApiSlice;

export default subscribeApiSlice;
