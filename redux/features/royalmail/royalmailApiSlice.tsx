import { apiSlice } from '@/redux/services/apiSlice';
import axios from 'axios';
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
    downloadRoyalMailLabel: builder.mutation<Blob, { order_id: string }>({
      queryFn: async ({ order_id }) => {
        try {
          const response = await axios({
            url: `/api/royalmail/orders/${order_id}/label/`,
            method: 'GET',
            responseType: 'blob',
            headers: {
              'Accept': 'application/pdf',
            },
          });

          return { data: response.data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status,
              data: error.response?.data || 'Failed to download label'
            }
          };
        }
      }
    }),
  }),
});

export const {
  useCreateRoyalMailOrderMutation,
  useDownloadRoyalMailLabelMutation,
} = royalMailApiSlice;