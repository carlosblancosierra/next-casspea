import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from '@/config/sentry';

// Browser side: uncaught errors, unhandled promise rejections and anything
// passed to captureError() in utils/analytics.ts.
Sentry.init({
	...sentryOptions,
	ignoreErrors: [
		// Browser extensions and flaky mobile connections, not our bugs.
		'ResizeObserver loop limit exceeded',
		'ResizeObserver loop completed with undelivered notifications',
		'Non-Error promise rejection captured',
	],
	denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-web-extension:\/\//],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
