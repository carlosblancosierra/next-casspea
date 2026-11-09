import { apiSlice } from '@/redux/services/apiSlice';
import { Flavour } from '@/types/flavours';

const flavourApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFlavours: builder.query<Flavour[], void>({
            query: () => '/flavours/',
            transformResponse: (response: Flavour[]) => response,
            // Cache for 5 minutes (300 seconds)
            keepUnusedDataFor: 300,
        }),
        // Every active flavour, the ones not on sale yet included (flagged
        // `coming_soon`). For the pages that show flavours off only: the box
        // builders use getFlavours, which never offers them.
        getShowcaseFlavours: builder.query<Flavour[], void>({
            query: () => '/flavours/?include=coming_soon',
            keepUnusedDataFor: 300,
        }),
    }),
});

export const {
    useGetFlavoursQuery,
    useGetShowcaseFlavoursQuery,
} = flavourApiSlice;

export default flavourApiSlice;
