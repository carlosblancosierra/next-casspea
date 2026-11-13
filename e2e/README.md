# End-to-end tests

A real browser buys a box from the storefront, talking to the real casspea-v2
API, from the product page to the hand-off to Stripe. Only Stripe is stubbed.

They exist because of 13 November 2026: every guest was sent back from the
address step to the cart, in a loop, for a whole day, and every unit test was
green. The unit tests mock the API, and the bug lived between the cached
checkout session and the server.

CI runs them on every pull request (`.github/workflows/e2e.yml`), against
casspea-v2's `main`. Run the workflow by hand to test another backend branch.

## Running them locally

1. The API, from a casspea-v2 checkout:

   ```bash
   python manage.py migrate --settings=erp.settings_e2e
   python manage.py loaddata initial_discounts initial_product_category initial_products initial_allergens initial_flavour_categories initial_flavours initial_shipping --settings=erp.settings_e2e
   python manage.py runserver 8000 --settings=erp.settings_e2e
   ```

2. The storefront, pointed at it:

   ```bash
   NEXT_PUBLIC_HOST=http://localhost:8000 pnpm build && pnpm start -p 3000
   ```

3. The tests:

   ```bash
   pnpm e2e
   ```

`pnpm e2e --headed` shows the browser; `pnpm e2e --trace on` records a trace
to open with `pnpm exec playwright show-trace`.

## Adding a test

Walk the flow the way a customer would, with roles and visible text
(`getByRole('button', { name: ... })`), not CSS classes. Stub only what leaves
the site. Each test starts with an empty cart in a fresh browser.
