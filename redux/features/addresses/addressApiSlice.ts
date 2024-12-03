import { apiSlice } from '@/redux/services/apiSlice';
import { Address, AddressRequest } from '@/types/addresses';

export const addressApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAddresses: builder.query<Address[], void>({
            query: () => '/addresses/',
            providesTags: [{ type: 'Addresses', id: 'LIST' }]
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
    useSetAddressesMutation
} = addressApiSlice;
