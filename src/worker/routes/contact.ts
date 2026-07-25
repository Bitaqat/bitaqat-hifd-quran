import { createMimeMessage } from "mimetext";
// @ts-expect-error -- provided by the Workers runtime, not a real npm package
import { EmailMessage } from "cloudflare:email";
import type { Env } from "../types";
import { verifyTurnstile } from "../lib/turnstile";

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CONTACT_PER_HOUR = 5;

const FROM_ADDRESS = "contact@bitaqat-hifd-quran.com";
const TO_ADDRESS = "bitaqat.hifd.quran@proton.me";

export async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: { name?: string; email?: string; message?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  const turnstileToken = body.turnstileToken ?? "";

  if (!name || name.length > MAX_NAME) return json({ ok: false, error: "invalid_name" }, 400);
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) return json({ ok: false, error: "invalid_email" }, 400);
  if (!message || message.length > MAX_MESSAGE) return json({ ok: false, error: "invalid_message" }, 400);
  if (!turnstileToken) return json({ ok: false, error: "missing_turnstile" }, 400);

  const ip = request.headers.get("CF-Connecting-IP");

  const rateKey = `contact-rate:${ip ?? "unknown"}`;
  const recentRaw = await env.BITAQAT_KV.get(rateKey);
  const recentCount = recentRaw ? parseInt(recentRaw, 10) : 0;
  if (recentCount >= MAX_CONTACT_PER_HOUR) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!verified) return json({ ok: false, error: "turnstile_failed" }, 400);

  try {
    const msg = createMimeMessage();
    msg.setSender({ name: "Bitaqat Hifd Qor'an — Site", addr: FROM_ADDRESS });
    msg.setRecipient(TO_ADDRESS);
    msg.setSubject("Nouveau message — formulaire de contact du site");
    msg.setHeader("Reply-To", `<${email}>`);
    msg.addMessage({
      contentType: "text/plain",
      data: `De : ${name} <${email}>\n\n${message}`,
    });

    const emailMessage = new EmailMessage(FROM_ADDRESS, TO_ADDRESS, msg.asRaw());
    await env.EMAIL.send(emailMessage);
  } catch (err) {
    console.error("contact: send_failed", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "send_failed" }, 502);
  }

  await env.BITAQAT_KV.put(rateKey, String(recentCount + 1), { expirationTtl: 3600 });

  return json({ ok: true });
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
