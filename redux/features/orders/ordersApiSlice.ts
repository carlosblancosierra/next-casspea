import { apiSlice } from '@/redux/services/apiSlice';
import { Order, OrderSummary, Paginated } from '@/types/orders';

export interface OrdersQueryParams {
    status?: string;
    start_date?: string;
    end_date?: string;
    min_total?: number;
    max_total?: number;
    search?: string;
    ordering?: string;
}

export interface OrdersSummaryParams {
    start_date?: string;
    end_date?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
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
        getOrders: builder.query<Order[], OrdersQueryParams | void>({
            query: (params?: OrdersQueryParams) => ({
                url: '/orders/',
                params: params || undefined,
            }),
            providesTags: ['Orders'],
        }),
        // Light paginated rows for the orders table. The drawer pulls the full
        // order from getOrder on demand, so the table never carries the graph.
        getOrdersSummary: builder.query<Paginated<OrderSummary>, OrdersSummaryParams | void>({
            query: (params?: OrdersSummaryParams) => ({
                url: '/orders/summary/',
                params: params || undefined,
            }),
            providesTags: ['Orders'],
            keepUnusedDataFor: 300,
        }),
        getOrder: builder.query<Order, string>({
            query: (orderId: string) => ({ url: `/orders/${orderId}/` }),
            providesTags: ['Orders'],
            keepUnusedDataFor: 300,
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
    useGetOrdersSummaryQuery,
    useGetOrderQuery,
    useSendTrackingCodeMailMutation,
    useGetDailyUnitsSoldQuery,
} = ordersApiSlice;

export default ordersApiSlice;
