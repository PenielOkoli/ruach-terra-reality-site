import { workSteps } from "@/content/home";
import { TextLink } from "./primitives";

export function ProcessSection() {
  return (
    <>
      <section className="section section-white home-process">
        <div className="container">
          <p className="section-label">04 / How we work</p>
          <div className="section-heading">
            <h2 className="section-title">From source to site.</h2>
            <TextLink href="/about#process">Our process</TextLink>
          </div>
          <ol className="process-line">
            {workSteps.map((step, index) => (
              <li key={step}>
                <span>0{index + 1}</span>
                <h3>{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
