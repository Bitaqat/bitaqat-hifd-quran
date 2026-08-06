import type { Env } from "../types";

/** Resend's free tier allows 100 emails per day across the whole account. */
const DAILY_LIMIT = 100;

/**
 * Held back from broadcasts so that a visitor subscribing on a day we are mailing the list
 * still gets their confirmation. A broadcast can wait a day; a signup cannot.
 */
const CONFIRMATION_RESERVE = 20;

function todayKey(): string {
  return `nlquota:${new Date().toISOString().slice(0, 10)}`;
}

async function used(env: Env): Promise<number> {
  return parseInt((await env.BITAQAT_KV.get(todayKey())) ?? "0", 10);
}

/** Call after every successful send, whatever its kind. */
export async function recordSends(env: Env, count = 1): Promise<void> {
  const key = todayKey();
  const current = parseInt((await env.BITAQAT_KV.get(key)) ?? "0", 10);
  // Two days, so a run just after midnight UTC cannot resurrect a stale counter.
  await env.BITAQAT_KV.put(key, String(current + count), { expirationTtl: 172_800 });
}

/** How many broadcast emails may still go out today. */
export async function broadcastAllowance(env: Env): Promise<number> {
  return Math.max(0, DAILY_LIMIT - CONFIRMATION_RESERVE - (await used(env)));
}
