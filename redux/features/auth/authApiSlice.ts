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
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          dispatch(setAuth());
        } catch {
          // login failed
        }
      },
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
} = authApiSlice;