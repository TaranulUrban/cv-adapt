# CV-Adapt automated tests

From `web/` run **all suites** (unit, HTTP smoke, browser E2E):

```bash
npm run test:all
```

To target an environment, set `TEST_BASE_URL`, for example:

```bash
TEST_BASE_URL=https://cv-adapt-test.vercel.app npm run test:all
```

The eight public browser tests always run. Authenticated tests are automatically **skipped** until dedicated test accounts are configured:

- `E2E_CLIENT_EMAIL` and `E2E_CLIENT_PASSWORD`
- `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` (optional)
- `E2E_EXISTING_CV_ID` and `E2E_EXISTING_GENERATED_CV_ID` (optional; must belong to the client test user)

Do not commit credentials, session storage or `.env.local`. Supply credentials as environment variables or Codespaces secrets. Use only dedicated test accounts, ideally in a separate Supabase project.

Authenticated tests are **read-only**: they exercise login/logout, list access, creation/edit-form display, admin permissions and an existing PDF download. They never register a user, save a CV, change a role, request real AI generation or delete data. Full write/AI scenarios require an isolated test database with resettable fixtures and mocked AI responses before enabling them.

Playwright HTML results: `npx playwright show-report`. The generated `example.spec.ts` is excluded because it tests Playwright's website rather than CV-Adapt.
