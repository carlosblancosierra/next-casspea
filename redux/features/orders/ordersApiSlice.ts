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

export interface DailyUnitsSold {
    all_sold: number;
    ecommerce_v2_sold: number;
    days: {
        date: string;
        units_sold: number;
    }[];
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
        sendTrackingCodeMail: builder.mutation<{ success: boolean }, { order_id: string }>({
            query: ({ order_id }) => ({
                url: '/orders/send-tracking-code-mail/',
                method: 'POST',
                body: { order_id },
            }),
        }),
        getDailyUnitsSold: builder.query<DailyUnitsSold, void>({
            query: () => ({
                url: '/orders/daily-units-sold/',
            }),
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useSendTrackingCodeMailMutation,
    useGetDailyUnitsSoldQuery,
} = ordersApiSlice;

export default ordersApiSlice;
