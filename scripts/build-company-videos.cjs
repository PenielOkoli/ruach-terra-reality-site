// Conservative video cleanup; never upscale or synthesize frames/equipment. Originals stay external.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const source = process.argv[2];
const ffmpeg = process.argv[3];
if (!source || !ffmpeg) throw new Error('Usage: node scripts/build-company-videos.cjs SOURCE_DIRECTORY FFMPEG_PATH');
const output = path.resolve('public/media/company/videos');
fs.mkdirSync(output, { recursive: true });
const clips = [
  { file: 'WhatsApp Video 2026-10-05 at 9.37.49 AM.mp4', name: 'slurry-discharge', start: 8, seconds: 18, filter: 'scale=540:960:flags=lanczos' },
  { file: 'WhatsApp Video 2026-10-05 at 9.51.49 AM.mp4', name: 'suction-hose-handling', start: 3, seconds: 14, filter: 'scale=352:640:flags=lanczos' },
];
for (const clip of clips) {
  const target = path.join(output, `${clip.name}-v1.mp4`);
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(clip.start), '-i', path.join(source, clip.file), '-t', String(clip.seconds), '-an', '-map_metadata', '-1', '-vf', `${clip.filter},setsar=1,hqdn3d=1:1:2:2,eq=contrast=1.025:brightness=0.012:saturation=1.015,unsharp=3:3:0.25:3:3:0`, '-r', '25', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', target], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  console.log(`${clip.name}: ${clip.seconds}s, ${fs.statSync(target).size} bytes`);
}
