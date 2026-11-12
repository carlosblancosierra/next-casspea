# CassPea — Next.js storefront

Ecommerce frontend for [casspea.co.uk](https://www.casspea.co.uk): Next.js 14 (App Router), Redux Toolkit Query, Tailwind CSS and Stripe.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3005
```

## Testing

Unit tests use Jest + React Testing Library (`jest.config.js` / `jest.setup.js`). They run automatically in CI on every push and pull request (`.github/workflows/tests.yml`).

```bash
pnpm test         # run the suite once
pnpm test:watch   # watch mode
```

Conventions:

- Tests live in `__tests__/` folders next to the code they cover (e.g. `components/cart/__tests__/`, `utils/__tests__/`).
- Shared test fixtures live in `test-utils/` (kept out of `__tests__/` so Jest doesn't treat them as suites).
- Mock the RTK Query hooks (`useGetCartQuery`, `useUpdateCartMutation`, …) with `jest.mock` rather than spinning up a real store — see `components/cart/__tests__/DiscountForm.test.tsx`.
- Find elements by role and accessible name (`getByRole('button', { name: … })`), not by class or markup, so tests survive a redesign.
- The suite runs in `Europe/London` (set in `jest.config.js`): CI machines use UTC, where British Summer Time bugs are invisible.
- When a fixture stands in for an API response, base it on `contract/responses/` (real responses from the backend's test suite); `contract/__tests__/responses.test.ts` checks fixtures do not invent fields.

### Contract tests

`contract/` records what the storefront has agreed with the outside world: the API calls it makes, its URLs, and the links Stripe and the emails point at. See [contract/README.md](contract/README.md). To accept a deliberate change:

```bash
UPDATE_CONTRACT=1 pnpm test contract
```

### Known bugs

A known bug is pinned by an `it.failing` test whose name starts with its ID (e.g. `[BUG-04]`). It passes while the bug exists and goes red once the bug is fixed; then turn it into a normal `it`. The list and the plan for a safe redesign are in [docs/plan-rediseno-seguro.md](docs/plan-rediseno-seguro.md).

## Other scripts

```bash
pnpm build      # production build
pnpm lint       # next lint
pnpm typecheck  # tsc --noEmit; runs in CI and must stay clean
```
