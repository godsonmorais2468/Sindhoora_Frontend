const UNSPLASH_HOST = 'images.unsplash.com';

function isUnsplash(src: string): boolean {
  return src.includes(UNSPLASH_HOST);
}

/**
 * Returns a sized variant of an image URL.
 * Remote CDN images get width/height/quality params; local or uploaded images are returned as-is.
 */
export function sizedImage(src: string, width: number, aspectRatio?: number): string {
  if (!isUnsplash(src)) return src;
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  if (aspectRatio) url.searchParams.set('h', String(Math.round(width / aspectRatio)));
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('auto', 'format');
  url.searchParams.set('q', width > 1200 ? '70' : '75');
  return url.toString();
}

export function imageSrcSet(src: string, widths: number[], aspectRatio?: number): string | undefined {
  if (!isUnsplash(src)) return undefined;
  return widths.map((w) => `${sizedImage(src, w, aspectRatio)} ${w}w`).join(', ');
}

/**
 * Reads a local image file and downsizes it to a compact JPEG data URL.
 * Used by the admin product form so prototype uploads stay small enough for localStorage.
 */
export function compressImageFile(file: File, maxSize = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('This file is not a supported image.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Image processing is not supported in this browser.'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
