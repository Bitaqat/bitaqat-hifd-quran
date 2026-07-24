# Bitaqat Hifd Qor'an

Site for the Qur'an recitation card kit — a pedagogical methodology, level-based cards and tracking tools, free
to download. Content is in French by default, with an English translation in progress under `/en/`.

Built with [Astro](https://astro.build) and Tailwind CSS, deployed on Cloudflare Workers (static assets).

## Commands

| Command            | Action                                       |
| :------------------ | :-------------------------------------------- |
| `npm install`        | Install dependencies                          |
| `npm run dev`         | Start the dev server on `localhost:4321`     |
| `npm run build`       | Production build into `./dist/`               |
| `npm run preview`     | Preview the build locally                     |

## Structure

- `src/pages/` — French pages (default locale) at the root, English pages under `src/pages/en/`
- `src/components/`, `src/layouts/` — shared components and layouts
- `src/data/niveaux.ts` / `niveaux.en.ts` — level, colour and file data, per locale
- `src/i18n/ui.ts` — shared UI string dictionary and locale helpers
- `public/downloads/` — cards, tracking tools and methodology documents (PDF), currently French only

## Licences

- **Source code** (components, layouts, config): [MIT](LICENSE)
- **Pedagogical content** (cards, tools, methodology, under `public/downloads/` and `src/assets/cartes/`): [CC BY-NC 4.0](LICENSE-CONTENT.md) — free sharing and adaptation, non-commercial use only, attribution required.
