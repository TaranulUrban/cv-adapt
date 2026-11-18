import { expect, test, type Page } from "@playwright/test";

// Read-only checks with one admin account. No writes or paid AI requests.
const base = (process.env.TEST_BASE_URL || "https://cv-adapt-test.vercel.app").replace(/\/$/, "");
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

async function login(page: Page) {
  test.skip(!email || !password, "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD required");
  await page.goto(`${base}/login`);
  await page.locator('input[type="email"]').fill(email!);
  await page.locator('input[type="password"]').fill(password!);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/dashboard(?:\?.*)?$/, { timeout: 20000 });
}

test("admin signs in, accesses dashboard, and signs out", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: /Deconectare|Log out/ }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("admin can view users without changing roles", async ({ page }) => {
  await login(page);
  await page.goto(`${base}/admin`);
  await expect(page.getByRole("heading", { name: /Panou de administrare|Administration/ })).toBeVisible();
  await expect(page.locator("table")).toBeVisible();
});

test("admin can navigate dashboard and CV lists", async ({ page }) => {
  await login(page);
  for (const route of ["/my-cvs", "/generated-cvs", "/dashboard"]) {
    await page.goto(`${base}${route}`);
    await expect(page).toHaveURL(`${base}${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("admin can open new CV form without saving", async ({ page }) => {
  await login(page);
  await page.goto(`${base}/cv`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator("#jobDescription")).toBeVisible();
});

test("admin can view existing original CV without editing", async ({ page }) => {
  test.skip(!process.env.E2E_EXISTING_CV_ID, "Set E2E_EXISTING_CV_ID for an owned CV");
  await login(page);
  await page.goto(`${base}/my-cvs/${process.env.E2E_EXISTING_CV_ID}`);
  await expect(page).toHaveURL(/\/my-cvs\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("admin can open existing CV edit form without saving", async ({ page }) => {
  test.skip(!process.env.E2E_EXISTING_CV_ID, "Set E2E_EXISTING_CV_ID for an owned CV");
  await login(page);
  await page.goto(`${base}/my-cvs/${process.env.E2E_EXISTING_CV_ID}/edit`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Editează|Edit/);
});

test("admin can view existing generated CV without AI regeneration", async ({ page }) => {
  test.skip(!process.env.E2E_EXISTING_GENERATED_CV_ID, "Set E2E_EXISTING_GENERATED_CV_ID for an owned CV");
  await login(page);
  await page.goto(`${base}/generated-cvs/${process.env.E2E_EXISTING_GENERATED_CV_ID}`);
  await expect(page).toHaveURL(/\/generated-cvs\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("admin can download existing generated PDF", async ({ page }) => {
  test.skip(!process.env.E2E_EXISTING_GENERATED_CV_ID, "Set E2E_EXISTING_GENERATED_CV_ID for an owned CV");
  await login(page);
  const response = await page.request.get(`${base}/api/generated-cvs/${process.env.E2E_EXISTING_GENERATED_CV_ID}/pdf`);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});
