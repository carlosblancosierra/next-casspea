import { apiSlice } from '@/redux/services/apiSlice';
import {
    Address,
    AddressPostcodeStat,
    AddressRequest,
    SmsContactsResponse,
} from '@/types/addresses';

export const addressApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAddresses: builder.query<Address[], void>({
            query: () => '/addresses/',
            providesTags: [{ type: 'Addresses', id: 'LIST' }]
        }),

        getAddressesStats: builder.query<AddressPostcodeStat[], void>({
            query: () => '/addresses/stats',
            providesTags: [{ type: 'Addresses', id: 'STATS' }]
        }),

        getSmsContacts: builder.query<SmsContactsResponse, void>({
            query: () => '/addresses/sms-contacts/',
            providesTags: [{ type: 'Addresses', id: 'SMS' }]
        }),

        // A mutation rather than a query: this is an on-demand download and
        // there is nothing to cache. Going through the shared base query is
        // the point - it carries the JWT *and* the proactive refresh, unlike
        // the hand-rolled fetch in useOrderActions.
        //
        // Resolved as text, not a Blob: RTK Query keeps a mutation's result in
        // the store, and a Blob there trips the default serializableCheck. The
        // caller wraps the text in a Blob to save it.
        downloadSmsContactsCsv: builder.mutation<string, void>({
            query: () => ({
                url: '/addresses/sms-contacts/?format=csv',
                responseHandler: (response: Response) => response.text()
            })
        }),

        setAddresses: builder.mutation<any, AddressRequest>({
            query: (addresses) => ({
                url: '/addresses/',
                method: 'POST',
                body: addresses
            }),
            invalidatesTags: [{ type: 'Addresses', id: 'LIST' }]
        })
    })
});

export const {
    useGetAddressesQuery,
    useSetAddressesMutation,
    useGetAddressesStatsQuery,
    useGetSmsContactsQuery,
    useDownloadSmsContactsCsvMutation
} = addressApiSlice;
