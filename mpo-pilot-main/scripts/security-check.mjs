const isStrict = process.env.CI === "true" || process.env.CI_STRICT_SECURITY === "1";
const env = process.env;

const checks = [
  {
    id: "invite-secret",
    ok: !!env.INVITE_TOKEN_SECRET && env.INVITE_TOKEN_SECRET !== "dev-invite-secret-change-me",
    message: "Set INVITE_TOKEN_SECRET to a strong non-default value.",
  },
  {
    id: "session-secret",
    ok: !!env.SESSION_SECRET && env.SESSION_SECRET.length >= 24,
    message: "Set SESSION_SECRET with at least 24 characters.",
  },
];

const failed = checks.filter((c) => !c.ok);
if (failed.length === 0) {
  console.log("[security-check] All configured checks passed.");
  process.exit(0);
}

for (const check of failed) {
  console.warn(`[security-check] ${check.id}: ${check.message}`);
}

if (isStrict) {
  console.error("[security-check] Failing due to strict mode.");
  process.exit(1);
}

console.warn("[security-check] Non-strict mode: warnings only.");
process.exit(0);

