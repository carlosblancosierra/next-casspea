'use client';

import { redirect } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '@/redux/features/auth/authSlice';
import Spinner from '@/components/common/Spinner';

interface Props {
	children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const isLoading = useAppSelector(selectAuthLoading);

	// Wait for the initial session restore to finish before deciding.
	// Otherwise authenticated users get bounced to /login on every reload
	// or navigation, because auth state starts out false until it's restored.
	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20">
				<Spinner md />
			</div>
		);
	}

	if (!isAuthenticated) {
		redirect('/auth/login');
	}

	return <>{children}</>;
}
