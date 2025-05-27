import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setAuth, logout } from '../features/auth/authSlice';
import { Mutex } from 'async-mutex';
import router from 'next/router';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
	baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api/front`,
	prepareHeaders: (headers) => {
		const token = localStorage.getItem('access');
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	await mutex.waitForUnlock();
	let result = await baseQuery(args, api, extraOptions);
	
	// Helper function to handle logout
	const handleLogout = () => {
		api.dispatch(logout());
		router.push('/auth/login');
	};
	
	if (
		(result.error && (result.error.status === 401 || result.error.status === 'PARSING_ERROR')) &&
		(typeof args !== 'string' && args.url !== '/users/jwt/refresh/')
	) {
		if (!mutex.isLocked()) {
			const release = await mutex.acquire();
			try {
				const refreshToken = localStorage.getItem('refresh');
				
				// If no refresh token exists, logout
				if (!refreshToken) {
					handleLogout();
					return result;
				}
								
				// Use raw baseQuery first time to fetch new tokens
				// This prevents circular dependency with the injected endpoint
				const refreshResult = await baseQuery(
					{
						url: '/users/jwt/refresh/',
						method: 'POST',
						body: { refresh: refreshToken },
					},
					api,
					extraOptions
				);

				let data = refreshResult.data;
				// Handle string data (parse JSON if needed)
				if (typeof data === 'string') {
					try {
						data = JSON.parse(data);
					} catch (err) {
						// If parsing fails, logout
						handleLogout();
						return { error: refreshResult.error, data: undefined, meta: refreshResult.meta };
					}
				}

				// If we have valid refresh data, update tokens and retry
				const refreshData = data as { access: string, refresh: string };
				if (refreshData) {
					localStorage.setItem('access', refreshData.access);
					localStorage.setItem('refresh', refreshData.refresh);
					api.dispatch(setAuth());

					// Retry original request with new token
					result = await baseQuery(args, api, extraOptions);
				} else {
					// No valid data from refresh attempt
					handleLogout();
				}
			} finally {
				release();
			}
		} else {
			await mutex.waitForUnlock();
			result = await baseQuery(args, api, extraOptions);
		}
	}
	return result;
};

export const apiSlice = createApi({
	reducerPath: 'api',
	// Use the new middleware function as our baseQuery.
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Cart', 'CheckoutSession', 'Addresses', 'Templates', 'Flavours', 'Products', 'UserDesigns', 'Orders'],
	endpoints: builder => ({}),
});
