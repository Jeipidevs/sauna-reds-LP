import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processLogo() {
  try {
    // Resize the logo and add padding/shadow effect
    const roundedRadius = 24;
    
    // Create a canvas with shadow background
    await sharp({
      create: {
        width: 380,
        height: 290,
        channels: 3,
        background: { r: 245, g: 245, b: 245 }
      }
    })
    .toBuffer()
    .then(canvas => {
      // Add shadow effect by creating a darker layer beneath
      return sharp({
        create: {
          width: 390,
          height: 300,
          channels: 3,
          background: { r: 200, g: 200, b: 200 }
        }
      })
      .composite([
        {
          input: canvas,
          top: 2,
          left: 5
        }
      ])
      .toBuffer();
    })
    .then(shadowed => {
      // Composite original logo on top
      return sharp('public/images/logo-neon.jpg')
        .resize(360, 270, { fit: 'contain', background: { r: 245, g: 245, b: 245 } })
        .toBuffer()
        .then(logoBuffer => {
          return sharp({
            create: {
              width: 390,
              height: 300,
              channels: 3,
              background: { r: 255, g: 255, b: 255 }
            }
          })
          .composite([
            {
              input: shadowed,
              top: 0,
              left: 0
            },
            {
              input: logoBuffer,
              top: 15,
              left: 15
            }
          ])
          .blur(1)
          .jpeg({ quality: 92, progressive: true })
          .toFile('public/images/logo-neon.jpg');
        });
    });

    console.log('✓ Logo JPG processada com profundidade');

    // Create WebP version
    await sharp('public/images/logo-neon.jpg')
      .webp({ quality: 90 })
      .toFile('public/images/logo-neon.webp');

    console.log('✓ Logo WebP criada');
    console.log('✓ Logo pronta!');
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

processLogo();
