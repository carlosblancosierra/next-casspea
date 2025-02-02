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

          // For attachment downloads, the type might be 'text/html' initially
          // We'll check the Content-Disposition header instead
          const contentType = response.headers['content-type'];
          const contentDisposition = response.headers['content-disposition'];
          
          if (!contentDisposition?.includes('attachment') || !contentType?.includes('pdf')) {
            throw new Error('Invalid response format - Expected PDF attachment');
          }

          return { data: response.data };
        } catch (error: any) {
          // Handle specific error cases
          const errorMessage = error.response?.status === 404
            ? `Label not found for order ${order_id}`
            : 'Failed to download shipping label';

          toast.error(errorMessage);
          
          return {
            error: {
              status: error.response?.status || 500,
              data: errorMessage
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