# Changelog

All notable changes to this project are documented here, most recent first. The project doesn't use
version numbers — entries are grouped by date instead.

## 2026-08-06 — Resource redesign

### Added
- All cards, tracking tools, and the methodology/presentation documents replaced with a new design
  aligned with the site's own visual identity, in French, English, and Arabic.
- New opening card ("Al-Fâtihah"), added as level 0 ahead of the starter cards.
- Levels 7 and 8 now offer a Hafs (default) and Warsh riwaya variant.
- Downloads page: a light/dark theme selector for cards and tracking tools, showing both front and
  back previews for cards (front only for tools).

### Fixed
- Card and document preview thumbnails were being cropped instead of resized, caused by a mismatched
  aspect ratio in the image pipeline.
- Footer copyright now shows the founding year (2014–2026) instead of only the current year.

## 2026-07-28 — Dark mode

### Added
- Manual dark mode toggle in the header (previously followed the OS preference only, with no way to
  override it).
- Dark mode retinted toward the presentation deck's forest-green identity instead of a neutral grey.

## 2026-07-27 to 2026-07-29 — Resource localization and cleanup

### Added
- Localized card, methodology, presentation, and tracking-tool resources per language, instead of a
  French-only download for some of them.
- A "view" and "download" action, plus a download counter, on every resource across the site.
- Image lightbox to enlarge card and document previews.

### Changed
- Resource lists switched to a consistent single-column layout across cards, tools, and methodology
  documents.

### Fixed
- Download counter allow-list was missing English and Arabic resource paths, so those downloads
  weren't tracked.
- Download count badge was never rendering, due to a DOM lookup bug.

### Removed
- Obsolete "Recitation schedule" resource, no longer matching the actual kit.

## 2026-07-25 — Arabic version, download counter, contact form

### Added
- Full Arabic (RTL) translation of the site.
- Download counter (Cloudflare Worker + KV).
- Contact form (Cloudflare Worker, Email Routing, Turnstile spam protection).

## 2026-07-24 — English translation and Cloudflare setup

### Added
- English translation of the site.
- Cloudflare Web Analytics (cookieless).

### Fixed
- Corrupted methodology PDFs replaced with the complete source files.

## 2026-07-23 — Initial launch

### Added
- Relaunch of bitaqat-hifd-quran.com, a site originally designed and developed by this project's
  maintainer in 2014, rebuilt on Astro and deployed to Cloudflare Workers (static assets).
- French recitation cards, methodology, and tracking tools, free to download.
