import assert from "node:assert/strict";
import { test } from "node:test";

// Read-only production smoke checks. Never creates users, CVs or AI generations.
const baseUrl = (process.env.TEST_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const timeoutMs = 20000;

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(timeoutMs),
    ...options,
  });
}

test("public pages render without server errors", { timeout: 90000 }, async () => {
  for (const path of ["/", "/login", "/register"]) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path}: expected HTTP 200`);
    assert.match(response.headers.get("content-type") || "", /text\/html/);
  }
});

test("homepage includes navigation, employer section and FAQ", { timeout: 30000 }, async () => {
  const response = await request("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /CV Adapt/i);
  assert.match(html, /employers-marquee/);
  assert.match(html, /faq-title/);
  assert.match(html, /href="\/"/);
});

test("private pages never fail with a server error while signed out", { timeout: 120000 }, async () => {
  const paths = [
    "/dashboard", "/cv", "/my-cvs", "/generated-cvs", "/admin",
    "/my-cvs/00000000-0000-4000-8000-000000000001",
    "/generated-cvs/00000000-0000-4000-8000-000000000001",
  ];
  for (const path of paths) {
    const response = await request(path);
    assert.ok(response.status < 500, `${path}: HTTP ${response.status}`);
    // A 200 may be Next.js streamed redirect; this is not an authorisation assertion.
  }
});

test("AI generation API rejects anonymous requests", { timeout: 30000 }, async () => {
  const response = await request("/api/ai/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ cvId: "00000000-0000-4000-8000-000000000001" }),
  });
  assert.equal(response.status, 401);
});

test("PDF export API rejects anonymous requests", { timeout: 30000 }, async () => {
  const response = await request("/api/generated-cvs/00000000-0000-4000-8000-000000000001/pdf");
  assert.equal(response.status, 401);
});
