// Render a code-designed sharing card using the existing company photograph.
// No external requests or modifications to the source photograph.
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');
const React = require('react');
const { ImageResponse } = require('next/og');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const photo = await sharp(path.join(root, 'public/media/company/suction-deck-v2.webp'))
    .resize({ width: 840 }).jpeg({ quality: 94 }).toBuffer();
  const h = React.createElement;
  const card = h('div', {
    style: { display: 'flex', width: '100%', height: '100%', background: '#10233b', color: '#f4f1ea' },
  },
  // The enhanced source is 4:3: 840 × 630 shows it edge-to-edge, uncropped.
  h('img', { src: `data:image/jpeg;base64,${photo.toString('base64')}`, width: 840, height: 630,
    style: { objectFit: 'contain', width: 840, height: 630, flexShrink: 0 } }),
  h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 360, height: 630, padding: '54px 32px', borderLeft: '6px solid #cdbb9d' } },
    h('div', { style: { display: 'flex', flexDirection: 'column', fontSize: 38, fontWeight: 700, letterSpacing: 1, lineHeight: 1.2 } },
      h('span', null, 'RUACH'), h('span', null, 'DREDGING'), h('span', null, 'NIG LTD')),
    h('div', { style: { display: 'flex', flexDirection: 'column', fontSize: 26, lineHeight: 1.5 } },
      h('span', null, 'Dredging'), h('span', null, 'Sand Supply'), h('span', null, 'Land Reclamation')),
    h('div', { style: { display: 'flex', flexDirection: 'column', fontSize: 23, color: '#cdbb9d', lineHeight: 1.4 } },
      h('span', null, 'NIGERIA,'), h('span', null, 'WEST AFRICA'))));
  const response = new ImageResponse(card, { width: 1200, height: 630 });
  const jpg = await sharp(Buffer.from(await response.arrayBuffer()))
    .jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  const destination = path.join(root, 'public/media/social/ruach-dredging-preview-v2.jpg');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, jpg);
  console.log(`Sharing card exported: ${jpg.length} bytes, 1200 × 630 JPEG`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
