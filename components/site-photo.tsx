import Image from 'next/image';

export function SitePhoto({ src, alt, className = '', priority = false, fit = 'cover' }: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
}) {
  return <figure className={`photo ${className}`}><div className="photo-frame"><Image src={src} alt={alt} fill unoptimized={src.startsWith('/media/enhanced/') || src.startsWith('/media/profile/')} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 680px" priority={priority} style={{ objectFit: fit }} /></div></figure>;
}

export function PhotoNeeded({ description, className = '' }: { description: string; className?: string }) { return <div className={`photo-needed ${className}`}>Photo needed: {description}</div>; }
