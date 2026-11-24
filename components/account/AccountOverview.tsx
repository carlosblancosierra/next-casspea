'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RequireAuth } from '@/components/utils';
import { useProfile } from '@/hooks';
import { useLogoutMutation } from '@/redux/features/auth/authApiSlice';
import Spinner from '@/components/common/Spinner';

const STAFF_LINKS = [
	{ href: '/orders', label: 'Orders' },
	{ href: '/admin/client-setups', label: 'Client setups' },
	{ href: '/admin/experiments', label: 'Experiments' },
	{ href: '/addresses/stats', label: 'Postcode stats' },
];

function Overview() {
	const router = useRouter();
	const { profile, isStaff, isLoading } = useProfile();
	const [logout, { isLoading: signingOut }] = useLogoutMutation();

	if (isLoading || !profile) {
		return (
			<div className="flex justify-center items-center py-20">
				<Spinner md />
			</div>
		);
	}

	const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ');

	const signOut = async () => {
		await logout();
		router.push('/');
	};

	return (
		<div className="mx-auto max-w-2xl px-6 py-12 text-primary-text dark:text-primary-text-light">
			<h1 className="text-2xl font-bold">{name ? `Hello, ${profile.first_name || name}` : 'Your account'}</h1>
			<p className="mt-1">{profile.email}</p>

			{isStaff && (
				<section className="mt-8">
					<h2 className="text-lg font-semibold">Back office</h2>
					<ul className="mt-2 space-y-1">
						{STAFF_LINKS.map(link => (
							<li key={link.href}>
								<Link href={link.href} className="underline">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			<section className="mt-8">
				<h2 className="text-lg font-semibold">Your orders</h2>
				<p className="mt-2">
					Order history is coming soon. Meanwhile, your confirmation email has
					everything about each order, and{' '}
					<Link href="/contact" className="underline">
						we are happy to help
					</Link>
					.
				</p>
			</section>

			<button
				type="button"
				onClick={signOut}
				disabled={signingOut}
				className="mt-10 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 disabled:opacity-60"
			>
				Sign out
			</button>
		</div>
	);
}

/** The customer's account. Order history and addresses come next. */
export default function AccountOverview() {
	return (
		<RequireAuth>
			<Overview />
		</RequireAuth>
	);
}
