// JSON-LD builders. Everything is derived from site.ts, reviews.ts and practices.ts.
// Each entity has exactly one @id. The full HealthClub node is defined once, on the homepage;
// other pages refer to it by @id. Check any change at https://validator.schema.org/.
import { site } from './site';
import { rating, reviews } from './reviews';

const CTX = 'https://schema.org';

export const url = (path: string) => new URL(path, site.url).href;

export const ids = {
  business: `${site.url}/#business`,
  website: `${site.url}/#website`,
  person: `${site.url}/about/anupriya/#person`,
};

/** "Mo-Fr 08:00-10:00" from the structured timings in site.ts */
function openingHours(): string {
  const { dayOfWeek, opens, closes } = site.timings.schema;
  const short = (d: string) => d.slice(0, 2);
  const range = dayOfWeek.length > 1 ? `${short(dayOfWeek[0])}-${short(dayOfWeek[dayOfWeek.length - 1])}` : short(dayOfWeek[0]);
  return `${range} ${opens}-${closes}`;
}

/** A reference to the HealthClub, for use inside other nodes */
export const businessRef = { '@type': 'HealthClub', '@id': ids.business, name: site.name } as const;

export function websiteSchema() {
  return {
    '@context': CTX,
    '@type': 'WebSite',
    '@id': ids.website,
    name: site.name,
    url: site.url,
    inLanguage: site.locale,
    publisher: { '@id': ids.business },
  };
}

// Not included, because we do not have the data: geo coordinates and priceRange.
export function businessSchema() {
  return {
    '@context': CTX,
    '@type': 'HealthClub',
    '@id': ids.business,
    name: site.name,
    url: site.url,
    description: site.description,
    image: url('/og-image.jpg'),
    logo: url('/icon-512.png'),
    telephone: site.phone.schema,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: { '@type': 'City', name: 'Pune' },
    openingHours: openingHours(),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: site.timings.schema.dayOfWeek,
      opens: site.timings.schema.opens,
      closes: site.timings.schema.closes,
    },
    hasMap: site.google.profile,
    sameAs: [site.instagram.url, site.google.profile],
    founder: { '@type': 'Person', '@id': ids.person, name: site.founder },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: String(reviews.length),
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function serviceSchema(opts: { path: string; name: string; serviceType: string; description: string }) {
  return {
    '@context': CTX,
    '@type': 'Service',
    '@id': `${url(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: url(opts.path),
    provider: businessRef,
    areaServed: { '@type': 'City', name: 'Pune' },
  };
}

/** FAQPage from the visible accordion. Answers that still contain a [placeholder] are left out. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  const usable = faqs.filter((f) => !f.a.includes('[') && !f.q.includes('['));
  if (!usable.length) return null;
  return {
    '@context': CTX,
    '@type': 'FAQPage',
    mainEntity: usable.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// Only facts we hold: name, role, the employer and the 500-hour credential from the site copy.
export function personSchema() {
  return {
    '@context': CTX,
    '@type': 'Person',
    '@id': ids.person,
    name: site.founder,
    url: url('/about/anupriya/'),
    jobTitle: 'Founder, 500-hour Yoga Alliance Registered Practitioner',
    worksFor: businessRef,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: '500-hour Yoga Alliance RYT',
      credentialCategory: 'certification',
    },
  };
}

/** Article for a journal post. The author is the Organization until a named reviewer is set. */
export function articleSchema(opts: {
  post: { id: string; data: { title: string; description: string; pubDate: Date; updatedDate?: Date; category: string; tags: string[]; author: string; reviewedBy?: string } };
  path: string;
  image: string;
  wordCount: number;
}) {
  const d = opts.post.data;
  const organization = { '@type': 'Organization', name: site.name, url: site.url };
  return {
    '@context': CTX,
    '@type': 'Article',
    '@id': `${url(opts.path)}#article`,
    headline: d.title,
    description: d.description,
    image: url(opts.image),
    datePublished: d.pubDate.toISOString(),
    dateModified: (d.updatedDate ?? d.pubDate).toISOString(),
    author: organization,
    ...(d.reviewedBy ? { reviewedBy: { '@type': 'Person', name: d.reviewedBy } } : {}),
    publisher: { ...organization, logo: { '@type': 'ImageObject', url: url('/icon-512.png') } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url(opts.path) },
    inLanguage: site.locale,
    articleSection: d.category,
    keywords: d.tags.join(', '),
    wordCount: opts.wordCount,
  };
}
