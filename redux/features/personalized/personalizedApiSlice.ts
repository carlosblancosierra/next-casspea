import { apiSlice } from '@/redux/services/apiSlice';
import { 
  ChocolateTemplateBase, 
  ChocolateTemplateDetail,
  UserChocolateDesign
} from '@/types/personalized';

// Query Parameters interfaces
export interface TemplateQueryParams {
  search?: string;
  ordering?: string;
}

export interface UserDesignQueryParams {
  active?: boolean;
  featured?: boolean;
  created_after?: string;
  created_before?: string;
}

// Create Design Request interface
export interface CreateDesignRequest {
  template_slug: string;
  chosen_layers: {
    layer_type: string;
    color_slug: string;
    order: number;
  }[];
}

const personalizedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Templates
    getTemplates: builder.query<ChocolateTemplateBase[], TemplateQueryParams | void>({
      query: (params?: TemplateQueryParams) => ({
        url: '/personalized/templates/',
        params: params || undefined,
      }),
      providesTags: ['Templates']
    }),

    getTemplateDetail: builder.query<ChocolateTemplateDetail, string>({
      query: (slug) => `/personalized/templates/${slug}/`,
      providesTags: (_result, _error, slug) => [{ type: 'Template', id: slug }]
    }),

    // User Designs
    getUserDesigns: builder.query<UserChocolateDesign[], UserDesignQueryParams | void>({
      query: (params?: UserDesignQueryParams) => ({
        url: '/personalized/designs/',
        params: params || undefined,
      }),
      providesTags: ['UserDesigns']
    }),

    getUserDesignDetail: builder.query<UserChocolateDesign, number>({
      query: (id) => `/personalized/designs/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'UserDesign', id }]
    }),

    createUserDesign: builder.mutation<UserChocolateDesign, CreateDesignRequest>({
      query: (design) => ({
        url: '/personalized/designs/',
        method: 'POST',
        body: design,
      }),
      invalidatesTags: ['UserDesigns']
    }),

    updateUserDesign: builder.mutation<UserChocolateDesign, Partial<UserChocolateDesign> & { id: number }>({
      query: ({ id, ...design }) => ({
        url: `/personalized/designs/${id}/`,
        method: 'PATCH',
        body: design,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'UserDesign', id },
        'UserDesigns'
      ]
    }),

    deleteUserDesign: builder.mutation<void, number>({
      query: (id) => ({
        url: `/personalized/designs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserDesigns']
    }),

    sendRequest: builder.mutation<void, CreateDesignRequest>({
      query: (design) => ({
        url: '/personalized/send-request/',
        method: 'POST',
        body: design,
      }),
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateDetailQuery,
  useGetUserDesignsQuery,
  useGetUserDesignDetailQuery,
  useCreateUserDesignMutation,
  useUpdateUserDesignMutation,
  useDeleteUserDesignMutation,
  useSendRequestMutation,
} = personalizedApiSlice;

export default personalizedApiSlice;