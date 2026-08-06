import type { Env } from "./types";
import { handleTrack, handleCounts } from "./routes/track";
import { handleContact } from "./routes/contact";
import { handleSubscribe, handleConfirm, handleUnsubscribe } from "./routes/newsletter";

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

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
