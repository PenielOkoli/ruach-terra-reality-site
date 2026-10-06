// Delivery conversion only. Enhancement is performed with the built-in image tool, not Sharp.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const args = process.argv.slice(2);
const versionFlag = args.find(arg => arg.startsWith('--version='));
const version = versionFlag ? versionFlag.slice('--version='.length) : '1';
if (!/^[1-9]\d*$/.test(version)) throw new Error('Invalid asset version');
const entries = args.filter(arg => arg !== versionFlag);
if (!entries.length || entries.length % 2) throw new Error('Pass KEY GENERATED_PNG pairs.');
const output = path.resolve('public/media/company');
fs.mkdirSync(output, { recursive: true });
(async () => {
  for (let i = 0; i < entries.length; i += 2) {
    const key = entries[i];
    if (!/^[a-z-]+$/.test(key)) throw new Error('Invalid asset key');
    const input = entries[i + 1];
    const result = await sharp(input).webp({ quality: 90, effort: 6 }).toFile(path.join(output, `${key}-v${version}.webp`));
    console.log(`${key}: ${result.width}×${result.height}, ${result.size} bytes`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
