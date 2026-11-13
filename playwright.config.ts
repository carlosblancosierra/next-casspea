import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests: a real browser buying from the real storefront, talking to
 * the real casspea-v2 API (erp.settings_e2e), with only Stripe stubbed. They
 * catch what component tests with mocked API calls cannot — RTK Query cache,
 * cookies, redirects between steps. See e2e/README.md to run them.
 */
export default defineConfig({
    testDir: './e2e',
    timeout: 60_000,
    expect: { timeout: 10_000 },
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
});
