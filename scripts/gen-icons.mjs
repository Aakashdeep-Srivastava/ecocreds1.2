// Generates a device-compatible icon set from the CarbonGero emblem.
// Composites the transparent emblem onto the brand charcoal (#0B0D0C).
// Run: node scripts/gen-icons.mjs
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SRC = 'C:/Users/aakas/Downloads/Glossy Black and Lime Ribbon Emblem.png';
const PUB = 'public';
const BG = { r: 11, g: 13, b: 12, alpha: 1 }; // #0B0D0C charcoal

if (!existsSync(SRC)) {
  console.error('Source emblem not found:', SRC);
  process.exit(1);
}

// Pre-trim transparent margins so the mark fills the frame nicely.
const trimmed = await sharp(SRC).trim({ threshold: 12 }).png().toBuffer();

/**
 * Build a square icon: charcoal background + centered emblem.
 * coverage = fraction of the canvas the emblem spans (smaller = more padding).
 */
async function makeIcon(size, coverage = 0.74, round = 0) {
  const inner = Math.round(size * coverage);
  const logo = await sharp(trimmed)
    .resize(inner, inner, { fit: 'inside', withoutEnlargement: false })
    .toBuffer();

  let base = sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  }).composite([{ input: logo, gravity: 'center' }]);

  let out = await base.png().toBuffer();

  if (round > 0) {
    const r = Math.round(size * round);
    const mask = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}"/></svg>`
    );
    out = await sharp(out)
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer();
  }
  return out;
}

async function write(name, buf) {
  await writeFile(`${PUB}/${name}`, buf);
  console.log('wrote', name, `(${(buf.length / 1024).toFixed(1)} KB)`);
}

await mkdir(PUB, { recursive: true });

// Favicons (square, light rounding for the tab)
const f16 = await makeIcon(16, 0.86);
const f32 = await makeIcon(32, 0.84);
const f48 = await makeIcon(48, 0.82);
await write('favicon-16x16.png', f16);
await write('favicon-32x32.png', f32);

// Multi-size .ico for Chrome/legacy tabs
const ico = await pngToIco([f16, f32, f48]);
await write('favicon.ico', ico);

// Apple touch icon (no transparency; Apple masks its own corners)
await write('apple-touch-icon.png', await makeIcon(180, 0.72));

// Android / PWA (standard)
await write('android-chrome-192x192.png', await makeIcon(192, 0.76, 0.18));
await write('android-chrome-512x512.png', await makeIcon(512, 0.76, 0.18));

// Maskable (extra safe-zone padding, full-bleed square so OS masks cleanly)
await write('icon-maskable-512x512.png', await makeIcon(512, 0.58));

// Next.js app-dir conventions (favicon + apple) — large PNG the framework resizes
await write('icon.png', await makeIcon(512, 0.76, 0.18));
await write('apple-icon.png', await makeIcon(180, 0.72));

console.log('\\nAll icons generated.');
