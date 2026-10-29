/**
 * Helper to process the cropped image using Canvas API.
 * Returns a base64 string of the cropped and resized image.
 */
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number, y: number, width: number, height: number },
    outputWidth = 400,
    outputHeight = 400
): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    // Return as base64 with moderate compression (quality 0.8)
    return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * Compresses an image file (e.g. from file input) client-side before sending.
 * Scales down dimensions if larger than maxWidth/maxHeight and outputs JPEG data URL.
 */
export async function compressImageFile(
    file: File,
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82
): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target?.result as string;
            if (!raw) {
                resolve('');
                return;
            }
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(raw);
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => resolve(raw);
            img.src = raw;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });
}
