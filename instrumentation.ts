import * as Sentry from '@sentry/nextjs';

// Server side: errors thrown while rendering pages and in route handlers.
export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
		const { sentryOptions } = await import('@/config/sentry');
		Sentry.init(sentryOptions);
	}
}

export const onRequestError = Sentry.captureRequestError;
