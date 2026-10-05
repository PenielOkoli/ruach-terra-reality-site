import { ProjectExplorer } from '@/components/project-explorer';
import { PageHero } from '@/components/page-hero';
import { SitePhoto } from '@/components/site-photo';
import { projects } from '@/content/site';
import { projectPhotos } from '@/content/photography';

const featured = projects.filter((project) => project.title in projectPhotos).map((project) => ({
  ...project,
  photo: projectPhotos[project.title as keyof typeof projectPhotos],
}));

export default function Projects() { return <><PageHero eyebrow="Projects" title="Project records from Lagos sites." copy="A selection of reclamation, material supply, survey and marine support work undertaken by Ruach Dredging." />
  <section className="section section-white"><div className="container"><p className="section-label">Project index</p><h2 className="section-title">Work by location, scope and scale.</h2><div className="mt-10"><ProjectExplorer projects={projects} /></div></div></section>
  <section className="section section-paper"><div className="container"><p className="section-label">Selected case notes</p><h2 className="section-title">Three projects in more detail.</h2><div className="mt-12 grid gap-14">{featured.map((project, index) => <article key={project.title} className="grid gap-8 border-t-2 border-ink pt-6 lg:grid-cols-[1fr_.9fr] lg:gap-14"><SitePhoto src={project.photo.src} alt={project.photo.alt} className={`${index % 2 ? 'lg:order-2' : ''} [&_.photo-frame]:h-[350px] lg:[&_.photo-frame]:h-[430px]`} /><div className="lg:self-center"><p className="section-label">{project.location}</p><h3 className="mt-3 font-display text-4xl leading-[1.02] tracking-tight">{project.title}</h3><p className="mt-5 text-base leading-7 text-clay">{project.detail}</p><dl className="mt-8 border-y border-line py-4"><div className="flex flex-col gap-1 sm:flex-row sm:justify-between"><dt className="text-xs font-bold uppercase tracking-[.1em] text-clay">Recorded scale</dt><dd className="font-semibold">{project.scale}</dd></div></dl></div></article>)}</div></div></section></>; }
