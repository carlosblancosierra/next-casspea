import { apiSlice } from '@/redux/services/apiSlice';

export interface ClientSetupProduct {
    slug: string;
    name: string;
    price: string;
    stripe_price_id: string;
    exists: boolean;
    up_to_date: boolean;
}

export interface ClientSetupStatus {
    key: string;
    name: string;
    path: string;
    page_exists: boolean;
    page_active: boolean;
    has_access_code: boolean;
    products: ClientSetupProduct[];
}

export interface ClientSetupLoadResult {
    ok: boolean;
    error?: string;
    dry_run?: boolean;
    log?: string[];
    /** Only present when this call set the code: it can't be shown again. */
    access_code?: string | null;
    status?: ClientSetupStatus;
}

const ADMIN_URL = '/clients/admin/setups/';

const clientSetupsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getClientSetups: builder.query<{ setups: ClientSetupStatus[] }, void>({
            query: () => ADMIN_URL,
        }),
        loadClientSetup: builder.mutation<ClientSetupLoadResult, { setup: string; dry_run?: boolean; new_code?: boolean }>({
            query: body => ({ url: ADMIN_URL, method: 'POST', body }),
        }),
    }),
});

export const { useGetClientSetupsQuery, useLoadClientSetupMutation } = clientSetupsApiSlice;

export default clientSetupsApiSlice;
