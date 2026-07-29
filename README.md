# Bitaqat Hifd Qor'an

Site for the Qur'an recitation card kit — a pedagogical methodology, level-based cards and tracking tools, free
to download. Live at [bitaqat-hifd-quran.com](https://bitaqat-hifd-quran.com), in French (default), English
(`/en/`) and Arabic (`/ar/`, RTL).

Built with [Astro](https://astro.build) and Tailwind CSS. Deployed on Cloudflare Workers: static assets plus a
small Worker (`src/worker/`) handling the download counter (`/api/track`, `/api/counts`, backed by KV) and the
contact form (`/api/contact`, via Cloudflare Email Routing and Turnstile).

## Commands

| Command                              | Action                                             |
| :------------------------------------ | :-------------------------------------------------- |
| `npm install`                         | Install dependencies                                |
| `npm run dev`                         | Start the dev server on `localhost:4321`            |
| `npm run build`                       | Production build into `./dist/`                     |
| `npm run preview`                     | Preview the build locally                            |
| `npx wrangler deploy --dry-run`       | Validate the Worker bundles correctly before deploy  |
| `npx wrangler deploy`                 | Deploy to Cloudflare (requires `CLOUDFLARE_API_TOKEN`; normally handled by the connected GitHub build on push to `main`) |

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
