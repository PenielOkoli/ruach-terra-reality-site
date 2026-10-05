import { ResponsivePhoto } from './responsive-photo';

export function SitePhoto({ src, alt, className = '', priority = false, fit = 'cover' }: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
}) {
  return <figure className={`photo ${className}`}><div className="photo-frame"><ResponsivePhoto src={src} alt={alt} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 96px), (max-width: 1416px) 55vw, 740px" priority={priority} style={{ objectFit: fit }} /></div></figure>;
}

export function PhotoNeeded({ description, className = '' }: { description: string; className?: string }) { return <div className={`photo-needed ${className}`}>Photo needed: {description}</div>; }
