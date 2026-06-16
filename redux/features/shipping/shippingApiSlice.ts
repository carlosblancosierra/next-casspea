import { apiSlice } from '@/redux/services/apiSlice';
import { ShippingCompany } from '@/types/shipping';

const shippingApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getShippingOptions: builder.query<ShippingCompany[], void>({
            query: () => '/shipping/options/',
            transformResponse: (response: ShippingCompany[]) => response,
            // Prices include the cart-total shipping discount, so this must be
            // refetched whenever the cart changes (cart mutations invalidate it).
            providesTags: ['ShippingOptions'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                } catch (err) {
                    console.error('Error fetching shipping options:', err);
                }
            },
        }),
    }),
});

export const {
    useGetShippingOptionsQuery,
} = shippingApiSlice;

export default shippingApiSlice;
