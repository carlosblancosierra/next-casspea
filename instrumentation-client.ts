import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from '@/config/sentry';
import { installChunkReload } from '@/utils/chunkReload';

// A tab left open across a deploy asks for chunks that no longer exist; reload
// it once instead of leaving the click dead. See utils/chunkReload.ts.
installChunkReload();

// Browser side: uncaught errors, unhandled promise rejections and anything
// passed to captureError() in utils/analytics.ts.
Sentry.init({
	...sentryOptions,
	ignoreErrors: [
		// Browser extensions and flaky mobile connections, not our bugs.
		'ResizeObserver loop limit exceeded',
		'ResizeObserver loop completed with undelivered notifications',
		'Non-Error promise rejection captured',
		// Android Google app / in-app WebView bridge, not our code. It was 373
		// of the 452 people with a JS error in PostHog over 30 days.
		'Java object is gone',
	],
	denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-web-extension:\/\//],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
