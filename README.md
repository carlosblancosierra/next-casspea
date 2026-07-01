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

## Other scripts

```bash
pnpm build      # production build
pnpm lint       # next lint
```

Note: the production build currently sets `typescript.ignoreBuildErrors: true` in `next.config.js` because the codebase has pre-existing type errors. New code should typecheck cleanly (`npx tsc --noEmit`).
