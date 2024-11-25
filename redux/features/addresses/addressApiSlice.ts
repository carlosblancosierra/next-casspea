import { apiSlice } from '@/redux/services/apiSlice';
import { Address, AddressRequest, AddressResponse } from '@/types/addresses';

export const addressApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        setAddresses: builder.mutation<AddressResponse, AddressRequest>({
            query: (addresses) => ({
                url: '/addresses/',
                method: 'POST',
                body: addresses,
            }),
        }),
    }),
});

export const {
    useSetAddressesMutation,
} = addressApiSlice;
