import { safetyItems } from "@/content/home";
import { TextLink } from "./primitives";

export function SafetySection() {
  return (
    <>
      <section className="section home-safety">
        <div className="container engineering-grid">
          <div>
            <p className="section-label">05 / Quality & HSE</p>
            <h2 className="section-title">
              Safe work.
              <br />
              Every shift.
            </h2>
            <p className="section-intro">
              Site controls are part of the operating plan.
            </p>
            <TextLink href="/quality-hse">Quality and HSE</TextLink>
          </div>
          <ul className="safety-list">
            {safetyItems.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
