import type { Env } from "./types";
import { handleTrack, handleCounts } from "./routes/track";
import { handleContact } from "./routes/contact";
import { handleSubscribe, handleConfirm, handleUnsubscribe } from "./routes/newsletter";
import { handleBroadcast } from "./routes/broadcast";
import { drainJob } from "./lib/broadcast";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/track") {
      return handleTrack(request, env);
    }
    if (url.pathname === "/api/counts") {
      return handleCounts(env);
    }
    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }
    if (url.pathname === "/api/newsletter/subscribe") {
      return handleSubscribe(request, env);
    }
    if (url.pathname === "/api/newsletter/confirm") {
      return handleConfirm(request, env);
    }
    if (url.pathname === "/api/newsletter/unsubscribe") {
      return handleUnsubscribe(request, env);
    }
    if (url.pathname === "/api/newsletter/broadcast") {
      return handleBroadcast(request, env);
    }

    return env.ASSETS.fetch(request);
  },

  // Drains whatever broadcast is in flight, a batch at a time. Does nothing when no job
  // is running, which is the usual case.
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      drainJob(env).then(
        (result) => console.log("broadcast:", JSON.stringify(result)),
        (err) => console.error("broadcast: drain failed", err instanceof Error ? err.message : err)
      )
    );
  },
} satisfies ExportedHandler<Env>;
