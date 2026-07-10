/* Normalise a chapter scene image: cap width, strip metadata, re-encode.
 *   node scripts/prep-wide.mjs <in> <out.jpg> [--max 2400] [--q 80]
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args;
if (!input || !output) {
  console.error("usage: node scripts/prep-wide.mjs <in> <out.jpg> [--max N] [--q N]");
  process.exit(1);
}
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const MAX_W = opt("max", 2400);
const Q = opt("q", 80);

const img = sharp(input).rotate().resize({ width: MAX_W, withoutEnlargement: true });
await img.jpeg({ quality: Q, mozjpeg: true }).toFile(output);
const meta = await sharp(output).metadata();
console.log(`ok ${output} ${meta.width}x${meta.height} (ar ${(meta.width / meta.height).toFixed(3)})`);
