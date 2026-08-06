import type { Env } from "../types";
import { timingSafeEqual } from "../lib/tokens";
import { createJob, getCurrentJob, getJob, listSubscribers, loadArticles } from "../lib/broadcast";
import { broadcastAllowance } from "../lib/quota";
import { defaultLang } from "../../i18n/ui";

/**
 * Sending is deliberately a deliberate act. Publishing an article does not mail anyone;
 * this endpoint does, and only for a caller holding the admin secret. An email that has
 * left cannot be recalled, so the trigger stays manual and the default is a dry run away.
 */
export async function handleBroadcast(request: Request, env: Env): Promise<Response> {
  if (!authorized(request, env)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  if (request.method === "GET") return status(request, env);
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: { slug?: string; dryRun?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const slug = (body.slug ?? "").trim();
  if (!slug) return json({ ok: false, error: "missing_slug" }, 400);

  const articles = await loadArticles(env);
  const article = articles.find((a) => a.slug === slug && a.lang === defaultLang);
  if (!article) return json({ ok: false, error: "unknown_slug", slug }, 404);

  const running = await getCurrentJob(env);
  if (running && running.status === "running") {
    return json({ ok: false, error: "job_already_running", job: running }, 409);
  }

  const recipients = await listSubscribers(env);
  const allowance = await broadcastAllowance(env);

  if (body.dryRun) {
    return json({
      ok: true,
      dryRun: true,
      slug,
      title: article.title,
      url: article.url,
      recipients: recipients.length,
      allowanceToday: allowance,
      languages: countBy(recipients.map((r) => r.lang)),
    });
  }

  if (recipients.length === 0) return json({ ok: false, error: "no_subscribers" }, 400);

  const job = await createJob(env, slug, recipients);
  return json({ ok: true, job, allowanceToday: allowance });
}

async function status(request: Request, env: Env): Promise<Response> {
  const id = new URL(request.url).searchParams.get("jobId");
  const job = id ? await getJob(env, id) : await getCurrentJob(env);
  return json({ ok: true, job, allowanceToday: await broadcastAllowance(env) });
}

function authorized(request: Request, env: Env): boolean {
  const header = request.headers.get("Authorization") ?? "";
  const prefix = "Bearer ";
  if (!header.startsWith(prefix)) return false;
  const secret = env.NEWSLETTER_ADMIN_SECRET;
  // Without the secret configured the endpoint stays shut rather than open.
  if (!secret) return false;
  return timingSafeEqual(header.slice(prefix.length), secret);
}

function countBy(values: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
