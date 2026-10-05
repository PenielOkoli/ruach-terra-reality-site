import Image from 'next/image';
import images from '@/content/responsive-images.json';
import type { CSSProperties } from 'react';

type ImageRecord = { width: number; height: number; variants: { width: number; src: string; bytes: number }[] };
export function ResponsivePhoto({ src, alt, sizes, className, priority = false, style }: { src: string; alt: string; sizes: string; className?: string; priority?: boolean; style?: CSSProperties }) {
  const record = (images as Record<string, ImageRecord>)[src];
  if (!record) return <Image src={src} alt={alt} fill sizes={sizes} preload={priority} className={className} style={style} />;
  const fallback = record.variants.find(image => image.width >= 768) || record.variants.at(-1)!;
  // Pre-generated, width-described files avoid runtime image-optimizer stalls.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={fallback.src} srcSet={record.variants.map(image => `${image.src} ${image.width}w`).join(', ')} sizes={sizes} width={record.width} height={record.height} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />;
}
