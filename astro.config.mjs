// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://holidays.flightsandpackages.com',
  adapter: cloudflare(),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/Holidays/search'),
    }),
  ],
});
