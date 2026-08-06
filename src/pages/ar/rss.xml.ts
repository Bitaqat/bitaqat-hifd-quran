import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getArticles } from "../../lib/news";
import { routes, ui, type Lang } from "../../i18n/ui";

const lang: Lang = "ar";

export async function GET(context: APIContext) {
  const articles = await getArticles(lang);

  return rss({
    title: `${ui[lang]["news.title"]} · Bitaqat Hifd Qor'an`,
    description: ui[lang]["news.desc"],
    site: context.site!,
    items: articles.map((article) => ({
      title: article.entry.data.title,
      description: article.entry.data.description,
      pubDate: article.entry.data.pubDate,
      link: `${routes[lang].actualites}/${article.slug}`,
    })),
    customData: `<language>${lang}</language>`,
  });
}
