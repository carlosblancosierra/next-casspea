import { apiSlice } from '@/redux/services/apiSlice';

interface SubscribeResponse {
    message: string;
    error?: string;
}

interface SubscribeRequest {
    email: string;
}

export type LeadType = 'newsletter' | 'contact_form' | 'landing_page' | 'giveaway';
export type FormCode = 'GOLD' | 'BLUE' | 'TM7' | null;

export interface GenericLeadSubscribeRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  instagram_username?: string;
  form_code?: FormCode;
  lead_type?: LeadType;
  unsubscribed?: boolean;
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
        subscribeGenericLead: builder.mutation<SubscribeResponse, Partial<GenericLeadSubscribeRequest> & { [key: string]: any }>({
            query: (data) => ({
                url: '/leads/generic-lead/',
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
    useSubscribeGenericLeadMutation,
} = subscribeApiSlice;

export default subscribeApiSlice;
