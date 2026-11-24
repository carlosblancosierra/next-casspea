'use client';

import { useEffect, useRef } from 'react';

/** The bits of Google Identity Services we use. */
interface GoogleIdentity {
	accounts: {
		id: {
			initialize(options: {
				client_id: string;
				callback: (response: { credential?: string }) => void;
				ux_mode?: 'popup' | 'redirect';
			}): void;
			renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
		};
	};
}

declare global {
	interface Window {
		google?: GoogleIdentity;
	}
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
	if (window.google?.accounts?.id) return Promise.resolve();
	if (!scriptPromise) {
		scriptPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = SCRIPT_SRC;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => {
				scriptPromise = null;
				reject(new Error('Could not load Google sign-in'));
			};
			document.head.appendChild(script);
		});
	}
	return scriptPromise;
}

interface Props {
	clientId: string;
	onIdToken: (idToken: string) => void;
	onError: (message: string) => void;
}

/**
 * Google's own "Continue with Google" button (their branding rules require
 * it). Hands the ID token to `onIdToken`; the API checks it.
 */
export default function GoogleSignInButton({ clientId, onIdToken, onError }: Props) {
	const container = useRef<HTMLDivElement>(null);
	// Keep the latest callbacks without re-rendering Google's button.
	const handlers = useRef({ onIdToken, onError });
	handlers.current = { onIdToken, onError };

	useEffect(() => {
		let cancelled = false;
		loadScript()
			.then(() => {
				if (cancelled || !container.current || !window.google) return;
				window.google.accounts.id.initialize({
					client_id: clientId,
					ux_mode: 'popup',
					callback: response => {
						if (response.credential) handlers.current.onIdToken(response.credential);
						else handlers.current.onError('Google sign-in was cancelled.');
					},
				});
				window.google.accounts.id.renderButton(container.current, {
					type: 'standard',
					theme: 'outline',
					size: 'large',
					text: 'continue_with',
					shape: 'rectangular',
					width: container.current.offsetWidth || 320,
				});
			})
			.catch(() => handlers.current.onError('Google sign-in is not available right now.'));
		return () => {
			cancelled = true;
		};
	}, [clientId]);

	return <div ref={container} className="flex w-full justify-center min-h-[44px]" />;
}
