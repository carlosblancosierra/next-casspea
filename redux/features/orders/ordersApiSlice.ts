import { apiSlice } from '@/redux/services/apiSlice';

export interface OrdersQueryParams {
    status?: string;
    start_date?: string;
    end_date?: string;
    min_total?: number;
    max_total?: number;
    search?: string;
    ordering?: string;
}

const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrders: builder.query<any[], OrdersQueryParams | void>({
            query: (params?: OrdersQueryParams) => ({
                url: '/orders/',
                params: params || undefined,
            }),
            providesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
} = ordersApiSlice;

export default ordersApiSlice;
