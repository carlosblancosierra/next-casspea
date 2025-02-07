import { apiSlice } from '@/redux/services/apiSlice';
import { Flavour } from '@/types/flavours';

const flavourApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFlavours: builder.query<Flavour[], void>({
            query: () => '/flavours/',
            transformResponse: (response: Flavour[]) => response,
        }),
    }),
});

export const {
    useGetFlavoursQuery,
} = flavourApiSlice;

export default flavourApiSlice;
