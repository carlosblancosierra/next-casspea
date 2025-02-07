import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { setAuth, logout } from '../features/auth/authSlice';
import { Mutex } from 'async-mutex';

function getCookie(name: string) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Check if this cookie string begins with the name we want
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
	baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
	credentials: 'include',
	prepareHeaders: (headers) => {
		const csrfToken = getCookie('csrftoken');
		if (csrfToken) {
			headers.set('X-CSRFToken', csrfToken);
		}
		const token = localStorage.getItem('access');
		console.log('Preparing headers, access token:', token ? 'exists' : 'not found');
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
			console.log('Authorization header set with token:', token.substring(0, 10) + '...');
		}
		return headers;
	},
});
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	console.log('Making API request:', args);
	await mutex.waitForUnlock();
	let result = await baseQuery(args, api, extraOptions);
	console.log('API response:', result);

	if (result.error && result.error.status === 401) {
		console.log('401 error detected, attempting token refresh');
		if (!mutex.isLocked()) {
			const release = await mutex.acquire();
			try {
				const refreshToken = localStorage.getItem('refresh');
				if (refreshToken) {
					const refreshResult = await baseQuery(
						{
							url: '/users/jwt/refresh/',
							method: 'POST',
							body: { refresh: refreshToken },
						},
						api,
						extraOptions
					);

					if (refreshResult.data) {
						const { access } = refreshResult.data as { access: string };
						localStorage.setItem('access', access);
						api.dispatch(setAuth());

						result = await baseQuery(args, api, extraOptions);
					} else {
						api.dispatch(logout());
					}
				} else {
					api.dispatch(logout());
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

const baseQueryWithCsrf: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	// First, run the original request with reauthentication logic.
	let result = await baseQueryWithReauth(args, api, extraOptions);

	// Check for a 403 error that might be a CSRF verification failure.
	if (result.error && result.error.status === 403) {
		const errorDetails = (result.error.data as any)?.detail || '';
		if (typeof errorDetails === 'string' && errorDetails.toLowerCase().includes('csrf')) {
			console.warn("CSRF error detected:", errorDetails);

			// Delete the existing CSRF cookie (if it's not HttpOnly).
			document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

			// Request a fresh CSRF token via the /csrf/ endpoint.
			const csrfResult = await baseQuery({ url: '/csrf/', method: 'GET' }, api, extraOptions);

			if (csrfResult.data) {
				// Retry the original request exactly once with the updated CSRF token.
				result = await baseQueryWithReauth(args, api, extraOptions);
			} else {
				console.error("Unable to refresh CSRF token.", csrfResult.error);
			}
		}
	}
	return result;
};

export const apiSlice = createApi({
	reducerPath: 'api',
	// Use the new middleware function as our baseQuery.
	baseQuery: baseQueryWithCsrf,
	tagTypes: ['Cart', 'CheckoutSession', 'Addresses', 'Templates', 'Flavours', 'Products', 'UserDesigns', 'Orders'],
	endpoints: builder => ({}),
});
