'use client';

import { useState } from 'react';
import type { PublicClientApplication } from '@azure/msal-browser';

let msalPromise: Promise<PublicClientApplication> | null = null;

/** MSAL is ~100 kB, so it is only loaded when someone clicks the button. */
function getMsal(clientId: string): Promise<PublicClientApplication> {
	if (!msalPromise) {
		msalPromise = import('@azure/msal-browser').then(async ({ PublicClientApplication }) => {
			const app = new PublicClientApplication({
				auth: {
					clientId,
					// Work, school and personal Microsoft accounts.
					authority: 'https://login.microsoftonline.com/common',
					// Must be registered as a "Single-page application" redirect
					// URI in the Entra app registration.
					redirectUri: `${window.location.origin}/auth/login`,
				},
				cache: { cacheLocation: 'sessionStorage' },
			});
			await app.initialize();
			return app;
		});
		msalPromise.catch(() => {
			msalPromise = null;
		});
	}
	return msalPromise;
}

function MicrosoftLogo() {
	return (
		<svg width="20" height="20" viewBox="0 0 21 21" aria-hidden="true">
			<rect x="1" y="1" width="9" height="9" fill="#f25022" />
			<rect x="11" y="1" width="9" height="9" fill="#7fba00" />
			<rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
			<rect x="11" y="11" width="9" height="9" fill="#ffb900" />
		</svg>
	);
}

interface Props {
	clientId: string;
	disabled?: boolean;
	onIdToken: (idToken: string) => void;
	onError: (message: string) => void;
}

export default function MicrosoftSignInButton({ clientId, disabled, onIdToken, onError }: Props) {
	const [busy, setBusy] = useState(false);

	const signIn = async () => {
		setBusy(true);
		try {
			const msal = await getMsal(clientId);
			const result = await msal.loginPopup({
				scopes: ['openid', 'profile', 'email'],
				prompt: 'select_account',
			});
			onIdToken(result.idToken);
		} catch (error) {
			const code = (error as { errorCode?: string })?.errorCode;
			if (code !== 'user_cancelled') {
				onError('Microsoft sign-in did not work. Please try again.');
			}
		} finally {
			setBusy(false);
		}
	};

	return (
		<button
			type="button"
			onClick={signIn}
			disabled={disabled || busy}
			className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
		>
			<MicrosoftLogo />
			Continue with Microsoft
		</button>
	);
}
