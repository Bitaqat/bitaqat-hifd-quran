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
