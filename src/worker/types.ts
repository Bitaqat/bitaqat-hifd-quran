/// <reference types="@cloudflare/workers-types" />

export interface Env {
  ASSETS: Fetcher;
  BITAQAT_KV: KVNamespace;
  EMAIL: SendEmail;
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
}
