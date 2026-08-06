/**
 * Single point of contact with the email provider.
 *
 * Everything else in the newsletter code talks to this interface, so swapping Resend for
 * another transport (Cloudflare Email Service, Brevo…) means adding one implementation
 * here and changing the instantiation — no changes to the routes.
 */
export interface OutgoingMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Extra MIME headers, e.g. List-Unsubscribe on broadcasts. */
  headers?: Record<string, string>;
}

export interface Mailer {
  send(message: OutgoingMessage): Promise<void>;
}

export function createResendMailer(apiKey: string, from: string): Mailer {
  return {
    async send(message) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
          ...(message.headers ? { headers: message.headers } : {}),
        }),
      });

      if (!res.ok) {
        // Body carries Resend's error code; useful in `wrangler tail` when a send fails.
        const detail = await res.text().catch(() => "");
        throw new Error(`resend ${res.status}: ${detail.slice(0, 300)}`);
      }
    },
  };
}
