// User-supplied manufacturer imagery, not proof of Ruach ownership or an exact model match.
const referencePhoto = (key: string, sourceFile: string, subject: string) => ({
  src: `/media/company/${key}-v2.webp`,
  sourceFile,
  alt: `AI-enhanced manufacturer reference: ${subject}`,
});

export const manufacturerEquipment = [
  {
    id: 'submersible-assemblies',
    title: 'Submersible pump assemblies',
    description: 'Perforated intakes and surrounding agitators.',
    photos: [
      referencePhoto('manufacturer-submersible-front', 'WhatsApp Image 2026-10-05 at 10.00.30 AM.jpeg', 'Front view of a grey submersible pump assembly with a screened intake, agitator heads and transport frame'),
      referencePhoto('manufacturer-submersible-angle', 'WhatsApp Image 2026-10-05 at 10.00.31 AM (1).jpeg', 'Angled view of the grey submersible pump assembly, intake screen, surrounding agitators and lifting cables'),
    ],
  },
  {
    id: 'diesel-pump-packages',
    title: 'Diesel-driven dredge pump packages',
    description: 'Engine, coupling and centrifugal pump on a skid.',
    photos: [
      referencePhoto('manufacturer-centrifugal-front', 'WhatsApp Image 2026-10-05 at 10.00.31 AM (2).jpeg', 'Front view of two blue centrifugal dredge pumps and their inlet flanges, with engines behind'),
      referencePhoto('manufacturer-diesel-side', 'WhatsApp Image 2026-10-05 at 10.00.31 AM (3).jpeg', 'Side view of blue diesel engines coupled to centrifugal dredge pumps on steel skids'),
    ],
  },
] as const;
