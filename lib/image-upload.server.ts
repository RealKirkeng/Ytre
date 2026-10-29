import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Checks if a string is a base64 Data URL image. If it is,
 * decodes and saves it as a file under public/uploads/, and returns the public path.
 * Otherwise, returns the input URL unchanged.
 */
export async function processBase64Image(imageUrl: string | undefined, prefix: string = 'image'): Promise<string | undefined> {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('data:image/')) {
        const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (!match) return imageUrl;
        
        const mimeType = match[1];
        const base64Data = match[2];
        
        let extension = mimeType.split('/')[1] || 'png';
        // Clean extension (e.g. svg+xml -> svg, jpeg -> jpg)
        extension = extension.split('+')[0].split(';')[0];
        if (extension === 'jpeg') extension = 'jpg';

        const fileName = `${prefix}-${crypto.randomUUID()}-${Date.now()}.${extension}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure target directory exists
        await fs.promises.mkdir(uploadDir, { recursive: true });
        
        // Write file asynchronously
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.promises.writeFile(path.join(uploadDir, fileName), buffer);

        return `/uploads/${fileName}`;
    }
    return imageUrl;
}
