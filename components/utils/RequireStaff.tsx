'use client';

import Link from 'next/link';
import RequireAuth from './RequireAuth';
import Spinner from '@/components/common/Spinner';
import { useProfile } from '@/hooks';

interface Props {
	children: React.ReactNode;
}

function StaffOnly({ children }: Props) {
	const { isStaff, isLoading } = useProfile();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20">
				<Spinner md />
			</div>
		);
	}

	if (!isStaff) {
		return (
			<div className="mx-auto max-w-md px-6 py-20 text-center">
				<h1 className="text-2xl font-bold text-primary-text dark:text-primary-text-light">
					This page is for the CassPea team
				</h1>
				<p className="mt-3 text-primary-text dark:text-primary-text-light">
					Your account does not have access to it.
				</p>
				<Link href="/account" className="mt-6 inline-block underline">
					Go to your account
				</Link>
			</div>
		);
	}

	return <>{children}</>;
}

/**
 * For back-office pages: signed out → login, signed in but not staff → a
 * "not for you" message. This only hides the page; the API checks staff
 * rights on every request.
 */
export default function RequireStaff({ children }: Props) {
	return (
		<RequireAuth>
			<StaffOnly>{children}</StaffOnly>
		</RequireAuth>
	);
}
