/**
 * ÇAĞBAŞ data-retention worker.
 *
 * Safety defaults:
 * - No personal-data deletion occurs unless a positive retention period is configured.
 * - RETENTION_DRY_RUN defaults to true. Set it to "false" only after legal approval.
 * - Retention periods are configured independently in Worker variables.
 *
 * Required binding: DB -> cagbas-contact (D1)
 * Cron: daily at 03:17 UTC
 */
const DAY_MS = 24 * 60 * 60 * 1000;

function retentionDays(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 36500 ? parsed : 0;
}

function cutoff(days) {
  return new Date(Date.now() - days * DAY_MS).toISOString().replace("T", " ").replace("Z", "");
}

async function runCleanup(env) {
  if (!env.DB) throw new Error("D1 binding DB is missing");

  const dryRun = String(env.RETENTION_DRY_RUN ?? "true").toLowerCase() !== "false";
  const policies = [
    {
      key: "CONTACT_RETENTION_DAYS",
      table: "contact_submissions",
      column: "created_at",
      label: "contact submissions"
    },
    {
      key: "PENDING_RETENTION_DAYS",
      table: "newsletter_subscribers",
      column: "created_at",
      label: "unconfirmed newsletter subscriptions",
      condition: "status = 'pending' AND verification_expires_at IS NOT NULL AND verification_expires_at < CURRENT_TIMESTAMP"
    },
    {
      key: "UNSUBSCRIBED_RETENTION_DAYS",
      table: "newsletter_subscribers",
      column: "unsubscribed_at",
      label: "unsubscribed newsletter records",
      condition: "status = 'unsubscribed' AND unsubscribed_at IS NOT NULL"
    }
  ];

  const results = [];
  for (const policy of policies) {
    const days = retentionDays(env[policy.key]);
    if (!days) {
      results.push({ category: policy.label, status: "disabled", reason: "No approved retention period configured" });
      continue;
    }

    const boundary = cutoff(days);
    const where = policy.condition
      ? `${policy.condition} AND ${policy.column} < ?`
      : `${policy.column} < ?`;

    const count = await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM ${policy.table} WHERE ${where}`
    ).bind(boundary).first();

    if (dryRun) {
      results.push({ category: policy.label, status: "dry_run", retention_days: days, eligible: Number(count?.total || 0) });
      continue;
    }

    const deletion = await env.DB.prepare(
      `DELETE FROM ${policy.table} WHERE ${where}`
    ).bind(boundary).run();

    results.push({
      category: policy.label,
      status: "deleted",
      retention_days: days,
      deleted: Number(deletion?.meta?.changes || 0)
    });
  }

  // Rate-limit counters are short-lived operational data, not contact records.
  const rateLimitCutoff = Math.floor((Date.now() - 2 * DAY_MS) / 1000);
  const rateLimitCount = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM api_rate_limits WHERE window_start < ?"
  ).bind(rateLimitCutoff).first();
  let rateLimitDeleted = 0;
  if (!dryRun) {
    const rateLimit = await env.DB.prepare(
      "DELETE FROM api_rate_limits WHERE window_start < ?"
    ).bind(rateLimitCutoff).run();
    rateLimitDeleted = Number(rateLimit?.meta?.changes || 0);
  }

  results.push({
    category: "old API rate-limit counters",
    status: dryRun ? "dry_run" : "deleted",
    eligible: Number(rateLimitCount?.total || 0),
    deleted: rateLimitDeleted
  });

  console.log(JSON.stringify({
    event: "data_retention_run",
    executed_at: new Date().toISOString(),
    dry_run: dryRun,
    results
  }));

  return { dry_run: dryRun, results };
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runCleanup(env));
  },

  async fetch() {
    return new Response("Not Found", { status: 404 });
  }
};
