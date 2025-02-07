'use client';

import { redirect } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice';

interface Props {
	children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	if (!isAuthenticated) {
		redirect('/auth/login');
	}

	return <>{children}</>;
}
