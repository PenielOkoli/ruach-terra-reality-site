import Image from "next/image";
import Link from "next/link";

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p>{value}</p>
      <span>{label}</span>
    </div>
  );
}
export function Photo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={`home-photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={src.startsWith('/media/enhanced/') || src.startsWith('/media/profile/')}
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 600px"
        className="object-cover"
      />
    </div>
  );
}
export function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-link">
      {children}
      <Arrow />
    </Link>
  );
}
