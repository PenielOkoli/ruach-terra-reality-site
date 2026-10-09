import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services";
import { FleetSection } from "@/components/home/fleet";
import { ProjectsSection } from "@/components/home/projects";
import { IndustryBand } from "@/components/home/industry-band";
import { ProcessSection } from "@/components/home/process";
import { SafetySection } from "@/components/home/safety";
import { ContactSection } from "@/components/home/contact";
import { CareersSection } from "@/components/home/careers";

// Route composition only; copy and section presentation live outside the router.
export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <FleetSection />
      <ProjectsSection />
      <IndustryBand />
      <ProcessSection />
      <SafetySection />
      <CareersSection />
      <ContactSection />
    </>
  );
}
