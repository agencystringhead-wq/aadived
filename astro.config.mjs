import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: confirm final domain before launch
export default defineConfig({
  site: 'https://aadived.com',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  // Keep noindex pages out of the sitemap
  integrations: [sitemap({ filter: (page) => !/\/(404|privacy|terms)\/?$/.test(page) })],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
