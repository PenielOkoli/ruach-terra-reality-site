import { ImageResponse } from 'next/og';

export const alt = 'Ruach Dredging — Dredging, Hydraulic Fill and Reclamation in Lagos, Nigeria';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: '#10233b', color: '#f4f1ea', padding: '64px 76px', borderBottom: '16px solid #a44c2a' }}>
      <div style={{ display: 'flex', color: '#cdbb9d', fontSize: 26, letterSpacing: 5 }}>RUACH DREDGING</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 1040 }}>Water Moves Possibilities.</div>
        <div style={{ fontSize: 30, color: '#cdbb9d' }}>Dredging · Hydraulic Fill · Reclamation</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
        <span>Lagos, Nigeria</span><span>www.ruachdredging.com</span>
      </div>
    </div>, size,
  );
}
