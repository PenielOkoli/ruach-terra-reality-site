import Link from 'next/link';
import { DetailList, ProfileDetails } from '@/components/profile-details';
import {
  commercialOptions, engineNotes, executionSteps, hseDetails, industrialPumping,
  leadershipQualifications, organisation, pipelineNotes, powerUnitRecommendation,
  productionBasis, qualityDetails, reporting,
} from '@/content/profile-details';

export function FleetProfileDetails() {
  return <section className="section section-paper"><div className="container">
    <p className="section-label">Configuration notes</p><h2 className="section-title">Production and pumping limits.</h2>
    <p className="section-intro">Profile planning figures require source verification and a project-specific test run.</p>
    <div className="mt-10 border-t border-line">
      <ProfileDetails title="View production and pipeline details"><p className="max-w-[60ch]">{productionBasis.caveat}</p><DetailList items={pipelineNotes} /><p>Company profile: slides 12 and 14.</p></ProfileDetails>
      <ProfileDetails title="View recommended Hydra-Tech power-unit configuration">
        <p className="max-w-[60ch]">The profile recommends this configuration for HT006X8. It is not an installed-unit specification or independently verified OEM rating.</p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Recommended Hydra-Tech power unit"><table className="document-table"><thead><tr><th scope="col">Parameter</th><th scope="col">Profile recommendation</th></tr></thead><tbody>{powerUnitRecommendation.map(([name, value]) => <tr key={name}><td>{name}</td><td>{value}</td></tr>)}</tbody></table></div>
        <DetailList items={engineNotes} /><p className="max-w-[60ch]">{industrialPumping.restriction}</p><p>Company profile: slides 18–19.</p>
      </ProfileDetails>
    </div>
  </div></section>;
}

export function IndustrialPumpingSection() {
  return <section id="industrial-pumping" className="section section-paper scroll-mt-32"><div className="container">
    <p className="section-label">Pumping support</p><h2 className="section-title">{industrialPumping.title}</h2><p className="section-intro">{industrialPumping.copy}</p>
    <p className="mt-6 max-w-[60ch] text-sm font-semibold leading-6 text-navy">{industrialPumping.restriction}</p>
    <div className="mt-10 border-t border-line"><ProfileDetails title="View industrial applications and deployment package"><DetailList items={industrialPumping.applications} /><p className="max-w-[60ch]">{industrialPumping.package}</p><p>{industrialPumping.base}</p><Link href="/fleet#core-systems" className="font-semibold text-rust underline underline-offset-4">View the core systems</Link><p>Company profile: slides 18–21. These are service capabilities, not claims of completed refinery contracts.</p></ProfileDetails></div>
    <Link href="/contact" className="btn btn-primary mt-8">Request a quote</Link>
  </div></section>;
}

export function QualityProfileDetails() {
  return <section className="section section-white"><div className="container">
    <p className="section-label">Technical controls</p><h2 className="section-title">Testing and operating requirements.</h2><p className="section-intro">Testing follows the project specification and contractor approval process.</p>
    <div className="mt-10 border-t border-line">
      {qualityDetails.map(({ title, items }) => <ProfileDetails key={title} title={`View ${title.toLowerCase()}`}><DetailList items={items} /><p>Company profile: slide 15.</p></ProfileDetails>)}
      <ProfileDetails title="View marine and environmental safety controls"><DetailList items={hseDetails} /><p>Company profile: slides 4 and 10.</p></ProfileDetails>
      <ProfileDetails title="View industrial-pumping restrictions"><p className="max-w-[60ch]">{industrialPumping.restriction}</p><DetailList items={[engineNotes[3], 'Tank-cleaning wash-water transfer requires HSE clearance.']} /><p>Company profile: slides 18–19.</p></ProfileDetails>
    </div>
  </div></section>;
}

export function AboutProfileDetails() {
  return <section className="section section-paper"><div className="container">
    <p className="section-label">Delivery arrangements</p><h2 className="section-title">Scope, reporting and project controls.</h2><p className="section-intro">Specialist subcontracting, material-source operation or integrated dredging and fill delivery.</p>
    <div className="mt-10 border-t border-line">
      <ProfileDetails title="View execution and handover details"><ol className="max-w-[60ch] list-decimal space-y-4 pl-5">{executionSteps.map(([title, copy]) => <li key={title}><strong className="text-ink">{title}</strong><p>{copy}</p></li>)}</ol><p>Company profile: slide 16.</p></ProfileDetails>
      <ProfileDetails title="View contracting options"><DetailList items={commercialOptions} /><p>Company profile: slide 17.</p></ProfileDetails>
      <ProfileDetails title="View project reporting"><DetailList items={reporting} /><p>Company profile: slide 17.</p></ProfileDetails>
      <ProfileDetails title="View operational organisation"><DetailList items={organisation} /><p>Company profile: slide 4.</p></ProfileDetails>
      <ProfileDetails title="View leadership qualifications"><dl className="max-w-[60ch] space-y-5">{leadershipQualifications.map(([name, qualifications]) => <div key={name}><dt className="font-semibold text-ink">{name}</dt><dd>{qualifications}</dd></div>)}</dl><p>Company profile: slide 6.</p></ProfileDetails>
    </div>
  </div></section>;
}
