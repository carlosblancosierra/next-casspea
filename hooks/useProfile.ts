import { useAppSelector } from '@/redux/hooks';
import { selectAuthLoading, selectIsAuthenticated } from '@/redux/features/auth/authSlice';
import { useGetProfileQuery } from '@/redux/features/auth/authApiSlice';

/**
 * The signed-in user, or undefined for guests. `isLoading` stays true until
 * we know: first while the session is restored, then while the profile loads.
 */
export default function useProfile() {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const authLoading = useAppSelector(selectAuthLoading);
	const { data, isLoading, isFetching, isError } = useGetProfileQuery(undefined, {
		skip: !isAuthenticated,
	});

	return {
		profile: isAuthenticated ? data : undefined,
		isAuthenticated,
		isStaff: Boolean(isAuthenticated && data?.is_staff),
		isLoading: authLoading || (isAuthenticated && (isLoading || (isFetching && !data))),
		isError,
	};
}
