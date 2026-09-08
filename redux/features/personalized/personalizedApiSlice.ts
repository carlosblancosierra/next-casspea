import { apiSlice } from '@/redux/services/apiSlice';
import { ChocolateTemplateDetail } from '@/types/personalized';

// Query Parameters interfaces
export interface TemplateQueryParams {
  search?: string;
  ordering?: string;
}

// Payload for /personalized/send-request/ (see PersonalizedForm)
export interface PersonalizedRequest {
  template_slug: string;
  email: string;
  comments: string;
  custom_design_names: string[];
  flavours: number[];
  quantity: number;
}

const personalizedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // The list endpoint uses the detail serializer on the backend, so
    // every template already includes its layers.
    getTemplates: builder.query<ChocolateTemplateDetail[], TemplateQueryParams | void>({
      query: (params?: TemplateQueryParams) => ({
        url: '/personalized/templates/',
        params: params || undefined,
      }),
      providesTags: ['Templates']
    }),

    getTemplateDetail: builder.query<ChocolateTemplateDetail, string>({
      query: (slug) => `/personalized/templates/${slug}/`,
      providesTags: (_result, _error, slug) => [{ type: 'Templates' as const, id: slug }]
    }),

    sendRequest: builder.mutation<void, PersonalizedRequest>({
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
  useSendRequestMutation,
} = personalizedApiSlice;

export default personalizedApiSlice;
