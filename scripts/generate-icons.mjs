// One-off generator for the only non-WebP files the site ships (see README, "Image format exception"):
//   public/og-image.jpg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
// Also writes WebP favicons.
// Sources (the vector logo masters in design-source/):
//   aadived-favicon-source-512.webp        icons (olive figure on transparent, flattened onto ivory here)
//   aadived-logo-square-olive-2048.webp    og-image.jpg
// Run with: npm run assets:generate
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const faviconSrc = path.join(root, 'design-source/aadived-favicon-source-512.webp');
const ogSrc = path.join(root, 'design-source/aadived-logo-square-olive-2048.webp');
const out = path.join(root, 'public');
await mkdir(out, { recursive: true });

const OLIVE = { r: 0x4b, g: 0x52, b: 0x38 };
const IVORY = { r: 0xfb, g: 0xf8, b: 0xf2 };

// Square mark: the olive figure on ivory, so it reads on both light and dark browser tabs.
function mark(size) {
  return sharp(faviconSrc).resize(size, size, { fit: 'contain', background: { ...IVORY, alpha: 0 } }).flatten({ background: IVORY });
}

// PNGs for the manifest and iOS
await mark(180).png().toFile(path.join(out, 'apple-touch-icon.png'));
await mark(192).png().toFile(path.join(out, 'icon-192.png'));
await mark(512).png().toFile(path.join(out, 'icon-512.png'));

// WebP favicons
await mark(32).webp({ quality: 90 }).toFile(path.join(out, 'favicon-32.webp'));
await mark(180).webp({ quality: 90 }).toFile(path.join(out, 'favicon-180.webp'));

// favicon.ico: a single 32x32 PNG-compressed entry
const png32 = await mark(32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await writeFile(path.join(out, 'favicon.ico'), Buffer.concat([header, png32]));

// OG image 1200x630: the square logo (white on olive) centred on a #4B5238 field
const logo = await sharp(ogSrc).resize({ height: 630 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: OLIVE } })
  .composite([{ input: logo, gravity: 'centre' }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(out, 'og-image.jpg'));

console.log('Generated icons and og-image.jpg in public/');
