import { apiSlice } from '@/redux/services/apiSlice';
import { Flavour } from '@/types/flavours';
import { setFlavours } from '@/redux/features/flavour/flavourSlice';

const flavourApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFlavours: builder.query<Flavour[], void>({
            query: () => '/flavours/',
            transformResponse: (response: Flavour[]) => response,
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setFlavours(data));
                } catch (err) {
                    console.error('Error fetching flavours:', err);
                }
            },
        }),
    }),
});

export const {
    useGetFlavoursQuery,
} = flavourApiSlice;

export default flavourApiSlice;
