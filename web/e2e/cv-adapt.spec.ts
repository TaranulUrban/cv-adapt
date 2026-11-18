import { expect, test } from "@playwright/test";

// Read-only E2E coverage. These tests never register accounts, save CVs or call AI.
const site = (process.env.TEST_BASE_URL || "https://cv-adapt-test.vercel.app").replace(/\/$/, "");
const url = (path: string) => `${site}${path}`;

test("Romanian homepage renders its main sections", async ({ page }) => {
  await page.goto(url("/"));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Următorul tău job");
  await expect(page.locator("#cum-functioneaza")).toBeVisible();
  await expect(page.locator("#beneficii")).toBeVisible();
  await expect(page.locator("#intrebari")).toBeVisible();
});

test("homepage displays the carousel and opens an FAQ answer", async ({ page }) => {
  await page.goto(url("/"));
  await expect(page.locator(".employers-marquee img")).toHaveCount(22);
  const firstQuestion = page.locator("#intrebari details").first();
  await expect(firstQuestion.locator("p")).toBeHidden();
  await firstQuestion.locator("summary").click();
  await expect(firstQuestion.locator("p")).toBeVisible();
});

test("header logo returns to homepage", async ({ page }) => {
  await page.goto(url("/login"));
  await page.getByRole("link", { name: "CV Adapt — Home" }).click();
  await expect(page).toHaveURL(url("/"));
});

test("main navigation jumps to homepage sections", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(url("/"));
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Cum funcționează" }).click();
  await expect(page).toHaveURL(/#cum-functioneaza$/);
});

test("language switcher changes Romanian to English", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(url("/"));
  await page.getByRole("group", { name: "Interface language" }).getByRole("button", { name: "EN" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your next opportunity");
  await expect(page.locator("#intrebari")).toContainText("Questions? We have answers!");
});

test("login and registration pages expose their forms", async ({ page }) => {
  await page.goto(url("/login"));
  await expect(page.locator("input[type=email]")).toBeVisible();
  await expect(page.locator("input[type=password]")).toBeVisible();
  await page.goto(url("/register"));
  await expect(page.locator("input[type=email]")).toBeVisible();
  await expect(page.locator("input[type=password]")).toHaveCount(2);
});

test("mobile navigation opens and navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url("/"));
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Cum funcționează" }).click();
  await expect(page).toHaveURL(/#cum-functioneaza$/);
});

test("homepage has no horizontal overflow on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(url("/"));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
