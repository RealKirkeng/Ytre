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

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });
}
