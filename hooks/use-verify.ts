import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, logout, finishInitialLoad } from '@/redux/features/auth/authSlice';

/** True if the JWT exists and hasn't expired yet. */
function isTokenValid(token: string | null): token is string {
	if (!token) return false;
	try {
		const { exp } = jwtDecode<{ exp: number }>(token);
		return typeof exp === 'number' && Date.now() < exp * 1000;
	} catch {
		return false;
	}
}

/**
 * Restore the auth session on app load.
 *
 * Runs once (mounted in <Setup/>). Previously this was disabled, so every full
 * page load / navigation started unauthenticated and RequireAuth bounced the
 * user to /login even with valid tokens in localStorage. Now:
 *  - valid access token       -> mark authenticated immediately
 *  - expired access + refresh  -> refresh, then authenticate (or log out)
 *  - nothing                   -> stay a guest
 * Either way we clear the initial-loading flag so RequireAuth can decide.
 */
export default function useVerify() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const access = localStorage.getItem('access');
		const refresh = localStorage.getItem('refresh');

		if (isTokenValid(access)) {
			dispatch(setAuth());
			dispatch(finishInitialLoad());
			return;
		}

		if (refresh) {
			fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/jwt/refresh/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ refresh }),
			})
				.then(res => (res.ok ? res.json() : Promise.reject(new Error('refresh failed'))))
				.then((data: { access: string; refresh?: string }) => {
					localStorage.setItem('access', data.access);
					if (data.refresh) localStorage.setItem('refresh', data.refresh);
					dispatch(setAuth());
				})
				.catch(() => {
					localStorage.removeItem('access');
					localStorage.removeItem('refresh');
					dispatch(logout());
				})
				.finally(() => dispatch(finishInitialLoad()));
			return;
		}

		dispatch(finishInitialLoad());
	}, [dispatch]);
}
