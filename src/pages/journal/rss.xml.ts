import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../../data/site';
import { getPublishedPosts, postUrl } from '../../data/journal';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'AadiVed Journal',
    description: 'Practical articles on yoga, meditation, breathwork and sound healing from AadiVed in Hinjawadi, Pune.',
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: postUrl(p),
      categories: [p.data.category, ...p.data.tags],
      author: site.name,
    })),
    customData: '<language>en-IN</language>',
  });
}
