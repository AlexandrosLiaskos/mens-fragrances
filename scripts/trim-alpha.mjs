/* Trim the transparent margins off an already-cut PNG and cap its height.
 *   node scripts/trim-alpha.mjs <in.png> <out.png> [--pad 24] [--max 1600]
 * Prints the resulting aspect ratio for the content file.
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args;
if (!input || !output) {
  console.error("usage: node scripts/trim-alpha.mjs <in.png> <out.png> [--pad N] [--max N]");
  process.exit(1);
}
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const PAD = opt("pad", 24);
const MAX_H = opt("max", 1600);

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
let minX = W, minY = H, maxX = -1, maxY = -1;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (data[(y * W + x) * 4 + 3] > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
if (maxX < 0) { console.error("image is fully transparent"); process.exit(2); }
minX = Math.max(0, minX - PAD); minY = Math.max(0, minY - PAD);
maxX = Math.min(W - 1, maxX + PAD); maxY = Math.min(H - 1, maxY + PAD);
const cw = maxX - minX + 1, ch = maxY - minY + 1;

let img = sharp(input).extract({ left: minX, top: minY, width: cw, height: ch });
if (ch > MAX_H) img = img.resize({ height: MAX_H });
await img.png({ compressionLevel: 9 }).toFile(output);
const meta = await sharp(output).metadata();
console.log(`ok ${output} ${meta.width}x${meta.height} (ar ${(meta.width / meta.height).toFixed(3)})`);
