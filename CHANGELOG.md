# Changelog

All notable changes to this project are documented here, most recent first. The project doesn't use
version numbers — entries are grouped by date instead.

## 2026-09-20 — Arabic privacy policy

### Added
- `/ar/privacy-policy/`, with a prevalence clause at the top: the French text is the reference,
  this one is a reading aid. That clause is what makes the page publishable — the decision of
  19/09 was not against translating a legal text, it was against an unreviewed translation
  standing as the only version of one.
- The Arabic footer now leads to it instead of to the French page. It was the only Arabic link
  on the site that did not keep its promise, while `ar/legal-notice` and `ar/account-deletion`
  have carried Arabic legal text since August.

### Notes
- The store consoles get the FR and EN URLs only. Arabic is for readers, not for reviewers.
- The part that needs a human reviewer is the GDPR vocabulary — تنفيذ العقد, المصلحة المشروعة,
  the article numbers — not the retention or provider tables, which are facts. The page joins
  the same review queue as the rest of the Arabic content.
- No RTL work was needed: the French page was written with logical properties, so the tables
  and lists flip on their own. Checked at 375px — the page does not scroll sideways, each
  table scrolls inside its own wrapper.

## 2026-09-20 — Privacy policy

### Added
- `/politique-de-confidentialite/` and `/en/privacy-policy/`, version 0.9 of 19/09/2026: the page
  both stores demand on the listing, and that Apple demands be reachable from inside the app
  (rule 5.1.1(i)). Twelve sections, three tables — purposes, providers, retention — and no
  `noindex`: unlike the `app/` pages, this one has to be findable. The URLs carry their trailing
  slash, because that is the form the consoles will be given and the form that answers 200.
- A footer entry in the three languages. Arabic points at the French page: a legal text is not
  machine-translated, and the Arabic version waits for the author, like the deletion page before
  it.

### Changed
- The "Backups" paragraph of the deletion pages said the server kept automatic backups that
  overwrite one another. It kept none — the plan has no backups at all. Since 19/09 a robot makes
  one encrypted copy a night, kept fourteen days, and all three languages now say so. The Arabic
  one was corrected last, once the Arabic policy existed to agree with.

### Notes
- The bracketed fields — registered address, postcode, RNA number, last-updated date — are left as
  they stand. They get filled once the association is registered, not before, and not by guessing.
- Fourteen days is now a public promise rather than an operator setting: the workflow in the app
  repository, the bucket lifecycle rule and this page have to move together or not at all.
- §6 says what we hold from each provider. Supabase and Resend publish their data processing
  agreement; Expo gives its MSA and DPA terms on request only. The sentence promises a dated
  copy of what is published and a request where nothing is — which is true on 20/09, where
  "we hold all three" would not be.

## 2026-09-12 — Password reset landing page

### Added
- `/app/nouveau-mot-de-passe` and `/en/app/new-password`, both `noindex`: where the app's
  "forgotten password" link lands. Twin of the address-confirmation pages, differing on the one
  point that decides everything — a confirmation is finished when the page renders, a reset is
  not. The fragment Supabase leaves here carries an open session, and only the app can set the
  new password, so the page forwards the fragment to `bitaqat://auth` rather than wiping it.
- `public/scripts/app-mot-de-passe.js`, separate from `app-retour.js` on purpose: the two do the
  opposite thing with the fragment, and `app-retour.js` has been in production since 29/08 on the
  busier of the two paths.

### Notes
- The pages say three things, not two. Expired link, as before. Good link on a phone: the app
  opens and the button stays. Good link on a COMPUTER: `bitaqat://` leads nowhere there, and the
  link has just been spent where the password cannot be chosen — so the page says to carry on
  from the phone and ask for a new message, instead of letting someone wait in front of a screen
  that will not change.

## 2026-08-29 — Fixes from the first real signup

### Fixed
- `/app/adresse-confirmee` read "Bitaqat Hifd Qor'anet connectez-vous": Astro compresses HTML and
  ate the newline after `</strong>`. Same fix applied to `/ar/account-deletion`.
- The expired-link page no longer shows Supabase's raw `error_description`. An English, technical
  sentence at the foot of a French page reads as a defect whatever it says, and it taught nothing
  the French text above does not already say.
- "Ouvrir l'application" now appears only on a touch device. On a computer `bitaqat://` is
  registered by no application and the button was inert — pressed, pressed again, and the page
  concluded broken. The sentence telling you to carry on from the phone stays.

## 2026-08-26 — Account deletion request page

### Added
- `/suppression-de-compte`, `/en/account-deletion` and `/ar/account-deletion`: the web link
  Google Play requires alongside the in-app deletion path, reachable without signing in — because
  the people who will write are precisely those who no longer have the app. The page states what is
  deleted, what is kept, and why a request is verified and handled by hand rather than by a button:
  a public form must not be able to erase a child's journey on the strength of a typed address.
- All three are linked from the footer of every page, in their own locale.

