/* Recolour the owner's signature to the site gold, preserving the ink's
 * anti-aliasing, and emit a trimmed transparent PNG.
 *   node scripts/tint-signature.mjs [in] [out] [--hex C9A24B]
 * Works whether the source has a transparent or a white background.
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const input = args[0] && !args[0].startsWith("--") ? args[0] : "public/signature.png";
const output = args[1] && !args[1].startsWith("--") ? args[1] : "public/signature-gold.png";
const hexIdx = args.indexOf("--hex");
const hex = hexIdx >= 0 ? args[hexIdx + 1] : "C9A24B";
const [R, G, B] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const n = W * H;

/* does the background carry transparency already? sample the corners */
const cornerAlpha = [0, W - 1, (H - 1) * W, H * W - 1].map((p) => data[p * 4 + 3]);
const transparentBg = Math.max(...cornerAlpha) < 32;

for (let p = 0; p < n; p++) {
  const i = p * 4;
  let a;
  if (transparentBg) {
    a = data[i + 3];
  } else {
    /* white paper -> alpha from ink darkness */
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    a = Math.round(Math.min(255, Math.max(0, (255 - lum) * 1.15)) * (data[i + 3] / 255));
  }
  data[i] = R;
  data[i + 1] = G;
  data[i + 2] = B;
  data[i + 3] = a;
}

/* trim transparent margins with a little breathing room */
let minX = W, minY = H, maxX = -1, maxY = -1;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (data[(y * W + x) * 4 + 3] > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
const PAD = 6;
minX = Math.max(0, minX - PAD); minY = Math.max(0, minY - PAD);
maxX = Math.min(W - 1, maxX + PAD); maxY = Math.min(H - 1, maxY + PAD);

await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .png({ compressionLevel: 9 })
  .toFile(output);
const meta = await sharp(output).metadata();
console.log(`ok ${output} ${meta.width}x${meta.height} (#${hex}, ${transparentBg ? "alpha-kept" : "luminance-keyed"})`);
