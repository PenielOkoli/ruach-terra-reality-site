import type { PublicProject } from '@/content/project-evidence';

export function ProjectCaseFacts({ project }: { project: PublicProject }) {
  const rows = [['Scope', project.detail], ['Equipment', project.evidence.equipment], ['Quantity', project.evidence.quantity], ['Outcome in profile', project.evidence.outcome]];
  return <dl className="mt-6 max-w-[60ch] border-t border-line">{rows.map(([label, value]) => <div key={label} className="grid gap-2 border-b border-line py-4 sm:grid-cols-[110px_1fr]"><dt className="text-xs font-bold uppercase tracking-[.08em] text-clay">{label}</dt><dd className="text-sm leading-6 text-ink">{value}</dd></div>)}</dl>;
}
