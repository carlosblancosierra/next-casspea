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
        label: any;
      },
      { order_id: string }
    >({
      query: ({ order_id }) => ({
        url: `/royalmail/orders/${order_id}/create/`,
        method: 'POST',
      }),
      // Optional: Display toast notifications on success/error.
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Royal Mail order created successfully');
        } catch (error: any) {
          toast.error('Failed to create Royal Mail order');
        }
      },
    }),

    // Query to download the Royal Mail shipping label PDF
    downloadRoyalMailLabel: builder.query<Blob, { order_id: string }>({
      query: ({ order_id }) => ({
        url: `/royalmail/orders/${order_id}/label/`,
        method: 'GET',
      }),
      transformResponse: async (response: any) => {
        return await response.blob();
      },
    }),
  }),
});

export const {
  useCreateRoyalMailOrderMutation,
  useDownloadRoyalMailLabelQuery,
  useLazyDownloadRoyalMailLabelQuery
} = royalMailApiSlice;