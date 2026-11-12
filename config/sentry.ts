import type { BrowserOptions, NodeOptions } from '@sentry/nextjs';

/**
 * Sentry options shared by the browser and the Next.js server.
 *
 * Everything is driven by build-time env vars, set in Amplify (App settings >
 * Environment variables). NEXT_PUBLIC_ ones are inlined into the bundles at
 * build time, which is what Amplify needs: its server runtime does not see the
 * console's env vars.
 *
 *   NEXT_PUBLIC_SENTRY_DSN                 built in for Amplify builds (next.config.js); set it to override
 *   NEXT_PUBLIC_SENTRY_ENVIRONMENT         defaults to "production"
 *   NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE  share of page loads traced, 0..1 (default 0)
 *
 * Sentry sets no cookies and session replay is off, so it runs whatever the
 * visitor answers in Cookiebot. PostHog stays the place for replays.
 */
export const sentryOptions: BrowserOptions & NodeOptions = {
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
	environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'production',
	tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0,
	// Customers' names, emails and addresses stay out of Sentry.
	sendDefaultPii: false,
};
