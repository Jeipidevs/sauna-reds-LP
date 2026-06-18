import sharp from 'sharp';
import { writeFileSync } from 'fs';

// OG Image 1200×630 — dark background with centered brand text
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g1" cx="30%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#3a0000" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="g2" cx="75%" cy="65%" r="50%">
      <stop offset="0%" stop-color="#cc0000" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>

  <!-- Decorative lines -->
  <line x1="80" y1="280" x2="420" y2="280" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
  <line x1="780" y1="280" x2="1120" y2="280" stroke="#d4af37" stroke-width="1" opacity="0.5"/>

  <!-- Brand name -->
  <text x="600" y="270" font-family="Georgia, serif" font-size="96" font-weight="700"
        fill="#ffffff" text-anchor="middle" letter-spacing="8">SAUNA</text>
  <text x="600" y="380" font-family="Georgia, serif" font-size="110" font-weight="700"
        fill="#cc0000" text-anchor="middle" letter-spacing="12">REDS</text>

  <!-- Tagline -->
  <text x="600" y="450" font-family="Arial, sans-serif" font-size="22" font-weight="400"
        fill="#d4af37" text-anchor="middle" letter-spacing="4">PRAZER E SOFISTICAÇÃO</text>

  <!-- Location -->
  <text x="600" y="510" font-family="Arial, sans-serif" font-size="18"
        fill="#888888" text-anchor="middle" letter-spacing="2">Capão da Canoa · RS · saunaredsoficial.com.br</text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile('public/og-image.jpg');
console.log('✓ public/og-image.jpg (1200×630)');

// Favicon 32×32
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <rect width="32" height="32" rx="4" fill="#0a0a0a"/>
  <text x="16" y="23" font-family="Georgia, serif" font-size="18" font-weight="700"
        fill="#cc0000" text-anchor="middle">SR</text>
</svg>`;

await sharp(Buffer.from(faviconSvg))
  .png()
  .toFile('public/favicon-32.png');

// Apple touch icon 180×180
const appleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <rect width="180" height="180" rx="20" fill="#0a0a0a"/>
  <rect width="180" height="180" rx="20" fill="#1a0000"/>
  <text x="90" y="78" font-family="Georgia, serif" font-size="56" font-weight="700"
        fill="#cc0000" text-anchor="middle">SR</text>
  <text x="90" y="120" font-family="Arial, sans-serif" font-size="16" font-weight="600"
        fill="#d4af37" text-anchor="middle" letter-spacing="3">REDS</text>
</svg>`;

await sharp(Buffer.from(appleSvg))
  .png()
  .toFile('public/apple-touch-icon.png');
console.log('✓ public/apple-touch-icon.png (180×180)');

// favicon.ico (use 32px png as ico — browsers accept PNG-in-ICO)
// Write raw ICO header pointing to 32x32 PNG
const pngData = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer();
// Minimal ICO: ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes) + PNG data
const ico = Buffer.alloc(6 + 16 + pngData.length);
ico.writeUInt16LE(0, 0);      // reserved
ico.writeUInt16LE(1, 2);      // type: ICO
ico.writeUInt16LE(1, 4);      // image count
ico.writeUInt8(32, 6);        // width
ico.writeUInt8(32, 7);        // height
ico.writeUInt8(0, 8);         // color count
ico.writeUInt8(0, 9);         // reserved
ico.writeUInt16LE(0, 10);     // color planes
ico.writeUInt16LE(32, 12);    // bits per pixel
ico.writeUInt32LE(pngData.length, 14); // size of image data
ico.writeUInt32LE(22, 18);    // offset of image data
pngData.copy(ico, 22);
writeFileSync('public/favicon.ico', ico);
console.log('✓ public/favicon.ico');
