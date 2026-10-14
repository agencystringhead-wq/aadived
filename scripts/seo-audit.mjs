// On-page SEO audit of the built site. Run after `npm run build`:  npm run seo:audit
// Reads every HTML file in dist/ and fails (exit 1) on errors. Warnings are printed but do not fail.
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ORIGIN = 'https://aadived.com';
const NOINDEX = new Set(['/404/', '/privacy/', '/terms/']);

const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}  ${msg}`);
const warn = (page, msg) => warnings.push(`${page}  ${msg}`);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const decode = (s = '') =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
const attr = (tag, name) => decode((tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1]);
const meta = (html, key, val) => {
  const tags = html.match(/<meta\s[^>]*>/g) || [];
  const t = tags.find((m) => new RegExp(`${key}="${val}"`).test(m));
  return t ? attr(t, 'content') : undefined;
};

const files = (await walk(dist)).filter((f) => f.endsWith('.html'));
const pages = [];
for (const f of files) {
  let rel = '/' + path.relative(dist, f).replaceAll('\\', '/');
  rel = rel === '/404.html' ? '/404/' : rel.replace(/index\.html$/, '');
  pages.push({ path: rel, html: await readFile(f, 'utf8') });
}
pages.sort((a, b) => a.path.localeCompare(b.path));

const titles = new Map();
const descs = new Map();
const defined = new Map(); // @id -> pages that define it with full data
const hrefsByPage = new Map();
const rows = [];

for (const { path: p, html } of pages) {
  // ---- html lang
  if (!/<html[^>]*\slang="en-IN"/.test(html)) err(p, 'html lang is not en-IN');

  // ---- title
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1]);
  if (!title) err(p, 'missing <title>');
  else {
    if (title.length > 60) err(p, `title is ${title.length} characters (max 60): ${title}`);
    else if (title.length < 50 && !NOINDEX.has(p)) warn(p, `title is ${title.length} characters (aim for 50 to 60): ${title}`);
    titles.set(title, [...(titles.get(title) ?? []), p]);
  }

  // ---- description
  const desc = meta(html, 'name', 'description');
  if (!desc) err(p, 'missing meta description');
  else {
    if (desc.length < 120 || desc.length > 160) err(p, `description is ${desc.length} characters (allowed 120 to 160)`);
    else if (desc.length < 140) warn(p, `description is ${desc.length} characters (aim for 140 to 160)`);
    if (/[–—]/.test(desc + title)) err(p, 'title or description contains a dash character (no em dashes)');
    descs.set(desc, [...(descs.get(desc) ?? []), p]);
  }

  // ---- H1 and heading order
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) err(p, `has ${h1s} H1 elements (needs exactly 1)`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      err(p, `heading level skipped: h${levels[i - 1]} then h${levels[i]}`);
      break;
    }
  }

  // ---- canonical
  const canon = (html.match(/<link\s[^>]*rel="canonical"[^>]*>/) || [])[0];
  const canonHref = canon ? attr(canon, 'href') : undefined;
  const expected = ORIGIN + p;
  if (!canonHref) err(p, 'missing canonical');
  else if (canonHref !== expected) err(p, `canonical is ${canonHref}, expected ${expected}`);

  // ---- robots
  const robots = meta(html, 'name', 'robots');
  if (NOINDEX.has(p) && !/noindex/.test(robots ?? '')) err(p, 'should be noindex');
  if (!NOINDEX.has(p) && /noindex/.test(robots ?? '')) err(p, 'is noindex but should be indexable');

  // ---- Open Graph and Twitter
  for (const k of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image', 'og:locale']) {
    if (!meta(html, 'property', k)) err(p, `missing ${k}`);
  }
  if (!meta(html, 'name', 'twitter:card')) err(p, 'missing twitter:card');
  if (meta(html, 'property', 'og:locale') && meta(html, 'property', 'og:locale') !== 'en_IN') err(p, 'og:locale is not en_IN');
  if (meta(html, 'property', 'og:url') && meta(html, 'property', 'og:url') !== canonHref) err(p, 'og:url differs from canonical');
  if (meta(html, 'property', 'og:title') !== title) err(p, 'og:title differs from <title>');
  if (p === '/about/anupriya/' && meta(html, 'property', 'og:type') !== 'profile') err(p, 'og:type should be profile');

  // ---- images
  for (const tag of html.match(/<img\s[^>]*>/g) || []) {
    // An empty alt can render as a bare `alt` attribute, which is valid and marks the image as decorative
    if (!/\salt(=|\s|\/|>)/.test(tag)) err(p, `image without alt attribute: ${(attr(tag, 'src') ?? '').slice(0, 60)}`);
    const a = attr(tag, 'alt') ?? '';
    if (/^(image|picture|photo) of\b/i.test(a)) warn(p, `alt starts with "image of": ${a.slice(0, 50)}`);
  }

  // ---- structured data
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const idsOnPage = new Map();
  const types = [];
  for (const raw of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      err(p, 'JSON-LD does not parse');
      continue;
    }
    types.push(data['@type']);
    const id = data['@id'];
    if (id) {
      idsOnPage.set(id, (idsOnPage.get(id) ?? 0) + 1);
      if (data['@type'] !== 'WebSite' && Object.keys(data).filter((k) => !['@context', '@type', '@id', 'name'].includes(k)).length > 0) {
        defined.set(id, [...(defined.get(id) ?? []), p]);
      }
    }
  }
  for (const [id, n] of idsOnPage) if (n > 1) err(p, `duplicate @id on the page: ${id}`);
  const isService = /^\/(yoga|healing|programs)\//.test(p);
  if (isService) for (const t of ['Service', 'BreadcrumbList']) if (!types.includes(t)) err(p, `missing ${t} JSON-LD`);
  if (isService && html.includes('data-faq') === false && !/<details/.test(html)) warn(p, 'no FAQ accordion found');
  if (p === '/' && !types.includes('HealthClub')) err(p, 'homepage missing HealthClub JSON-LD');
  if (p === '/about/anupriya/' && !types.includes('Person')) err(p, 'missing Person JSON-LD');
  if (!['/', '/404/'].includes(p) && !types.includes('BreadcrumbList')) err(p, 'missing BreadcrumbList JSON-LD');

  // ---- links, for the orphan check and internal linking rules
  const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => decode(m[1]));
  hrefsByPage.set(p, hrefs);
  if (isService) {
    const related = new Set(hrefs.filter((h) => /^\/(yoga|healing|programs)\/[^/]+\/$/.test(h) && h !== p));
    if (related.size < 2) err(p, `links to ${related.size} related practices (needs 2 to 3)`);
    if (!hrefs.some((h) => h.startsWith('/contact/'))) err(p, 'no link to /contact/');
  }

  rows.push({ path: p, title, desc, tl: title?.length ?? 0, dl: desc?.length ?? 0 });
}

for (const [t, ps] of titles) if (ps.length > 1) err(ps.join(', '), `duplicate title: ${t}`);
for (const [d, ps] of descs) if (ps.length > 1) err(ps.join(', '), `duplicate description: ${d.slice(0, 60)}...`);
for (const [id, ps] of defined) if (ps.length > 1) err(ps.join(', '), `@id ${id} is defined with full data on more than one page`);

// ---- orphan pages: every indexable page must be linked from another page
const linked = new Set();
for (const [from, hrefs] of hrefsByPage) {
  for (const h of hrefs) {
    const clean = h.split('#')[0].split('?')[0];
    if (clean && clean !== from) linked.add(clean);
  }
}
for (const { path: p } of pages) if (p !== '/' && !NOINDEX.has(p) && !linked.has(p)) err(p, 'orphan page: no other page links to it');

// ---- sitemap and robots.txt
try {
  const smIndex = await readFile(path.join(dist, 'sitemap-index.xml'), 'utf8');
  const smFile = await readFile(path.join(dist, 'sitemap-0.xml'), 'utf8');
  if (!smIndex.includes(`${ORIGIN}/sitemap-0.xml`)) err('sitemap-index.xml', 'does not reference sitemap-0.xml on the live origin');
  const locs = [...smFile.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const indexable = pages.map((x) => x.path).filter((x) => !NOINDEX.has(x));
  for (const l of locs) {
    if (!l.startsWith(ORIGIN + '/')) err('sitemap', `not on ${ORIGIN}: ${l}`);
    if (!l.endsWith('/')) err('sitemap', `no trailing slash: ${l}`);
    if (NOINDEX.has(l.replace(ORIGIN, ''))) err('sitemap', `contains a noindex page: ${l}`);
  }
  for (const x of indexable) if (!locs.includes(ORIGIN + x)) err('sitemap', `missing indexable page: ${x}`);
} catch (e) {
  err('sitemap', `could not read sitemap files: ${e.message}`);
}
try {
  const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) err('robots.txt', 'missing the Sitemap line');
  if (!/Disallow:\s*\/404/.test(robots)) err('robots.txt', 'missing Disallow: /404');
} catch {
  err('robots.txt', 'missing from dist/');
}
for (const name of ['og-image.jpg']) await access(path.join(dist, name)).catch(() => err(name, 'missing from dist/'));

// ---- report
console.log(`SEO audit: ${pages.length} pages\n`);
console.log('path'.padEnd(30), 'title'.padStart(5), 'desc'.padStart(5));
for (const r of rows) console.log(r.path.padEnd(30), String(r.tl).padStart(5), String(r.dl).padStart(5));
if (warnings.length) console.log(`\nWarnings (${warnings.length}):\n  ` + warnings.join('\n  '));
if (errors.length) {
  console.log(`\nErrors (${errors.length}):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('\nNo errors.');
