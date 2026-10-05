import { coreSystems } from '@/content/profile-details';

export function CoreSystemsTable() {
  return <div id="core-systems" className="scroll-mt-28">
    <p className="mb-4 text-sm text-clay sm:hidden">Scroll horizontally to see all four columns.</p>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Core systems register">
      <table className="document-table">
        <caption className="pb-4 text-left font-display text-2xl">Core systems</caption>
        <thead><tr><th scope="col">System</th><th scope="col">Discharge</th><th scope="col">Power / duty</th><th scope="col">Primary project role</th></tr></thead>
        <tbody>{coreSystems.map(({ name, discharge, power, role }) => <tr key={name}><th scope="row" className="whitespace-nowrap !border-b !border-line !text-sm !font-semibold !normal-case !tracking-normal !text-ink">{name}</th><td>{discharge}</td><td>{power}</td><td>{role}</td></tr>)}</tbody>
      </table>
    </div>
    <p className="mt-5 max-w-[60ch] text-sm leading-6 text-clay">“Medium duty” is the profile’s duty description; numeric power is not specified for those two systems.</p>
  </div>;
}
