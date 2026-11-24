'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSocialLoginMutation, type SocialProvider } from '@/redux/features/auth/authApiSlice';
import { useAfterSignIn } from '@/hooks';
import GoogleSignInButton from './GoogleSignInButton';
import MicrosoftSignInButton from './MicrosoftSignInButton';

function errorMessage(error: unknown): string {
	const data = (error as { data?: { detail?: unknown } })?.data;
	if (typeof data?.detail === 'string') return data.detail;
	if ((error as { status?: unknown })?.status === 429) {
		return 'Too many attempts. Please wait a minute and try again.';
	}
	return 'We could not sign you in. Please try again.';
}

/**
 * "Continue with Google / Microsoft". The provider gives us an ID token, the
 * API checks it and answers with our own session tokens.
 */
export default function SocialSignIn() {
	const [socialLogin, { isLoading }] = useSocialLoginMutation();
	const afterSignIn = useAfterSignIn();
	const [error, setError] = useState<string | null>(null);

	// Public client IDs. A provider without one is simply not shown.
	const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
	const MICROSOFT_CLIENT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;

	if (!GOOGLE_CLIENT_ID && !MICROSOFT_CLIENT_ID) return null;

	const signIn = (provider: SocialProvider) => async (idToken: string) => {
		setError(null);
		try {
			await socialLogin({ provider, id_token: idToken }).unwrap();
			toast.success('Logged in');
			await afterSignIn();
		} catch (err) {
			setError(errorMessage(err));
		}
	};

	return (
		<div className="space-y-3">
			{GOOGLE_CLIENT_ID && (
				<GoogleSignInButton
					clientId={GOOGLE_CLIENT_ID}
					onIdToken={signIn('google')}
					onError={setError}
				/>
			)}
			{MICROSOFT_CLIENT_ID && (
				<MicrosoftSignInButton
					clientId={MICROSOFT_CLIENT_ID}
					disabled={isLoading}
					onIdToken={signIn('microsoft')}
					onError={setError}
				/>
			)}
			{error && (
				<p role="alert" className="text-sm text-red-600 dark:text-red-400">
					{error}
				</p>
			)}
			<div className="relative py-2">
				<div className="absolute inset-0 flex items-center" aria-hidden="true">
					<div className="w-full border-t border-gray-300 dark:border-gray-600" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-main-bg dark:bg-main-bg-dark px-2 text-primary-text dark:text-primary-text-light">
						or with your email
					</span>
				</div>
			</div>
		</div>
	);
}
