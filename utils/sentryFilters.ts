import type { Event } from '@sentry/nextjs';

/**
 * True for an error from JavaScript that ran on Deno rather than in a browser.
 *
 * CASSPEA-WEB-1 came from a scraper built on Deno's JavaScript engine. It
 * loads our pages with a Chrome user agent and runs their scripts, even the
 * `nomodule` polyfills that real Chrome skips, and its fetch() returns
 * responses without a body. So when a <Link> prefetches a page, React's RSC
 * client fails on `res.body.getReader()`. No visitor's browser can hit that:
 * every browser Next 14 supports gives fetch responses a body stream.
 *
 * Deno runs its event loop from ext:core/01_core.js, so that file sits at the
 * bottom of the stack. Code under ext: exists only in Deno; browsers name
 * scripts by their URL.
 */
export function isFromDeno(event: Event): boolean {
	return (event.exception?.values ?? []).some(exception =>
		(exception.stacktrace?.frames ?? []).some(frame => frame.filename?.startsWith('ext:')),
	);
}
