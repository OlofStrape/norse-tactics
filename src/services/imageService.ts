import { Card } from '../types/game';

interface ImageCache {
    [key: string]: string;
}

export class ImageService {
    private static instance: ImageService;
    private imageCache: ImageCache = {};
    private loadingPromises: Map<string, Promise<string>> = new Map();

    private constructor() {}

    public static getInstance(): ImageService {
        if (!ImageService.instance) {
            ImageService.instance = new ImageService();
        }
        return ImageService.instance;
    }

    public async getCardImage(card: Card): Promise<string> {
        if (this.imageCache[card.id]) {
            return this.imageCache[card.id];
        }

        // Check if we're already loading this image
        let loadingPromise = this.loadingPromises.get(card.id);
        if (loadingPromise) {
            return loadingPromise;
        }

        // Start loading the image
        loadingPromise = this.loadAndProcessImage(card);
        this.loadingPromises.set(card.id, loadingPromise);

        try {
            const processedImage = await loadingPromise;
            this.imageCache[card.id] = processedImage;
            this.loadingPromises.delete(card.id);
            return processedImage;
        } catch (error) {
            this.loadingPromises.delete(card.id);
            console.error(`Failed to load image for card ${card.id}:`, error);
            return this.getFallbackImage(card);
        }
    }

    private async loadAndProcessImage(card: Card): Promise<string> {
        try {
            const response = await fetch(card.image);
            const blob = await response.blob();
            return await this.processImage(blob, card);
        } catch (error) {
            throw new Error(`Failed to load image for card ${card.id}: ${error}`);
        }
    }

    private async processImage(blob: Blob, card: Card): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Set canvas dimensions
                canvas.width = 400;
                canvas.height = 600;

                // Draw background
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(0, 0, 400, 600);

                // Calculate scaling to fit the image while maintaining aspect ratio
                const scale = Math.min(380 / img.width, 400 / img.height);
                const width = img.width * scale;
                const height = img.height * scale;
                const x = (400 - width) / 2;
                const y = (400 - height) / 2;

                // Draw the image
                ctx.drawImage(img, x, y, width, height);

                // Add card stats
                this.drawCardStats(ctx, card);

                // Add card name
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 24px Norse, Arial';
                ctx.textAlign = 'center';
                ctx.fillText(card.name, 200, 550);

                // Add rarity indicator
                this.drawRarityIndicator(ctx, card.rarity);

                // Add element indicator
                if (card.element !== 'none') {
                    this.drawElementIndicator(ctx, card.element);
                }

                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };

            img.onerror = () => {
                reject(new Error(`Failed to load image for card ${card.id}`));
            };

            img.src = URL.createObjectURL(blob);
        });
    }

    private drawCardStats(ctx: CanvasRenderingContext2D, card: Card): void {
        // Draw stat circles
        const statPositions = [
            { x: 200, y: 30, value: card.top },    // Top
            { x: 370, y: 200, value: card.right },  // Right
            { x: 200, y: 370, value: card.bottom }, // Bottom
            { x: 30, y: 200, value: card.left }     // Left
        ];

        statPositions.forEach(({ x, y, value }) => {
            // Draw circle background
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fill();

            // Draw stat value
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value.toString(), x, y);
        });
    }

    private drawRarityIndicator(ctx: CanvasRenderingContext2D, rarity: Card['rarity']): void {
        const colors = {
            common: '#8e8e8e',
            rare: '#4a90e2',
            epic: '#9b51e0',
            legendary: '#f2c94c'
        };

        ctx.fillStyle = colors[rarity];
        ctx.beginPath();
        ctx.arc(370, 30, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    private drawElementIndicator(ctx: CanvasRenderingContext2D, element: Card['element']): void {
        const colors = {
            fire: '#eb5757',
            ice: '#56ccf2',
            lightning: '#f2c94c'
        };

        const symbols = {
            fire: '🔥',
            ice: '❄',
            lightning: '⚡'
        };

        ctx.fillStyle = colors[element];
        ctx.beginPath();
        ctx.arc(30, 30, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbols[element], 30, 30);
    }

    private getFallbackImage(card: Card): string {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }

        canvas.width = 400;
        canvas.height = 600;

        // Draw background
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, 400, 600);

        // Draw card name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Norse, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(card.name, 200, 300);

        // Draw stats
        this.drawCardStats(ctx, card);

        return canvas.toDataURL('image/jpeg', 0.9);
    }
} 