import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeExternalLinks from 'rehype-external-links';
import { readdirSync, readFileSync } from 'node:fs';

// pubDate of every journal post, used as <lastmod> in the sitemap
const lastmod = {};
try {
  for (const f of readdirSync('./src/content/journal')) {
    if (!/\.mdx?$/.test(f) || f.startsWith('_')) continue;
    const m = readFileSync(`./src/content/journal/${f}`, 'utf8').match(/^pubDate:\s*(.+)$/m);
    if (m) lastmod[f.replace(/\.mdx?$/, '')] = new Date(m[1].trim().replace(/['"]/g, '')).toISOString();
  }
} catch {
  // no journal folder yet
}

// TODO: confirm final domain before launch
export default defineConfig({
  site: 'https://aadived.com',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  integrations: [
    mdx(),
    sitemap({
      // Keep noindex pages out of the sitemap
      filter: (page) => !/\/(404|privacy|terms)\/?$/.test(page),
      // Journal posts: lastmod is the post's pubDate
      serialize(item) {
        const m = item.url.match(/\/journal\/([^/]+)\/$/);
        if (m && lastmod[m[1]]) item.lastmod = lastmod[m[1]];
        return item;
      },
    }),
  ],
  // Links inside Markdown and MDX content: external ones open in a new tab (see src/data/links.ts for the same rule in components)
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          content: [
            { type: 'element', tagName: 'span', properties: { className: ['sr-only'] }, children: [{ type: 'text', value: ' (opens in a new tab)' }] },
            { type: 'element', tagName: 'span', properties: { className: ['ext-arrow'], ariaHidden: 'true' }, children: [{ type: 'text', value: '↗' }] },
          ],
        },
      ],
    ],
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
