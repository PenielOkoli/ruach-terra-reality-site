import { pageMetadata } from '@/lib/metadata';
import { ProjectExplorer } from '@/components/project-explorer';
import { PageHero } from '@/components/page-hero';
import { SitePhoto } from '@/components/site-photo';
import { publicProjects as projects } from '@/content/project-evidence';
import { ProjectCaseFacts } from '@/components/project-case-facts';
import { projectPhotos } from '@/content/photography';

const featured = projects.filter((project) => project.title in projectPhotos).map((project) => ({
  ...project,
  photo: projectPhotos[project.title as keyof typeof projectPhotos],
}));

export default function Projects() { return <><PageHero eyebrow="Projects" title="Project records from Lagos sites." copy="A selection of reclamation, material supply, survey and marine support work undertaken by Ruach Dredging." />
  <section className="section section-white"><div className="container"><p className="section-label">Project index</p><h2 className="section-title">Work by location, scope and scale.</h2><div className="mt-10"><ProjectExplorer projects={projects} /></div></div></section>
  <section className="section section-paper"><div className="container"><p className="section-label">Selected case notes</p><h2 className="section-title">Three projects in more detail.</h2><p className="mt-5 max-w-[60ch] text-sm leading-6 text-clay">Facts and photo associations follow the supplied profile. Enhanced photos are not original camera files; current status and handover evidence await confirmation.</p><div className="mt-12 grid gap-14">{featured.map((project, index) => <article key={project.title} className="grid gap-8 border-t-2 border-ink pt-6 lg:grid-cols-[1fr_.9fr] lg:gap-14"><SitePhoto src={project.photo.src} alt={project.photo.alt} fit="contain" className={`${index % 2 ? 'lg:order-2' : ''} [&_.photo-frame]:h-[300px] lg:[&_.photo-frame]:h-[520px]`} /><div className="lg:self-center"><p className="section-label">{project.location}</p><h3 className="mt-3 font-display text-4xl leading-[1.02] tracking-tight">{project.title}</h3><ProjectCaseFacts project={project} /></div></article>)}</div></div></section></>; }
export const metadata = pageMetadata("Lagos Dredging Projects", "Browse reclamation, sand supply and marine project records with profile-based case studies.", '/projects');
