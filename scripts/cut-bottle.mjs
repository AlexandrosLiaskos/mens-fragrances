/* Cut a studio packshot off its light background so the bottle melds into
 * the site's near-black pages.
 *
 *   node scripts/cut-bottle.mjs <in> <out.png> [--lo 40] [--hi 110] [--pad 24] [--max 1600]
 *
 * Flood-fills from the image border: every pixel whose colour sits within
 * --hi of the sampled background colour AND is reachable from the border
 * becomes transparent (fully below --lo, feathered between). Interior whites
 * (labels, highlights) survive because they are not border-connected. The
 * alpha edge is then eroded + blurred one pixel to kill the light fringe
 * that would otherwise halo on a black page, and the result is trimmed,
 * padded and capped in height.
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args;
if (!input || !output) {
  console.error("usage: node scripts/cut-bottle.mjs <in> <out.png> [--lo N] [--hi N] [--pad N] [--max N]");
  process.exit(1);
}
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const LO = opt("lo", 40);      // dist below → fully transparent
const HI = opt("hi", 110);     // dist above → opaque, flood stops
const PAD = opt("pad", 24);    // transparent margin kept around the trim
const MAX_H = opt("max", 1600);

const { data, info } = await sharp(input)
  .rotate() // respect EXIF
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 4;

/* background = average of the four 12x12 corner patches that are light */
const patch = (x0, y0) => {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y < y0 + 12; y++)
    for (let x = x0; x < x0 + 12; x++) {
      const i = px(x, y);
      r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    }
  return [r / n, g / n, b / n];
};
const corners = [patch(0, 0), patch(W - 12, 0), patch(0, H - 12), patch(W - 12, H - 12)];
const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const light = corners.filter((c) => lum(c) > 130);
if (!light.length) {
  console.error(`background looks dark (corner luminance ${corners.map((c) => lum(c).toFixed(0)).join(", ")}) — no cutout needed; use the photo as-is with fit:"cover".`);
  process.exit(2);
}
const bg = light
  .reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0])
  .map((v) => v / light.length);

const dist = (i) => {
  const dr = data[i] - bg[0], dg = data[i + 1] - bg[1], db = data[i + 2] - bg[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

/* flood fill from every border pixel */
const alpha = new Uint8Array(W * H).fill(255);
const seen = new Uint8Array(W * H);
const stack = [];
const seed = (x, y) => {
  const p = y * W + x;
  if (!seen[p] && dist(p * 4) < HI) { seen[p] = 1; stack.push(p); }
};
for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }
while (stack.length) {
  const p = stack.pop();
  const d = dist(p * 4);
  alpha[p] = d <= LO ? 0 : Math.round(255 * (d - LO) / (HI - LO));
  const x = p % W, y = (p / W) | 0;
  if (x > 0) seed(x - 1, y);
  if (x < W - 1) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y < H - 1) seed(x, y + 1);
}

/* defringe: erode alpha by 1px, then 3x3 blur, only near the cut edge */
const eroded = new Uint8Array(alpha);
for (let y = 1; y < H - 1; y++)
  for (let x = 1; x < W - 1; x++) {
    const p = y * W + x;
    let m = alpha[p];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) m = Math.min(m, alpha[p + dy * W + dx]);
    eroded[p] = m;
  }
const soft = new Uint8Array(eroded);
for (let y = 1; y < H - 1; y++)
  for (let x = 1; x < W - 1; x++) {
    const p = y * W + x;
    if (eroded[p] === 0 || eroded[p] === 255) {
      // only smooth actual edges
      let edge = false;
      for (let k = 0; k < 9 && !edge; k++)
        edge = eroded[p + ((k / 3 | 0) - 1) * W + (k % 3) - 1] !== eroded[p];
      if (!edge) continue;
    }
    let s = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) s += eroded[p + dy * W + dx];
    soft[p] = Math.round(s / 9);
  }
for (let p = 0; p < W * H; p++) data[p * 4 + 3] = soft[p];

/* trim to content + pad, cap height */
let minX = W, minY = H, maxX = -1, maxY = -1;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (soft[y * W + x] > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
if (maxX < 0) { console.error("everything became transparent — raise --hi / check the image"); process.exit(3); }
minX = Math.max(0, minX - PAD); minY = Math.max(0, minY - PAD);
maxX = Math.min(W - 1, maxX + PAD); maxY = Math.min(H - 1, maxY + PAD);
const cw = maxX - minX + 1, ch = maxY - minY + 1;

let img = sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: cw, height: ch });
if (ch > MAX_H) img = img.resize({ height: MAX_H });
await img.png({ compressionLevel: 9 }).toFile(output);
const meta = await sharp(output).metadata();
console.log(`ok ${output} ${meta.width}x${meta.height} (bg ${bg.map((v) => v.toFixed(0)).join(",")}, ar ${(meta.width / meta.height).toFixed(3)})`);
