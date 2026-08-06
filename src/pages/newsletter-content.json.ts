import type { APIRoute } from "astro";
import { getArticles } from "../lib/news";
import { routes, languages, type Lang } from "../i18n/ui";

/**
 * What the Worker needs to compose a broadcast, emitted as a static asset at build time.
 *
 * The Worker cannot render Markdown, and has no access to the content collection. Rather
 * than teach it either, the build publishes the handful of fields a notification email
 * actually uses, already resolved per language including the French fallback.
 */
export interface BroadcastArticle {
  slug: string;
  lang: Lang;
  title: string;
  description: string;
  url: string;
  pubDate: string;
  /** True when this language falls back to the French text. */
  isFallback: boolean;
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site!.origin;
  const articles: BroadcastArticle[] = [];

  for (const lang of Object.keys(languages) as Lang[]) {
    for (const article of await getArticles(lang)) {
      articles.push({
        slug: article.slug,
        lang,
        title: article.entry.data.title,
        description: article.entry.data.description,
        url: `${origin}${routes[lang].actualites}/${article.slug}/`,
        pubDate: article.entry.data.pubDate.toISOString(),
        isFallback: article.isFallback,
      });
    }
  }

  return new Response(JSON.stringify(articles), {
    headers: { "Content-Type": "application/json" },
  });
};
