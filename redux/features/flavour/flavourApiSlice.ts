import { apiSlice } from '@/redux/services/apiSlice';

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFlavours: builder.query({
            query: () => ({
                url: '/flavours/',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetFlavoursQuery,
} = authApiSlice;
