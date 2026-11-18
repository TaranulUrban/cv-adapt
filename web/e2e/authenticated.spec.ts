import { expect, test, type Page } from "@playwright/test";

// Opt-in, read-only tests. Never use personal/production credentials.
// Run with dedicated test accounts and a test environment.
const base = (process.env.TEST_BASE_URL || "https://cv-adapt-test.vercel.app").replace(/\/$/, "");
const clientEmail = process.env.E2E_CLIENT_EMAIL;
const clientPassword = process.env.E2E_CLIENT_PASSWORD;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

async function login(page: Page, email: string, password: string) {
  await page.goto(`${base}/login`);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/dashboard(?:\?.*)?$/, { timeout: 20000 });
}

test("client signs in, accesses CV pages, and signs out", async ({ page }) => {
  test.skip(!clientEmail || !clientPassword, "Set E2E_CLIENT_EMAIL and E2E_CLIENT_PASSWORD for a dedicated test user");
  await login(page, clientEmail!, clientPassword!);
  await page.goto(`${base}/my-cvs`);
  await expect(page).toHaveURL(/\/my-cvs$/);
  await page.goto(`${base}/generated-cvs`);
  await expect(page).toHaveURL(/\/generated-cvs$/);
  await page.goto(`${base}/dashboard`);
  await page.getByRole("button", { name: /Deconectare|Log out/ }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("client cannot access admin panel", async ({ page }) => {
  test.skip(!clientEmail || !clientPassword, "Dedicated client credentials required");
  await login(page, clientEmail!, clientPassword!);
  await page.goto(`${base}/admin`);
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("client can open the CV creation form without saving", async ({ page }) => {
  test.skip(!clientEmail || !clientPassword, "Dedicated client credentials required");
  await login(page, clientEmail!, clientPassword!);
  await page.goto(`${base}/cv`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('#jobDescription')).toBeVisible();
});

test("existing test CV opens its edit form without saving", async ({ page }) => {
  test.skip(!clientEmail || !clientPassword || !process.env.E2E_EXISTING_CV_ID, "Dedicated client credentials and E2E_EXISTING_CV_ID required");
  await login(page, clientEmail!, clientPassword!);
  await page.goto(`${base}/my-cvs/${process.env.E2E_EXISTING_CV_ID}/edit`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Editează|Edit/);
});

test("existing generated PDF can be downloaded", async ({ page }) => {
  test.skip(!clientEmail || !clientPassword || !process.env.E2E_EXISTING_GENERATED_CV_ID, "Dedicated client credentials and E2E_EXISTING_GENERATED_CV_ID required");
  await login(page, clientEmail!, clientPassword!);
  const response = await page.request.get(`${base}/api/generated-cvs/${process.env.E2E_EXISTING_GENERATED_CV_ID}/pdf`);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const bytes = await response.body();
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
});

test("admin can view users without changing roles", async ({ page }) => {
  test.skip(!adminEmail || !adminPassword, "Dedicated admin credentials required");
  await login(page, adminEmail!, adminPassword!);
  await page.goto(`${base}/admin`);
  await expect(page.getByRole("heading", { name: /Panou de administrare|Administration/ })).toBeVisible();
  await expect(page.locator("table")).toBeVisible();
});
