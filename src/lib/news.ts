import { getCollection, type CollectionEntry } from "astro:content";
import { defaultLang, type Lang } from "../i18n/ui";

export type NewsEntry = CollectionEntry<"news">;

export interface LocalizedArticle {
  /** Slug shared by every translation, e.g. "lancement-newsletter". */
  slug: string;
  /** The entry to render: the requested language, or the French one as a fallback. */
  entry: NewsEntry;
  /** True when `entry` is the French fallback rather than a real translation. */
  isFallback: boolean;
}

/** Collection ids look like "fr/lancement-newsletter". */
function parseId(id: string): { lang: string; slug: string } {
  const separator = id.indexOf("/");
  return { lang: id.slice(0, separator), slug: id.slice(separator + 1) };
}

/**
 * Every article, newest first, resolved for one language.
 *
 * French is the reference set: an article shows up in all three languages as soon as it
 * exists in French, so no locale is ever left with an empty news page. Where a translation
 * is missing the French text is served instead, flagged so the page can say so.
 */
export async function getArticles(lang: Lang): Promise<LocalizedArticle[]> {
  const all = await getCollection("news");

  const byLang = new Map<string, NewsEntry>();
  for (const entry of all) {
    const { lang: entryLang, slug } = parseId(entry.id);
    byLang.set(`${entryLang}/${slug}`, entry);
  }

  const articles: LocalizedArticle[] = [];
  for (const entry of all) {
    const { lang: entryLang, slug } = parseId(entry.id);
    if (entryLang !== defaultLang) continue;

    const translated = lang === defaultLang ? entry : byLang.get(`${lang}/${slug}`);
    articles.push({
      slug,
      entry: translated ?? entry,
      isFallback: !translated,
    });
  }

  // Sort on the French entry's date so the ordering is identical in every language, even
  // when a translation was added later with a different pubDate.
  const pubDateOf = (slug: string) => byLang.get(`${defaultLang}/${slug}`)!.data.pubDate.valueOf();
  return articles.sort((a, b) => pubDateOf(b.slug) - pubDateOf(a.slug));
}

const dateLocales: Record<Lang, string> = { fr: "fr-FR", en: "en-GB", ar: "ar" };

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(dateLocales[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function getArticle(lang: Lang, slug: string): Promise<LocalizedArticle | undefined> {
  const articles = await getArticles(lang);
  return articles.find((article) => article.slug === slug);
}
