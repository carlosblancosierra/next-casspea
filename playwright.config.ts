import { defineConfig } from '@playwright/test';

/**
 * End-to-end tests (docs/plan-rediseno-seguro.md, Phase 3c).
 *
 * The app is built and served against e2e/mock-api, a stand-in for casspea-v2
 * made from contract/responses, so the tests use exactly the shapes the API
 * guarantees and never touch production. Every request to another host is
 * answered empty (e2e/fixtures.ts), so third parties cannot make a run pass
 * or fail.
 *
 *   pnpm e2e                     builds the app and runs everything
 *   pnpm e2e --project=mobile    one viewport only
 *
 * Locally an app already running on APP_PORT is reused: build it with
 * NEXT_PUBLIC_HOST=http://localhost:4010 to skip the build here.
 */
const MOCK_API_PORT = 4010;
const APP_PORT = 3100;

export default defineConfig({
    testDir: 'e2e/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    timeout: 60_000,
    use: {
        baseURL: `http://localhost:${APP_PORT}`,
        trace: 'off',
        screenshot: 'only-on-failure',
        locale: 'en-GB',
        timezoneId: 'Europe/London',
    },
    projects: [
        { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
        { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    ],
    webServer: [
        {
            command: 'node e2e/mock-api/server.mjs',
            url: `http://localhost:${MOCK_API_PORT}/__e2e/health`,
            env: { MOCK_API_PORT: String(MOCK_API_PORT) },
            reuseExistingServer: !process.env.CI,
        },
        {
            // Pages fetch products while building, so the mock must be up first
            // (web servers start in this order).
            command: `pnpm build && pnpm start -p ${APP_PORT}`,
            url: `http://localhost:${APP_PORT}`,
            env: {
                NEXT_PUBLIC_HOST: `http://localhost:${MOCK_API_PORT}`,
                // Keep Sentry out of test runs.
                NEXT_PUBLIC_SENTRY_DSN: '',
            },
            timeout: 600_000,
            reuseExistingServer: !process.env.CI,
        },
    ],
});
