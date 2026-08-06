import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * News articles, one Markdown file per language under `src/content/news/<lang>/<slug>.md`.
 *
 * French is the reference: an article exists once `fr/<slug>.md` does. The English and
 * Arabic files are optional, and a language that lacks one falls back to the French text
 * with a notice — see `src/lib/news.ts`.
 */
const news = defineCollection({
  loader: glob({ base: "./src/content/news", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { news };
