import { apiSlice } from '@/redux/services/apiSlice';
import { toast } from 'react-toastify';

export const royalMailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to create a Royal Mail order
    createRoyalMailOrder: builder.mutation<
      {
        success: boolean;
        tracking_number: string;
        order_identifier: string;
        // Never consumed on the frontend; label PDFs come from the
        // separate download endpoint below.
        label: unknown;
      },
      { order_id: string }
    >({
      query: ({ order_id }) => ({
        url: `/royalmail/orders/${order_id}/create/`,
        method: 'POST',
      }),
      // Invalidate the orders cache to trigger a refetch
      invalidatesTags: ['Orders'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Royal Mail order created successfully');
        } catch {
          toast.error('Failed to create Royal Mail order');
        }
      },
    }),
    // Label PDFs are downloaded with fetch in useOrderActions. The unused
    // downloadRoyalMailLabel that lived here called the API through axios with
    // a relative URL and no token, so it could never work (BUG-16).
  }),
});

export const {
  useCreateRoyalMailOrderMutation,
} = royalMailApiSlice;