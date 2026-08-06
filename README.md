# Bitaqat Hifd Qor'an

Site for the Qur'an recitation card kit — a pedagogical methodology, level-based cards and tracking tools, free
to download. Live at [bitaqat-hifd-quran.com](https://bitaqat-hifd-quran.com), in French (default), English
(`/en/`) and Arabic (`/ar/`, RTL).

Built with [Astro](https://astro.build) and Tailwind CSS. Deployed on Cloudflare Workers: static assets plus a
small Worker (`src/worker/`) handling the download counter (`/api/track`, `/api/counts`, backed by KV), the
contact form (`/api/contact`, via Cloudflare Email Routing and Turnstile) and the newsletter
(`/api/newsletter/*`, subscribers in KV, delivery through Resend).

## Commands

| Command                              | Action                                             |
| :------------------------------------ | :-------------------------------------------------- |
| `npm install`                         | Install dependencies                                |
| `npm run dev`                         | Start the dev server on `localhost:4321`            |
| `npm run build`                       | Production build into `./dist/`                     |
| `npm run preview`                     | Preview the build locally                            |
| `npx wrangler deploy --dry-run`       | Validate the Worker bundles correctly before deploy  |
| `npx wrangler deploy`                 | Deploy to Cloudflare (requires `CLOUDFLARE_API_TOKEN`; normally handled by the connected GitHub build on push to `main`) |

## Publishing news

Add `src/content/news/fr/<slug>.md` with `title`, `description` and `pubDate` in the frontmatter.
Translations at `src/content/news/en/<slug>.md` and `ar/<slug>.md` are optional — a locale without one
shows the French text behind a notice. Build and deploy; the article is then live and in the RSS feeds.

Publishing does **not** email anyone. Sending is a separate, deliberate step, guarded by the
`NEWSLETTER_ADMIN_SECRET` Worker secret:

```bash
# Always check first: how many subscribers, in which languages, and today's remaining quota
curl -s -X POST https://bitaqat-hifd-quran.com/api/newsletter/broadcast \
  -H "Authorization: Bearer $NEWSLETTER_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug":"<slug>","dryRun":true}'
```

Drop `"dryRun":true` to queue the real send. A cron trigger then mails ten recipients every ten
minutes, stopping at 80 messages a day so the remaining 20 of Resend's free tier stay available for
signup confirmations. Follow progress with `GET` on the same URL and the same header.

Subscribers are re-checked against KV as each message goes out, so anyone unsubscribing mid-send is
skipped. Only one broadcast may run at a time.

## Structure

- `src/pages/` — French pages (default locale) at the root, English under `src/pages/en/`, Arabic under `src/pages/ar/`
- `src/components/`, `src/layouts/` — shared components and layouts (RTL-aware via Tailwind logical properties)
- `src/data/niveaux.ts` / `niveaux.en.ts` / `niveaux.ar.ts` — level, colour and downloadable-file data, per locale
- `src/i18n/ui.ts` — shared UI string dictionary, routes map and locale helpers
- `src/worker/` — Cloudflare Worker: routes (`routes/`), the download-path allow-list derived from `src/data/` (`lib/downloads.ts`), Turnstile verification (`lib/turnstile.ts`)
- `public/downloads/` — cards, tracking tools and methodology/presentation documents (PDF), per locale (`fr/`, `en/`, `ar/`)
- `public/scripts/` — small vanilla-JS files for interactive behaviour (download tracking, image lightbox, theme toggle, contact form) — kept as external files rather than inline `<script>` tags to satisfy the strict CSP in `public/_headers`

## Licences

- **Source code** (components, layouts, config, Worker): [MIT](LICENSE)
- **Pedagogical content** (cards, tools, methodology, under `public/downloads/` and `src/assets/`): [CC BY-NC 4.0](LICENSE-CONTENT.md) — free sharing and adaptation, non-commercial use only, attribution required.
