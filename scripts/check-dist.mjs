// Fails if dist/ contains any .jpg/.jpeg/.png/.avif other than the allowed exceptions:
// the icons, og-image.jpg, and the per-page Open Graph JPGs under og/ (see scripts/generate-og.mjs).
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const allowed = new Set(['og-image.jpg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']);
// favicon.ico is not a raster extension we check, so it needs no entry here.
const banned = /\.(jpe?g|png|avif)$/i;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(dist);
const bad = files.filter((f) => {
  const rel = path.relative(dist, f).replaceAll('\\', '/');
  return banned.test(rel) && !allowed.has(rel) && !/^og\/(journal\/)?[a-z0-9-]+\.jpg$/.test(rel);
});

if (bad.length) {
  console.error('Disallowed image formats in dist/:');
  bad.forEach((f) => console.error('  ' + path.relative(dist, f)));
  process.exit(1);
}
console.log(`dist check passed (${files.length} files, only allowed non-WebP exceptions present).`);
