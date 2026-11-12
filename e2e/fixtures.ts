import { test as base, expect } from '@playwright/test';

/** The app and the mock API; everything else is a third party. */
const LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;

/** An empty answer of the right kind, so a blocked script is not an error. */
const EMPTY: Record<string, { contentType: string; body: string }> = {
    script: { contentType: 'application/javascript', body: '' },
    stylesheet: { contentType: 'text/css', body: '' },
};

export const MOCK_API = 'http://localhost:4010';

type Fixtures = {
    /** pageerror events and console.error messages seen during the test. */
    problems: string[];
};

export const test = base.extend<Fixtures>({
    context: async ({ context }, use) => {
        // GTM, Cookiebot, PostHog, Trustpilot, Google Maps, Stripe.js, Sentry,
        // fonts...: all answered empty, so no run depends on them.
        await context.route(
            url => !LOCAL.test(url.href),
            route => {
                const empty = EMPTY[route.request().resourceType()];
                return empty ? route.fulfill({ status: 200, ...empty }) : route.fulfill({ status: 204, body: '' });
            },
        );
        await use(context);
    },
    problems: async ({ page }, use) => {
        const problems: string[] = [];
        page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
        page.on('console', message => {
            if (message.type() === 'error') {
                const where = message.location().url;
                problems.push(`console.error: ${message.text()}${where ? ` (${where})` : ''}`);
            }
        });
        await use(problems);
    },
});

export { expect };
