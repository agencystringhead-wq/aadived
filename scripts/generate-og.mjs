// Generates the 1200x630 JPG Open Graph images in public/og/ from each page's hero image.
// WhatsApp, Facebook and LinkedIn previews often ignore WebP, so these are the only extra JPGs the site
// ships (besides og-image.jpg). check-dist allows files under og/ for this reason.
// Run with: npm run assets:og   (re-run whenever a hero image changes, then commit public/og/)
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const img = (p) => path.join(root, 'src/assets/images', p);
const out = path.join(root, 'public/og');
await mkdir(out, { recursive: true });

const OLIVE = { r: 0x4b, g: 0x52, b: 0x38 };
const W = 1200;
const H = 630;

// Landscape heroes: a straight cover crop
const landscape = {
  about: img('aadived/beach-yoga-wide.webp'),
  anupriya: img('anupriya/anupriya-wide.webp'),
  'offline-classes': img('stock/formats-offline.webp'),
  'online-classes': img('stock/formats-online.webp'),
};

// Portrait heroes: olive card, white logo on the left, arch-shaped photo on the right
const stock = (n) => img(`stock/service-${n}.webp`);
const portrait = {
  home: img('stock/hero-mudra.webp'),
  classes: img('aadived/beach-yoga-portrait.webp'),
  'one-on-one': stock('private-sessions'),
  'guided-yoga': stock('guided-yoga'),
  beginners: stock('beginners'),
  experienced: stock('experienced'),
  prenatal: stock('prenatal'),
  'private-sessions': stock('private-sessions'),
  meditation: stock('meditation'),
  breathwork: stock('breathwork'),
  'sound-healing': stock('sound-healing'),
  grounding: stock('grounding'),
  'hormonal-balance': stock('hormonal-balance'),
  'stress-management': stock('stress-management'),
  'anxiety-relief': stock('anxiety-relief'),
  'energy-reset': stock('energy-reset'),
  'daily-practice': img('aadived/beach-yoga-portrait.webp'),
};

const jpeg = { quality: 82, mozjpeg: true };

for (const [name, src] of Object.entries(landscape)) {
  await sharp(src).resize(W, H, { fit: 'cover', position: 'attention' }).jpeg(jpeg).toFile(path.join(out, `${name}.jpg`));
}

const archW = 456;
const archH = 570;
const archMask = Buffer.from(
  `<svg width="${archW}" height="${archH}"><path d="M0 ${archH} V${archW / 2} A${archW / 2} ${archW / 2} 0 0 1 ${archW} ${archW / 2} V${archH - 24} Q${archW} ${archH} ${archW - 24} ${archH} H24 Q0 ${archH} 0 ${archH - 24} Z" fill="#fff"/></svg>`,
);
const logo = await sharp(img('aadived-logo-white-2400.webp')).resize({ width: 420 }).toBuffer();
const logoMeta = await sharp(logo).metadata();

for (const [name, src] of Object.entries(portrait)) {
  const photo = await sharp(src)
    .resize(archW, archH, { fit: 'cover', position: 'attention' })
    .composite([{ input: archMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: OLIVE } })
    .composite([
      { input: logo, left: 110, top: Math.round((H - (logoMeta.height ?? 350)) / 2) },
      { input: photo, left: W - archW - 110, top: Math.round((H - archH) / 2) },
    ])
    .jpeg(jpeg)
    .toFile(path.join(out, `${name}.jpg`));
}

// Journal posts: a 16:9 featured image cropped to 1200x630, named after the post slug
const journalDir = img('journal');
await mkdir(path.join(out, 'journal'), { recursive: true });
let journalCount = 0;
for (const f of await readdir(journalDir).catch(() => [])) {
  if (!f.endsWith('.webp')) continue;
  await sharp(path.join(journalDir, f)).resize(W, H, { fit: 'cover', position: 'attention' }).jpeg(jpeg).toFile(path.join(out, 'journal', f.replace('.webp', '.jpg')));
  journalCount++;
}

console.log(`Generated ${Object.keys(landscape).length + Object.keys(portrait).length + journalCount} images in public/og/`);
