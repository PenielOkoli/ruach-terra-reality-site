import type { ReactNode } from 'react';

export function ProfileDetails({ title, children }: { title: string; children: ReactNode }) {
  return <details className="profile-details border-b border-line py-5">
    <summary className="cursor-pointer text-base font-semibold text-navy marker:text-rust hover:text-rust">{title}</summary>
    <div className="mt-6 space-y-5 text-sm leading-6 text-clay">{children}</div>
  </details>;
}

export function DetailList({ items }: { items: readonly string[] }) {
  return <ul className="max-w-[60ch] list-disc space-y-3 pl-5">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}
