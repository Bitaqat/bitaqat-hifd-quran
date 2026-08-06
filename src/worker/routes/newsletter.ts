import type { Env } from "../types";
import { verifyTurnstile } from "../lib/turnstile";
import { createResendMailer } from "../lib/mailer";
import { randomToken, isValidToken } from "../lib/tokens";
import { buildConfirmEmail } from "../lib/newsletter-emails";
import { recordSends } from "../lib/quota";
import { routes, defaultLang, type Lang } from "../../i18n/ui";

const MAX_EMAIL = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBSCRIBE_PER_HOUR = 3;
const PENDING_TTL_SECONDS = 86_400; // 24 h, matching the wording of the confirmation email

const FROM_ADDRESS = "Bitaqat Hifd Qor'an <newsletter@bitaqat-hifd-quran.com>";
const LANGS: Lang[] = ["fr", "en", "ar"];

/** Confirmed subscriber, keyed by `nlsub:<email>`. */
interface Subscriber {
  email: string;
  lang: Lang;
  confirmedAt: string;
  /** Opaque key of the `nlunsub:<token>` lookup entry, so broadcasts can build the link. */
  unsubToken: string;
}

/** Awaiting double opt-in, keyed by `nlpending:<token>` with a TTL. */
interface PendingSubscription {
  email: string;
  lang: Lang;
}

export async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: { email?: string; lang?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const lang = toLang(body.lang);
  const turnstileToken = body.turnstileToken ?? "";

  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }
  if (!turnstileToken) return json({ ok: false, error: "missing_turnstile" }, 400);

  const ip = request.headers.get("CF-Connecting-IP");
  const rateKey = `nlrate:${ip ?? "unknown"}`;
  const recentCount = parseInt((await env.BITAQAT_KV.get(rateKey)) ?? "0", 10);
  if (recentCount >= MAX_SUBSCRIBE_PER_HOUR) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!verified) return json({ ok: false, error: "turnstile_failed" }, 400);

  // Counted once Turnstile has passed, and before the branches below: an attacker holding a
  // valid token must not be able to fish for subscribed addresses, or make us send mail, for free.
  await env.BITAQAT_KV.put(rateKey, String(recentCount + 1), { expirationTtl: 3600 });

  // Already confirmed: answer exactly as for a fresh signup and send nothing. Telling the
  // caller the address is on the list would turn this endpoint into a membership oracle.
  const existing = await env.BITAQAT_KV.get(`nlsub:${email}`);
  if (existing) return json({ ok: true });

  const token = randomToken();
  const pending: PendingSubscription = { email, lang };
  await env.BITAQAT_KV.put(`nlpending:${token}`, JSON.stringify(pending), {
    expirationTtl: PENDING_TTL_SECONDS,
  });

  const confirmUrl = `${new URL(request.url).origin}/api/newsletter/confirm?token=${token}`;
  const { subject, html, text } = buildConfirmEmail(lang, confirmUrl);

  try {
    const mailer = createResendMailer(env.RESEND_API_KEY, FROM_ADDRESS);
    await mailer.send({ to: email, subject, html, text });
    await recordSends(env);
  } catch (err) {
    console.error("newsletter: send_failed", err instanceof Error ? err.message : err);
    await env.BITAQAT_KV.delete(`nlpending:${token}`);
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

/**
 * Opt-in confirmation, reached by clicking the link in the email — hence GET, and hence a
 * redirect to a real page rather than a JSON body.
 */
export async function handleConfirm(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";

  if (!isValidToken(token)) return redirectToNewsletter(url.origin, defaultLang, "invalid=1");

  const raw = await env.BITAQAT_KV.get(`nlpending:${token}`);
  if (!raw) return redirectToNewsletter(url.origin, defaultLang, "invalid=1");

  let pending: PendingSubscription;
  try {
    pending = JSON.parse(raw) as PendingSubscription;
  } catch {
    return redirectToNewsletter(url.origin, defaultLang, "invalid=1");
  }

  const lang = toLang(pending.lang);

  // Re-clicking the link after confirming lands here with the pending entry already gone,
  // so treat an existing subscriber as a success rather than an error.
  const existingRaw = await env.BITAQAT_KV.get(`nlsub:${pending.email}`);
  if (!existingRaw) {
    const unsubToken = randomToken();
    const subscriber: Subscriber = {
      email: pending.email,
      lang,
      confirmedAt: new Date().toISOString(),
      unsubToken,
    };
    await env.BITAQAT_KV.put(`nlsub:${pending.email}`, JSON.stringify(subscriber));
    await env.BITAQAT_KV.put(`nlunsub:${unsubToken}`, pending.email);
  }

  await env.BITAQAT_KV.delete(`nlpending:${token}`);

  return redirectToNewsletter(url.origin, lang, "confirmed=1");
}

/**
 * POST-only on purpose: link scanners in corporate mail gateways follow GET links, which
 * would silently unsubscribe people. The email links to a page that posts here on click.
 */
export async function handleUnsubscribe(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  // Two callers reach this. The site's own page posts a JSON body; mail providers doing
  // One-Click unsubscribe post a form body to the URL carried in the List-Unsubscribe
  // header, where the token is the query parameter.
  let token = new URL(request.url).searchParams.get("u") ?? "";
  if (!token) {
    try {
      const body = (await request.json()) as { token?: string };
      token = body.token ?? "";
    } catch {
      return json({ ok: false, error: "invalid_body" }, 400);
    }
  }

  if (!isValidToken(token)) return json({ ok: false, error: "invalid_token" }, 400);

  const email = await env.BITAQAT_KV.get(`nlunsub:${token}`);
  // Unknown token: report success anyway. An already-removed subscriber clicking twice
  // should see the same thing, and probing must not distinguish the two cases.
  if (!email) return json({ ok: true });

  await env.BITAQAT_KV.delete(`nlsub:${email}`);
  await env.BITAQAT_KV.delete(`nlunsub:${token}`);

  return json({ ok: true });
}

function redirectToNewsletter(origin: string, lang: Lang, query: string): Response {
  return Response.redirect(`${origin}${routes[lang].newsletter}?${query}`, 302);
}

function toLang(value: string | undefined): Lang {
  return LANGS.includes(value as Lang) ? (value as Lang) : defaultLang;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
