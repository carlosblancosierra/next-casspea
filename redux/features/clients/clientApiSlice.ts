import { apiSlice } from '@/redux/services/apiSlice';
import { ClientPage, UnlockedClientPage } from '@/types/clients';

// Access is per browser session on the backend (the same session cookie the
// cart uses), so the unlock call is all it takes: no login, no token to keep.
const clientApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getClientPage: builder.query<ClientPage, string>({
            query: slug => `/clients/${slug}/`,
        }),
        unlockClientPage: builder.mutation<UnlockedClientPage, { slug: string; code: string }>({
            query: ({ slug, code }) => ({
                url: `/clients/${slug}/unlock/`,
                method: 'POST',
                body: { code },
            }),
            async onQueryStarted({ slug }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(clientApiSlice.util.upsertQueryData('getClientPage', slug, data));
                } catch {
                    // Wrong code: the form shows the error.
                }
            },
        }),
    }),
});

export const { useGetClientPageQuery, useUnlockClientPageMutation } = clientApiSlice;

export default clientApiSlice;
