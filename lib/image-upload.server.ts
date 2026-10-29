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

        try {
            const fileName = `${prefix}-${crypto.randomUUID()}-${Date.now()}.${extension}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            // Ensure target directory exists
            await fs.promises.mkdir(uploadDir, { recursive: true });
            
            // Write file asynchronously
            const buffer = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(path.join(uploadDir, fileName), buffer);

            return `/uploads/${fileName}`;
        } catch (err) {
            // In serverless / read-only filesystem (like Vercel), save the compressed data URL directly
            console.warn('[processBase64Image] Could not write image file to disk, using data URL fallback:', err);
            return imageUrl;
        }
    }
    return imageUrl;
}

/**
 * Finds all inline :::image:{"src":"data:image/...",...}::: in content,
 * writes base64 data to disk, and replaces src with /uploads/fileName.
 */
export async function processContentImages(content: string): Promise<string> {
    if (!content || !content.includes(':::image:')) return content;
    
    const regex = /:::image:(\{[\s\S]*?\}):::/g;
    let match: RegExpExecArray | null;
    let result = content;
    const matches: string[] = [];
    
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[1]);
    }
    
    for (const jsonStr of matches) {
        try {
            const data = JSON.parse(jsonStr);
            if (data.src && data.src.startsWith('data:image/')) {
                const savedPath = await processBase64Image(data.src, 'inline');
                if (savedPath) {
                    data.src = savedPath;
                    const oldShortcode = `:::image:${jsonStr}:::`;
                    const newShortcode = `:::image:${JSON.stringify(data)}:::`;
                    result = result.replace(oldShortcode, newShortcode);
                }
            }
        } catch {
            // ignore parse errors
        }
    }
    
    return result;
}
