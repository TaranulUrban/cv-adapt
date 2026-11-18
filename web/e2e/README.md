# CV-Adapt automated tests

From `web/` run **all suites** (unit, HTTP smoke, browser E2E):

```bash
npm run test:all
```

To target an environment, set `TEST_BASE_URL`, for example:

```bash
TEST_BASE_URL=https://cv-adapt-test.vercel.app npm run test:all
```

The eight public browser tests always run. Admin tests are automatically **skipped** until admin credentials are configured:

- `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD`
- `E2E_EXISTING_CV_ID` and `E2E_EXISTING_GENERATED_CV_ID` (optional; must belong to the admin user)

Do not commit credentials, session storage or `.env.local`. Supply credentials as environment variables or Codespaces secrets. Running with an existing admin account only reads data; use an isolated test environment before introducing write tests.

Authenticated tests are **read-only** and use `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` only. They exercise login/logout, lists, admin panel, creation/edit form display, existing CV details and PDF download. They do not validate client-role restrictions. They never register a user, save a CV, change a role, request real AI generation or delete data. Full write/AI scenarios require an isolated test database with resettable fixtures and mocked AI responses before enabling them.

Playwright HTML results: `npx playwright show-report`. The generated `example.spec.ts` is excluded because it tests Playwright's website rather than CV-Adapt.
