import sharp from 'sharp';
import { mkdirSync } from 'fs';

const WA = 'C:/Projetos/sauna-reds-mkt/WhatsApp Unknown 2026-06-05 at 20.48.02';
const ROOT = 'C:/Projetos/sauna-reds-mkt';
const OUT = 'public/images';

mkdirSync(OUT, { recursive: true });

const jobs = [
  // Logo — neon clean on black
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.49 (2).jpeg`, name: 'logo-neon', w: 400, q: 88 },
  // Hero background — interior pista + neon ceiling
  { src: `${ROOT}/WhatsApp Image 2026-06-05 at 20.14.50 (2).jpeg`, name: 'hero-bg', w: 1920, q: 82 },
  // Fachada with moon — OG image source + gallery
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.48 (1).jpeg`, name: 'fachada-lua', w: 1200, q: 84 },
  // Gallery images
  { src: `${ROOT}/WhatsApp Image 2026-06-05 at 20.14.50 (3).jpeg`, name: 'salao', w: 900, q: 82 },
  { src: `${ROOT}/WhatsApp Image 2026-06-05 at 20.14.50 (4).jpeg`, name: 'bar-neons', w: 800, q: 80 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.51 (1).jpeg`, name: 'recepcao', w: 800, q: 80 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.48.jpeg`, name: 'sinuca', w: 800, q: 80 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.49 (1).jpeg`, name: 'suite', w: 800, q: 80 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.48 (2).jpeg`, name: 'neon-viva', w: 800, q: 80 },
  // Acompanhantes (portrait)
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.51 (3).jpeg`, name: 'acomp-pole', w: 600, q: 82 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.51 (4).jpeg`, name: 'acomp-branca', w: 600, q: 82 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.52 (1).jpeg`, name: 'acomp-lingerie', w: 600, q: 82 },
  // Drinks
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.51.jpeg`, name: 'drinks-cerveja', w: 600, q: 80 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.50 (1).jpeg`, name: 'drinks-heineken', w: 600, q: 80 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.50 (2).jpeg`, name: 'drinks-whisky', w: 600, q: 80 },
  { src: `${WA}/WhatsApp Image 2026-06-05 at 20.47.50 (3).jpeg`, name: 'drinks-redbull', w: 600, q: 80 },
];

for (const { src, name, w, q } of jobs) {
  const base = sharp(src).resize(w, null, { withoutEnlargement: true });
  await base.clone().webp({ quality: q }).toFile(`${OUT}/${name}.webp`);
  await base.clone().jpeg({ quality: q, mozjpeg: true }).toFile(`${OUT}/${name}.jpg`);
  console.log(`✓ ${name}.webp / .jpg`);
}

// OG image — crop fachada-lua to 1200×630
await sharp(`${WA}/WhatsApp Image 2026-06-05 at 20.47.48 (1).jpeg`)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/og-image.jpg');
console.log('✓ public/og-image.jpg (1200×630 from fachada-lua)');

// Favicon from clean neon logo
const logoSrc = `${WA}/WhatsApp Image 2026-06-05 at 20.47.49 (2).jpeg`;
const pngData = await sharp(logoSrc).resize(32, 32, { fit: 'cover', position: 'centre' }).png().toBuffer();
const png180 = await sharp(logoSrc).resize(180, 180, { fit: 'cover', position: 'centre' }).png().toBuffer();

// ICO file
const ico = Buffer.alloc(6 + 16 + pngData.length);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6); ico.writeUInt8(32, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(0, 10); ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(pngData.length, 14); ico.writeUInt32LE(22, 18);
pngData.copy(ico, 22);
import { writeFileSync } from 'fs';
writeFileSync('public/favicon.ico', ico);
writeFileSync('public/apple-touch-icon.png', png180);
console.log('✓ public/favicon.ico  ✓ public/apple-touch-icon.png');
