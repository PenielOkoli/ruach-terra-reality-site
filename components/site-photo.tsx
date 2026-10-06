import { ResponsivePhoto } from './responsive-photo';
import images from '@/content/responsive-images.json';
import type { CSSProperties } from 'react';

export function SitePhoto({ src, alt, className = '', priority = false, fit = 'cover', frame = 'natural', sizes = '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 96px), (max-width: 1416px) 55vw, 740px' }: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
  frame?: 'natural' | 'fixed';
  sizes?: string;
}) {
  const record = fit === 'contain' && frame === 'natural'
    ? (images as Record<string, { width: number; height: number }>)[src]
    : undefined;
  // Full-view photographs get a matching frame, not a narrow image inside a grey box.
  // Bound very tall portraits by adjusting width as well, so nothing is cropped or stretched.
  const frameStyle: CSSProperties | undefined = record ? {
    aspectRatio: `${record.width} / ${record.height}`,
    height: 'auto',
    width: '100%',
    maxWidth: record.height > record.width ? `${820 * record.width / record.height}px` : undefined,
    marginInline: 'auto',
  } : undefined;
  return <figure className={`photo ${className}`}><div className={`photo-frame${record ? ' photo-full-frame' : ''}`} style={frameStyle}><ResponsivePhoto src={src} alt={alt} sizes={sizes} priority={priority} style={{ objectFit: fit }} /></div></figure>;
}

export function PhotoNeeded({ description, className = '' }: { description: string; className?: string }) { return <div className={`photo-needed ${className}`}>Photo needed: {description}</div>; }
