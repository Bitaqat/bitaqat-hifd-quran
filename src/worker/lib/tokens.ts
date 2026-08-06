/**
 * Opaque, unguessable tokens for the newsletter double opt-in and unsubscribe links.
 *
 * Deliberately opaque rather than a signed HMAC of the email: it keeps the subscriber's
 * address out of URLs (and therefore out of referrers, proxies and server logs), and it
 * lets a single link be revoked by deleting one KV key.
 */
export function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Tokens come from user input, so keep them to the shape we generate before hitting KV. */
export function isValidToken(token: string): boolean {
  return /^[0-9a-f]{64}$/.test(token);
}

/** Compares in time independent of where the strings first differ, so a caller cannot
 *  discover a secret one character at a time by measuring the response. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
