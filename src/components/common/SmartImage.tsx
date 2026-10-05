import { memo, useState, type ImgHTMLAttributes } from 'react';
import { imageSrcSet, sizedImage } from '@/utils/image';
import { cn } from '@/utils/helpers';

const DEFAULT_WIDTHS = [320, 480, 640, 800, 1080, 1440];

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'loading'> {
  src: string;
  alt: string;
  /** width / height — used to request correctly cropped CDN images. */
  aspectRatio?: number;
  /** Rendered width hint for the browser, e.g. "(min-width: 1024px) 25vw, 50vw". */
  sizes?: string;
  widths?: number[];
  /** Load eagerly with high fetch priority (hero / LCP images). */
  priority?: boolean;
  /** Fade in once decoded. */
  fade?: boolean;
}

/** Responsive, lazily-loaded image with srcset for CDN images and a gentle fade-in. */
export const SmartImage = memo(function SmartImage({
  src,
  alt,
  aspectRatio,
  sizes = '100vw',
  widths = DEFAULT_WIDTHS,
  priority,
  fade = true,
  className,
  onLoad,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const fallbackWidth = widths[Math.min(2, widths.length - 1)];

  return (
    <img
      src={sizedImage(src, fallbackWidth, aspectRatio)}
      srcSet={imageSrcSet(src, widths, aspectRatio)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      draggable={false}
      data-loaded={fade ? loaded : undefined}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn(fade && 'img-fade', className)}
      {...rest}
    />
  );
});