### Changed
- `/api/contact` accepts an optional `objet`. Only the subject line changes, and only from a closed
  list held server-side, so a crafted request cannot write its own. A deletion request no longer
  lands in the inbox under the same heading as a question about the methodology.

## 2026-08-26 — Landing page for the app's address confirmation

### Added
- `/app/adresse-confirmee` and `/en/app/address-confirmed`: where the Bitaqat Hifd Qor'an mobile
  app's email-confirmation link now lands. It used to land on `http://localhost:3000` — the
  Supabase project's default Site URL — so a mentor who had just confirmed their address saw
  `ERR_CONNECTION_REFUSED` and reasonably concluded it had failed.
- The page reads Supabase's verdict from the URL fragment (`#error=...&error_code=otp_expired`),
  which never reaches the server, and shows an expired-link state instead of claiming success.
  On a touch device it then bounces to `bitaqat://auth`; the button is always there, because an
  email is just as often opened on a computer, where a bare deep link leads nowhere.
- `public/scripts/app-retour.js` — the fragment reading and the bounce, in a file rather than
  inline, as the CSP requires.

### Changed
- `Layout.astro` takes an optional `noindex` prop. Both new pages use it: they are useful to
  whoever received the link, and to nobody else.

## 2026-08-08 — Level 5 card and methodology update

### Fixed
- Level 5 card verso (both themes) and PDF regenerated in French, English, and Arabic; the full
  methodology document re-exported to match. Recto unchanged.

## 2026-08-07 — Opening card case-count fix

### Fixed
- Opening card (Al-Fâtihah) recto stated 8 cases while the verso grid has 9 (verse 7 is longer and
  spans two cases). Corrected on the card itself and in the matching figure in the methodology
  documents and presentation decks, in all three languages.

## 2026-08-07 — Opening card & methodology content refinements

### Changed
- Updated the opening card (Al-Fâtihah) and the full methodology/presentation documents with refined
  text, replacing the initial versions from the 2026-08-06 redesign. Same design, no layout changes.

## 2026-08-06 — Newsletter sending

### Added
- Broadcasting an article to the subscriber list, triggered manually against
  `/api/newsletter/broadcast` with the `NEWSLETTER_ADMIN_SECRET` bearer token. Publishing an article
  never mails anyone by itself.
- `dryRun` mode reporting subscriber count, per-language split and remaining daily quota without
  sending anything.
- `since` option on the trigger, restricting a send to subscribers confirmed after a given date.
  An article stays sendable indefinitely, so one that went out to a small list can be re-sent later
  to whoever joined since, without mailing anyone twice. Such a send drops the "just published"
  wording, which would be untrue for an older article.
- A cron trigger drains a queued broadcast ten recipients at a time, capped at 80 messages a day so
  the rest of Resend's free tier stays available for signup confirmations. Progress is resumable:
  a tick that dies mid-batch picks up at the same cursor.
- `List-Unsubscribe` and `List-Unsubscribe-Post` headers, so Gmail and Yahoo show their own
  unsubscribe control. The one-click URL accepts `POST`, as those providers require.

### Notes
- Emails are notifications, not full articles: title, teaser and a link. That is what subscribers
  asked for, it survives every mail client, and the canonical text stays on the site.
- Subscribers are re-checked against KV as each message goes out, so unsubscribing mid-send takes
  effect immediately. Only one broadcast may run at a time.

## 2026-08-06 — News section

### Added
- News section at `/actualites` (`/en/news`, `/ar/news`), with one page per article, listed
  newest first. Articles are Markdown files under `src/content/news/<lang>/`.
- RSS feed per language, linked from the news page and discoverable from every page's `<head>`.
  It carries the same news as the newsletter, without asking for an address.
- French is the reference language: an article appears in all three locales as soon as the French
  file exists. Where a translation is missing the French text is shown instead, behind a notice and
  marked up with its own `lang`/`dir` so it reads correctly inside an Arabic page.

### Notes
- `site` is now set in the Astro config, which the RSS feeds need to emit absolute URLs.

## 2026-08-06 — Newsletter signup

### Added
- Newsletter signup form in the footer of every page and on a dedicated `/newsletter` page, in
  French, English, and Arabic. Protected by Turnstile and rate-limited per IP.
- Double opt-in: subscribing sends a confirmation email whose link, valid 24 hours, is what actually
  registers the address. Subscribers are stored in KV; the site owns the list.
- One-click unsubscribe via an opaque token, so the subscriber's address never appears in a URL.
- Legal notice updated in all three languages to cover the newsletter processing.

### Notes
- Sending goes through Resend, isolated behind a `Mailer` interface so the provider can be swapped
  without touching the routes. Requires the `RESEND_API_KEY` Worker secret.
- Email authentication is now set up on the domain: Resend's return path and SPF live on the `send`
  subdomain, DKIM signs as `bitaqat-hifd-quran.com` so the signature aligns with the From address,
  and a DMARC record was published at `p=none`. The root SPF used by Email Routing is untouched.
- Only collection is implemented. Broadcasting news to the list is not built yet.

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
