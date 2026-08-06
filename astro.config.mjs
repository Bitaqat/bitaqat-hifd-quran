// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Required for the RSS feeds to emit absolute article URLs.
  site: 'https://bitaqat-hifd-quran.com',
  i18n: {
    locales: ['fr', 'en', 'ar'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});