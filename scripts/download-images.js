const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCanvas, loadImage } = require('canvas');

// Create directories if they don't exist
const dirs = ['public/cards', 'public/cards/raw'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Function to process an image into card format
async function processCardImage(inputPath, outputPath, cardName) {
    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 400, 600);

    // Load and draw the image
    const image = await loadImage(inputPath);
    
    // Calculate scaling to fit the image while maintaining aspect ratio
    const scale = Math.min(380 / image.width, 400 / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (400 - width) / 2;
    const y = (400 - height) / 2;

    ctx.drawImage(image, x, y, width, height);

    // Add card name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(cardName, 200, 550);

    // Save the processed image
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(outputPath, buffer);
}

// List of image sources (you'll need to replace these with actual sources)
const imageSources = {
    'odin': 'https://example.com/odin.jpg',
    'thor': 'https://example.com/thor.jpg',
    // Add more image sources here
};

// Download and process images
async function downloadAndProcessImages() {
    for (const [cardId, url] of Object.entries(imageSources)) {
        const rawPath = path.join('public/cards/raw', `${cardId}.jpg`);
        const processedPath = path.join('public/cards', `${cardId}.jpg`);

        // Download image
        await new Promise((resolve, reject) => {
            https.get(url, (response) => {
                if (response.statusCode === 200) {
                    const file = fs.createWriteStream(rawPath);
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                } else {
                    reject(new Error(`Failed to download ${cardId}`));
                }
            }).on('error', reject);
        });

        // Process image
        await processCardImage(rawPath, processedPath, cardId);
        console.log(`Processed ${cardId}`);
    }
}

// Run the script
downloadAndProcessImages().catch(console.error); 