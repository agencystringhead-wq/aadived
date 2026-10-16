// Journal helpers. Every list or page of posts must go through getPublishedPosts(), so a post that is not
// published yet never gets a page, a listing, a feed entry, a sitemap entry or a link.
import { getCollection, type CollectionEntry } from 'astro:content';
import { site, stubPages } from './site';
import { getPractice, interestId } from './practices';
import { title as seoTitle } from './seo';

export type Post = CollectionEntry<'journal'>;
export const TIME_ZONE = 'Asia/Kolkata';

/**
 * Local review only. With SHOW_SCHEDULED=true, future posts are included and badged "Scheduled for ...".
 * Never set this in production.
 */
const showScheduled = () => (process.env.SHOW_SCHEDULED ?? import.meta.env.SHOW_SCHEDULED) === 'true';

/**
 * A post is published when draft is false AND pubDate <= now. Dates are absolute instants (pubDate carries the
 * +05:30 offset), so comparing them to the build time is the same as comparing the Asia/Kolkata times.
 * Drafts are never included, even with SHOW_SCHEDULED.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection('journal', ({ data }) => !data.draft);
  return posts
    .filter((p) => showScheduled() || p.data.pubDate.valueOf() <= now)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const isScheduled = (p: Post) => p.data.pubDate.valueOf() > Date.now();

export const postUrl = (p: Post | string) => `/journal/${typeof p === 'string' ? p : p.id}/`;

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TIME_ZONE });
export const formatDate = (d: Date) => dateFmt.format(d);
/** ISO date in IST, for <time datetime> */
export const isoDate = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(d);

export const wordCount = (p: Post) =>
  (p.body ?? '')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
export const readingMinutes = (p: Post) => Math.max(1, Math.round(wordCount(p) / 220));

/** Meta title: the post's own, or "Title | AadiVed" when that fits in 60 characters */
export const postMetaTitle = (p: Post) => p.data.metaTitle ?? seoTitle(p.data.title, ['AadiVed Journal', 'AadiVed']);

// ------------------------------------------------------------------ categories
export interface CategoryInfo {
  label: Post['data']['category'];
  slug: string;
  seoHead: string;
  description: string;
}
export const categories: CategoryInfo[] = [
  {
    label: 'Yoga',
    slug: 'yoga',
    seoHead: 'Yoga Articles from Hinjawadi, Pune',
    description: 'Yoga articles from AadiVed in Hinjawadi, Pune: what to expect in class, easing desk stiffness and choosing offline or online yoga. Book a session.',
  },
  {
    label: 'Mind & Sound',
    slug: 'mind-and-sound',
    seoHead: 'Meditation & Sound Healing Articles',
    description: 'Articles on meditation, breathwork, sound healing and grounding from AadiVed in Hinjawadi, Pune, with simple practices you can try at home today.',
  },
  {
    label: 'Wellness Programs',
    slug: 'wellness-programs',
    seoHead: 'Hormonal Balance & Stress Articles',
    description: 'Articles on yoga for hormonal balance, stress, anxiety, energy and prenatal wellbeing from AadiVed in Hinjawadi, Pune. General information, not medical advice.',
  },
  {
    label: 'Practice Tips',
    slug: 'practice-tips',
    seoHead: 'Yoga Practice Tips from Pune',
    description: 'Practical yoga tips from AadiVed in Hinjawadi, Pune: building a routine that lasts, short morning sequences and getting more from every class you attend.',
  },
];
export const categoryOf = (label: string) => categories.find((c) => c.label === label)!;
export const categoryUrl = (label: string) => `/journal/category/${categoryOf(label).slug}/`;
/** Only categories that have at least one published post get a page */
export const categoriesWithPosts = (posts: Post[]) => categories.filter((c) => posts.some((p) => p.data.category === c.label));

// ------------------------------------------------------------------ service a post leads to
export interface ServiceLink {
  title: string;
  href: string;
  bookHref: string;
  blurb: string;
}
export function resolveService(slug: string): ServiceLink {
  const practice = getPractice(slug);
  const stub = stubPages.find((p) => p.slug === slug);
  if (practice && stub) {
    return {
      title: stub.title,
      href: `/${slug}/`,
      bookHref: `/contact/?interest=${interestId(slug)}#book`,
      blurb: practice.tagline,
    };
  }
  if (slug === 'online-classes') {
    return {
      title: 'Live online classes',
      href: '/online-classes/',
      bookHref: '/contact/?interest=intro&format=online#book',
      blurb: 'The same guided practice, wherever you are, with live cues and corrections.',
    };
  }
  if (slug === 'about/anupriya') {
    return {
      title: 'Meet Anupriya',
      href: '/about/anupriya/',
      bookHref: '/contact/?interest=intro#book',
      blurb: `Founder of ${site.shortName} and a 500-hour Yoga Alliance Registered Practitioner.`,
    };
  }
  throw new Error(`Unknown relatedService "${slug}" in a journal post`);
}

// ------------------------------------------------------------------ related posts
/** Up to `limit` other published posts, ranked by shared service, category and tags */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => {
      let score = 0;
      if (p.data.relatedService === post.data.relatedService) score += 4;
      if (p.data.category === post.data.category) score += 2;
      score += p.data.tags.filter((t) => post.data.tags.includes(t)).length;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map((x) => x.p);
}
