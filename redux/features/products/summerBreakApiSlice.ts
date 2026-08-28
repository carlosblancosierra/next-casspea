import { apiSlice } from '@/redux/services/apiSlice';

export interface SummerBreakBox {
    units: number;
    slug: string;
    exists: boolean;
    active: boolean;
    sold_out: boolean;
    price: string | null;
    compare_at_price: string | null;
    stripe_price_id: string | null;
}

export interface SummerBreakStatus {
    category: { exists: boolean; published: boolean; slug: string };
    boxes: SummerBreakBox[];
    landing_path: string;
}

export type SummerBreakAction = 'load' | 'publish' | 'deactivate';

export interface SummerBreakActionResult {
    ok: boolean;
    action: string;
    dry_run?: boolean;
    error?: string;
    output: string;
    status?: SummerBreakStatus;
}

const ADMIN_URL = '/products/admin/summer-break-boxes/';

const summerBreakApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSummerBreakStatus: builder.query<SummerBreakStatus, void>({
            query: () => ADMIN_URL,
        }),
        runSummerBreakAction: builder.mutation<SummerBreakActionResult, { action: SummerBreakAction; dry_run?: boolean }>({
            query: (body) => ({
                url: ADMIN_URL,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetSummerBreakStatusQuery,
    useRunSummerBreakActionMutation,
} = summerBreakApiSlice;

export default summerBreakApiSlice;
