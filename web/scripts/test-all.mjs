import { spawnSync } from "node:child_process";

const checks = [
  ["Unit", ["run", "test:unit"]],
  ["Smoke", ["run", "test:smoke"]],
  ["Playwright E2E", ["run", "test:e2e"]],
];

const results = [];
for (const [label, args] of checks) {
  console.log(`\n========== ${label} ==========`);
  const outcome = spawnSync("npm", args, {
  stdio: "inherit",
  env: {
    ...process.env,
    TEST_BASE_URL:
      process.env.TEST_BASE_URL ||
      "https://cv-adapt-test.vercel.app",
  },
});
  const success = outcome.status === 0;
  results.push({ label, success });
  if (outcome.error) console.error(outcome.error.message);
}

console.log("\n========== CV-Adapt test summary ==========");
for (const { label, success } of results) {
  console.log(`${success ? "PASS" : "FAIL"} ${label}`);
}
if (results.some(({ success }) => !success)) process.exitCode = 1;
