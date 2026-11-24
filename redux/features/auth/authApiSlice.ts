// src/services/authApiSlice.ts
import { apiSlice } from '@/redux/services/apiSlice';
import { setAuth, logout } from '@/redux/features/auth/authSlice';

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

export type SocialProvider = 'google' | 'microsoft';

/** GET /api/users/profile/ — the signed-in user. */
export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

function storeTokens(data: LoginResponse) {
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, Credentials>({
      query: creds => ({
        url: '/users/jwt/create/',
        method: 'POST',
        body: creds,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          storeTokens(data);
          dispatch(setAuth());
        } catch {
          // login failed
        }
      },
      invalidatesTags: ['Profile'],
    }),
    /** Sign in with an ID token from Google Identity Services or MSAL. */
    socialLogin: builder.mutation<LoginResponse, { provider: SocialProvider; id_token: string }>({
      query: ({ provider, id_token }) => ({
        url: `/users/social/${provider}/`,
        method: 'POST',
        body: { id_token },
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          storeTokens(data);
          dispatch(setAuth());
        } catch {
          // the caller shows the error
        }
      },
      invalidatesTags: ['Profile'],
    }),
    getProfile: builder.query<Profile, void>({
      query: () => '/users/profile/',
      providesTags: ['Profile'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/users/jwt/logout/',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch {
          // ignore
        } finally {
          dispatch(logout());
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      },
      invalidatesTags: ['Profile'],
    }),
    verify: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: '/users/jwt/verify/',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyMutation,
  useSocialLoginMutation,
  useGetProfileQuery,
} = authApiSlice;