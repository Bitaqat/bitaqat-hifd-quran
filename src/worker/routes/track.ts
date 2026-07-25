import type { Env } from "../types";
import { validDownloadPaths } from "../lib/downloads";

const DEDUPE_TTL_SECONDS = 600; // 10 minutes: repeated clicks from the same visitor don't inflate the count

export async function handleTrack(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const path = body.path;
  if (!path || !validDownloadPaths.has(path)) {
    return new Response("Invalid path", { status: 400 });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const dedupeKey = `seen:${ip}:${path}`;
  const alreadySeen = await env.BITAQAT_KV.get(dedupeKey);

  if (!alreadySeen) {
    const countKey = `count:${path}`;
    const current = parseInt((await env.BITAQAT_KV.get(countKey)) ?? "0", 10);
    await env.BITAQAT_KV.put(countKey, String(current + 1));
    await env.BITAQAT_KV.put(dedupeKey, "1", { expirationTtl: DEDUPE_TTL_SECONDS });
  }

  return new Response(null, { status: 204 });
}

export async function handleCounts(env: Env): Promise<Response> {
  const counts: Record<string, number> = {};
  await Promise.all(
    Array.from(validDownloadPaths).map(async (path) => {
      const v = await env.BITAQAT_KV.get(`count:${path}`);
      counts[path] = v ? parseInt(v, 10) : 0;
    })
  );
  return new Response(JSON.stringify(counts), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
  });
}
