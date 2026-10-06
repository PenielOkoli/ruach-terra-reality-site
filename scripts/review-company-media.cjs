// Read originals without modifying them; decoded review frames are ignored artifacts.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const sharp = require('sharp');
const source = process.argv[2];
const ffmpeg = process.argv[3];
if (!source || !ffmpeg) throw new Error('Usage: node scripts/review-company-media.cjs SOURCE_DIRECTORY FFMPEG_PATH');
const output = path.resolve('artifacts/company-media-review');
fs.mkdirSync(output, { recursive: true });
async function main() {
  const seen = new Map();
  const inventory = [];
  for (const file of fs.readdirSync(source).sort()) {
    if (!/\.(jpe?g|mp4)$/i.test(file)) continue;
    const input = path.join(source, file);
    const sha256 = crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex');
    const entry = { file, sha256, bytes: fs.statSync(input).size };
    if (seen.has(sha256)) entry.duplicateOf = seen.get(sha256);
    else seen.set(sha256, file);
    if (/\.mp4$/i.test(file) && !entry.duplicateOf) {
      const probe = spawnSync(ffmpeg, ['-hide_banner', '-i', input], { encoding: 'utf8' }).stderr;
      entry.probe = probe;
      const match = probe.match(/Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/);
      const duration = match ? +match[1] * 3600 + +match[2] * 60 + +match[3] : 0;
      entry.duration = duration;
      const stem = path.parse(file).name;
      entry.frames = [];
      for (const [index, fraction] of [0.15, 0.45, 0.75].entries()) {
        const frame = path.join(output, `${stem}-${index + 1}.jpg`);
        const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(duration * fraction), '-i', input, '-frames:v', '1', '-q:v', '2', frame], { encoding: 'utf8' });
        if (result.status !== 0) throw new Error(result.stderr);
        entry.frames.push(frame);
      }
    } else if (/\.jpe?g$/i.test(file)) {
      const { width, height } = await sharp(input).metadata();
      Object.assign(entry, { width, height });
    }
    inventory.push(entry);
  }
  fs.writeFileSync(path.join(output, 'inventory.json'), JSON.stringify(inventory, null, 2));
  // Generated audit data is checked in without absolute private source paths.
  fs.writeFileSync(path.resolve('docs/company-media-inventory.json'), JSON.stringify(inventory.map(({ probe, frames, ...entry }) => entry), null, 2) + '\n');
  console.log(JSON.stringify(inventory.map(({ probe, frames, ...entry }) => ({ ...entry, ...(probe ? { video: probe.split('\n').filter(line => /Stream.*Video|displaymatrix/.test(line)).join(' ') } : {}) })), null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
