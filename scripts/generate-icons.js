const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 24, 32, 64, 192, 512];
const inputFile = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputFile = path.join(outputDir, size === 64 ? 'favicon.ico' : `logo${size}.png`);
      await sharp(inputFile)
        .resize(size, size)
        .toFile(outputFile);
      console.log(`Generated ${outputFile}`);
    }
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 