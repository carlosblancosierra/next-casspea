// src/services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { setAuth, logout } from '../features/auth/authSlice';

const mutex = new Mutex();

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    // Refresh 1 minute before actual expiry
    return Date.now() >= exp * 1000 - 60_000;
  } catch {
    return true;
  }
}

const baseFetch = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
  credentials: 'include',
  prepareHeaders(headers) {
    // CSRF
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
    // JWT
    const token = localStorage.getItem('access');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1) Proactive refresh if access-token is about to expire
  const accessToken = localStorage.getItem('access');
  if (
    accessToken &&
    isTokenExpired(accessToken) &&
    !mutex.isLocked()
  ) {
    const release = await mutex.acquire();
    try {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        const refreshResult = await baseFetch(
          {
            url: '/users/jwt/refresh/',
            method: 'POST',
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          const { access, refresh } = refreshResult.data as {
            access: string;
            refresh?: string;
          };
          localStorage.setItem('access', access);
          if (refresh) localStorage.setItem('refresh', refresh);
          api.dispatch(setAuth());
        } else {
          api.dispatch(logout());
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      } else {
        api.dispatch(logout());
      }
    } finally {
      release();
    }
  }

  await mutex.waitForUnlock();

  // 2) Send original request
  let result = await baseFetch(args, api, extraOptions);

  // 3) On 401, try one on-demand refresh
  if (
    result.error?.status === 401 &&
    !String((args as FetchArgs).url).includes('/users/jwt')
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const refreshResult = await baseFetch(
            {
              url: '/users/jwt/refresh/',
              method: 'POST',
              body: { refresh: refreshToken },
            },
            api,
            extraOptions
          );
          if (refreshResult.data) {
            const { access, refresh } = refreshResult.data as {
              access: string;
              refresh?: string;
            };
            localStorage.setItem('access', access);
            if (refresh) localStorage.setItem('refresh', refresh);
            api.dispatch(setAuth());
            // retry original
            result = await baseFetch(args, api, extraOptions);
          } else {
            api.dispatch(logout());
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseFetch(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Cart',
    'CheckoutSession',
    'Addresses',
    'Templates',
    'Flavours',
    'Products',
    'UserDesigns',
    'Orders',
  ],
  endpoints: builder => ({})
});