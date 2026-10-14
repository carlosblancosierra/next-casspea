'use client';

import { useEffect } from 'react';
import { captureError } from '@/utils/analytics';

/**
 * Last resort for errors in the root layout itself. It replaces the whole
 * document, so it has to render its own <html> and can't rely on the app's
 * styles having loaded.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		captureError(error, { digest: error.digest, boundary: 'global' });
	}, [error]);

	return (
		<html lang='en'>
			<body style={{ fontFamily: 'sans-serif', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
				<div style={{ textAlign: 'center', padding: 24 }}>
					<h1>Something went wrong</h1>
					<p>Sorry about that. Please try again.</p>
					<button type='button' onClick={reset} style={{ padding: '8px 16px', cursor: 'pointer' }}>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
