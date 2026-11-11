# contract/

What this storefront has agreed with the outside world. Tests compare the live
code with these files, so a redesign cannot change any of it by accident. The
reasoning, and the bugs these files exposed, are in
[docs/plan-rediseno-seguro.md](../docs/plan-rediseno-seguro.md).

| File | What it is | Checked by |
|---|---|---|
| `frontend-api-calls.json` | Every request the storefront can send (method + path), recorded by running each RTK Query endpoint | `__tests__/apiCalls.test.ts` here, and `erp/tests/test_frontend_contract.py` in casspea-v2 |
| `routes.json` | Every page URL under `app/` | `__tests__/routes.test.ts` |
| `inbound-links.json` | URLs that Stripe and the emails send people to | `__tests__/routes.test.ts` |
| `responses/*.json` | Real API responses, produced by the casspea-v2 test suite | casspea-v2 checks they still match; tests here use them as fixtures |

## Accepting a deliberate change

```bash
UPDATE_CONTRACT=1 pnpm test contract   # rewrites the JSON files
git diff contract/                     # review every line
```

Then keep the two repos in step:

- `frontend-api-calls.json` changed: copy it to `casspea-v2/contract/` and run the backend tests there.
- The API changed a response: regenerate it in casspea-v2 with
  `UPDATE_CONTRACT=1 python manage.py test erp.tests.test_frontend_contract --settings=erp.settings_test`
  and copy `casspea-v2/contract/responses/` here.

Removing a route is allowed only behind a redirect in `next.config.js`.

## Known issues

An entry with `knownIssue` in `inbound-links.json` is a link that is broken
today. Its test is `it.failing`: it goes red once the link works, which is the
moment to delete the `knownIssue` field.
