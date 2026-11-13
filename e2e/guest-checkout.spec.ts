import { test, expect, type Page } from '@playwright/test';

/**
 * A guest buys a box, from the product page to the hand-off to Stripe.
 *
 * 13 Nov 2026: every guest was sent back from the address step to the cart
 * to give their email again, forever, and no test noticed: the component
 * tests mock the API, and the bug lived between the cached session and the
 * server. This walks the real flow against the real API, so a break anywhere
 * in it fails the build.
 */

const STRIPE = 'https://checkout.stripe.test/pay';

async function stubStripe(page: Page) {
    // The one thing not real: creating the Stripe session needs live keys and
    // configured prices. Answer it as Stripe would and stop at the redirect.
    await page.route('**/api/checkout/stripe/create-session/', route =>
        route.fulfill({ json: { url: STRIPE } }));
    await page.route(`${STRIPE}**`, route =>
        route.fulfill({ contentType: 'text/html', body: '<h1>Stripe</h1>' }));
}

async function addSurpriseBoxToCart(page: Page) {
    await page.goto('/shop-now/9-bonbons');
    await page.getByText('Surprise Me', { exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('radio', { name: /no allergens/i }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    // An upsell offers a pack first; the box goes in on "Continue to cart".
    await page.getByRole('button', { name: /continue to cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
}

test('a guest buys a box and reaches payment', async ({ page }) => {
    await stubStripe(page);
    await addSurpriseBoxToCart(page);

    await page.getByRole('button', { name: /continue to checkout/i }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder(/email/i).fill('e2e-guest@example.com');
    await dialog.getByRole('button', { name: /continue to checkout/i }).click();

    await page.getByRole('button', { name: /continue without gift card/i }).click();

    // Where the 13 Nov loop sent everyone back to the cart.
    await expect(page).toHaveURL(/\/checkout\/address/);
    await page.getByLabel('First Name').fill('Ada');
    await page.getByLabel('Last Name').fill('Lovelace');
    await page.getByLabel('Street Address').fill('12 Analytical Row');
    await page.getByLabel('City').fill('London');
    await page.getByLabel('Postcode').fill('SW1A 1AA');
    await page.getByRole('button', { name: /continue to review order/i }).click();

    await expect(page).toHaveURL(/\/checkout\/confirm/);
    await page.getByRole('radio', { name: /as soon as possible/i }).click();
    await page.getByRole('radio', { name: /regular 48/i }).check();
    await page.getByRole('button', { name: /continue to secure payment/i }).click();

    await expect(page).toHaveURL(STRIPE);
});

test('Back from the address step returns to the gift card step, not the cart loop', async ({ page }) => {
    await addSurpriseBoxToCart(page);
    await page.getByRole('button', { name: /continue to checkout/i }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder(/email/i).fill('e2e-back@example.com');
    await dialog.getByRole('button', { name: /continue to checkout/i }).click();
    await page.getByRole('button', { name: /continue without gift card/i }).click();
    await expect(page).toHaveURL(/\/checkout\/address/);

    await page.goBack();
    await expect(page).toHaveURL(/\/checkout\/gift-card/);
    await page.getByRole('button', { name: /continue without gift card/i }).click();
    // The email given earlier is still on the session: no second prompt.
    await expect(page).toHaveURL(/\/checkout\/address/);
});
