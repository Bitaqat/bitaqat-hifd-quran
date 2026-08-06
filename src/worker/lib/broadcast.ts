import type { Env } from "../types";
import { createResendMailer } from "./mailer";
import { buildBroadcastEmail } from "./newsletter-emails";
import { broadcastAllowance, recordSends } from "./quota";
import { randomToken } from "./tokens";
import { routes, defaultLang, type Lang } from "../../i18n/ui";

export const SITE_ORIGIN = "https://bitaqat-hifd-quran.com";
const FROM_ADDRESS = "Bitaqat Hifd Qor'an <newsletter@bitaqat-hifd-quran.com>";

/** Sent per cron tick. Small on purpose: a new sending domain that suddenly emits hundreds
 *  of messages is the textbook spam signal, and the daily cap is the real constraint anyway. */
const BATCH_SIZE = 10;

const KEY_CURRENT = "nljob:current";
const jobKey = (id: string) => `nljob:${id}`;
const recipientsKey = (id: string) => `nljobrec:${id}`;

interface Recipient {
  email: string;
  lang: Lang;
  unsubToken: string;
}

export interface Job {
  id: string;
  slug: string;
  createdAt: string;
  /** Set on a re-send: only subscribers confirmed after this instant were included. */
  since?: string;
  status: "running" | "done";
  /** Index of the next recipient to mail, so a tick that dies mid-way resumes cleanly. */
  cursor: number;
  total: number;
  sent: number;
  failed: number;
  finishedAt?: string;
}

interface ArticleRecord {
  slug: string;
  lang: Lang;
  title: string;
  description: string;
  url: string;
  isFallback: boolean;
}

/** The build publishes this; see src/pages/newsletter-content.json.ts. */
export async function loadArticles(env: Env): Promise<ArticleRecord[]> {
  const res = await env.ASSETS.fetch(new URL("/newsletter-content.json", SITE_ORIGIN));
  if (!res.ok) throw new Error(`newsletter-content.json: ${res.status}`);
  return (await res.json()) as ArticleRecord[];
}

/**
 * Confirmed subscribers, optionally only those who joined after `since`.
 *
 * That filter is what makes re-sending an older article safe: it reaches the people who
 * were not on the list the first time round, and nobody receives the same article twice.
 */
export async function listSubscribers(env: Env, since?: Date): Promise<Recipient[]> {
  const recipients: Recipient[] = [];
  let cursor: string | undefined;

  do {
    const page = await env.BITAQAT_KV.list({ prefix: "nlsub:", cursor });
    for (const key of page.keys) {
      const raw = await env.BITAQAT_KV.get(key.name);
      if (!raw) continue;
      const sub = JSON.parse(raw) as {
        email: string;
        lang: Lang;
        unsubToken: string;
        confirmedAt?: string;
      };

      if (since) {
        // A record without a date cannot be shown to be recent, so leave it out: the cost
        // of skipping someone is one missed article, against sending a duplicate.
        if (!sub.confirmedAt) continue;
        if (new Date(sub.confirmedAt) < since) continue;
      }

      recipients.push({ email: sub.email, lang: sub.lang, unsubToken: sub.unsubToken });
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return recipients;
}

export async function getCurrentJob(env: Env): Promise<Job | null> {
  const id = await env.BITAQAT_KV.get(KEY_CURRENT);
  if (!id) return null;
  const raw = await env.BITAQAT_KV.get(jobKey(id));
  return raw ? (JSON.parse(raw) as Job) : null;
}

export async function getJob(env: Env, id: string): Promise<Job | null> {
  const raw = await env.BITAQAT_KV.get(jobKey(id));
  return raw ? (JSON.parse(raw) as Job) : null;
}

export async function createJob(
  env: Env,
  slug: string,
  recipients: Recipient[],
  since?: Date
): Promise<Job> {
  const job: Job = {
    id: randomToken().slice(0, 16),
    slug,
    createdAt: new Date().toISOString(),
    ...(since ? { since: since.toISOString() } : {}),
    status: "running",
    cursor: 0,
    total: recipients.length,
    sent: 0,
    failed: 0,
  };

  await env.BITAQAT_KV.put(recipientsKey(job.id), JSON.stringify(recipients));
  await env.BITAQAT_KV.put(jobKey(job.id), JSON.stringify(job));
  await env.BITAQAT_KV.put(KEY_CURRENT, job.id);

  return job;
}

/**
 * Mails the next batch of the running job, if any. Invoked by the cron trigger.
 *
 * Recipients are a snapshot taken when the job was created, so someone who unsubscribes
 * mid-send is still in the list — their address is re-checked here before mailing.
 */
export async function drainJob(env: Env): Promise<{ status: string; sent?: number }> {
  const job = await getCurrentJob(env);
  if (!job || job.status !== "running") return { status: "idle" };

  const allowance = await broadcastAllowance(env);
  if (allowance <= 0) return { status: "quota_exhausted" };

  const raw = await env.BITAQAT_KV.get(recipientsKey(job.id));
  if (!raw) {
    console.error("broadcast: recipients missing for job", job.id);
    await finish(env, job);
    return { status: "aborted_no_recipients" };
  }

  const recipients = JSON.parse(raw) as Recipient[];
  const articles = await loadArticles(env);
  const mailer = createResendMailer(env.RESEND_API_KEY, FROM_ADDRESS);

  const batch = recipients.slice(job.cursor, job.cursor + Math.min(BATCH_SIZE, allowance));
  let sent = 0;

  for (const recipient of batch) {
    job.cursor += 1;

    // Honour anyone who unsubscribed after the snapshot was taken.
    const stillSubscribed = await env.BITAQAT_KV.get(`nlsub:${recipient.email}`);
    if (!stillSubscribed) continue;

    const article =
      articles.find((a) => a.slug === job.slug && a.lang === recipient.lang) ??
      articles.find((a) => a.slug === job.slug && a.lang === defaultLang);
    if (!article) {
      console.error("broadcast: article missing", job.slug, recipient.lang);
      job.failed += 1;
      continue;
    }

    const lang = article.lang;
    const pageUrl = `${SITE_ORIGIN}${routes[lang].newsletter}/?u=${recipient.unsubToken}`;
    const oneClickUrl = `${SITE_ORIGIN}/api/newsletter/unsubscribe?u=${recipient.unsubToken}`;
    // A re-send drops the "just published" wording, which would be false for an older article.
    const { subject, html, text } = buildBroadcastEmail(lang, article, pageUrl, {
      resend: Boolean(job.since),
    });

    try {
      await mailer.send({
        to: recipient.email,
        subject,
        html,
        text,
        headers: {
          // Gmail and Yahoo require both for bulk senders; the one-click URL must accept POST.
          "List-Unsubscribe": `<${oneClickUrl}>, <${pageUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      job.sent += 1;
      sent += 1;
    } catch (err) {
      console.error("broadcast: send failed", recipient.email, err instanceof Error ? err.message : err);
      job.failed += 1;
    }
  }

  if (sent > 0) await recordSends(env, sent);

  if (job.cursor >= job.total) {
    await finish(env, job);
    return { status: "completed", sent };
  }

  await env.BITAQAT_KV.put(jobKey(job.id), JSON.stringify(job));
  return { status: "running", sent };
}

async function finish(env: Env, job: Job): Promise<void> {
  job.status = "done";
  job.finishedAt = new Date().toISOString();
  await env.BITAQAT_KV.put(jobKey(job.id), JSON.stringify(job));
  await env.BITAQAT_KV.delete(recipientsKey(job.id));
  await env.BITAQAT_KV.delete(KEY_CURRENT);
}
