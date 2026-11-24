import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { authApiSlice } from '@/redux/features/auth/authApiSlice';
import { destinationAfterSignIn } from '@/utils/signIn';

/**
 * Call once the tokens are stored: loads the profile and sends staff to the
 * back office and customers to their account (or to ?next= if given).
 */
export default function useAfterSignIn() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	return useCallback(async () => {
		let isStaff = false;
		try {
			const profile = await dispatch(
				authApiSlice.endpoints.getProfile.initiate(undefined, { forceRefetch: true })
			).unwrap();
			isStaff = profile.is_staff;
		} catch {
			// Fall through to the customer destination; staff pages check again.
		}
		router.push(destinationAfterSignIn(isStaff, window.location.search));
	}, [dispatch, router]);
}
