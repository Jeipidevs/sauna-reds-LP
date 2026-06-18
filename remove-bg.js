import sharp from 'sharp';
import fs from 'fs';

async function removeBg() {
  try {
    // Load the image and convert to PNG with transparency
    const image = sharp('logo.jpeg');
    
    // Get metadata to understand the image
    const metadata = await image.metadata();
    console.log(`Image: ${metadata.width}x${metadata.height}, ${metadata.space}`);
    
    // Remove white background by making it transparent
    const buffer = await image
      .ensureAlpha()
      .toBuffer();
    
    // Use sharp to remove white pixels (background)
    await sharp(buffer, {
      raw: {
        width: metadata.width,
        height: metadata.height,
        channels: 4
      }
    })
    .toColorspace('srgb')
    .png()
    .toFile('temp-logo.png');
    
    // Now read and process pixel by pixel
    const processed = await sharp('temp-logo.png')
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = processed;
    const { width, height, channels } = info;
    
    // Remove white background (R>240, G>240, B>240)
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If pixel is white or very light, make it transparent
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0;
      }
    }
    
    // Save the result
    await sharp(data, {
      raw: { width, height, channels: 4 }
    })
    .png()
    .toFile('public/images/logo-neon.png');
    
    // Clean up temp file
    fs.unlinkSync('temp-logo.png');
    
    console.log('✓ Logo com fundo transparente criada');
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
}

removeBg();
