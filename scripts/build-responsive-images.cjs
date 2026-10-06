// Delivery derivatives only: resize/compress, never upscale or alter photo content.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
async function build() {
  const manifest = {};
  const output = path.join(root, 'public/media/responsive');
  await fs.mkdir(output, { recursive: true });
  for (const folder of ['enhanced', 'profile', 'company']) {
    for (const file of (await fs.readdir(path.join(root, 'public/media', folder))).sort()) {
      if (!/\.(webp|jpe?g|png)$/i.test(file) || (folder === 'enhanced' && !file.endsWith('.webp'))) continue;
      const input = path.join(root, 'public/media', folder, file);
      const metadata = await sharp(input).metadata();
      const widths = [...new Set([320, 480, 768, 1024, 1536, Math.min(metadata.width, 1920)].filter(width => width <= metadata.width))].sort((a, b) => a - b);
      const variants = [];
      for (const width of widths) {
        const name = `${folder}-${path.parse(file).name}-${width}.webp`;
        const result = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path.join(output, name));
        variants.push({ width: result.width, src: '/media/responsive/' + name, bytes: result.size });
      }
      manifest[`/media/${folder}/${file}`] = { width: metadata.width, height: metadata.height, variants };
    }
  }
  await fs.writeFile(path.join(root, 'content/responsive-images.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Generated responsive derivatives for ${Object.keys(manifest).length} assets.`);
}
build().catch(error => { console.error(error); process.exitCode = 1; });
