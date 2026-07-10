/* Compose an in-house bottle-hero plate from a transparent cutout:
 * themed gradient ground, soft accent glow, centered flacon, faded floor
 * reflection. For gallery slots where no official bottle art exists.
 *
 *   node scripts/plate-bottle.mjs <item.png> <out.jpg> --accent "#B3A6D9" [--w 1600] [--h 1000]
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args;
if (!input || !output) {
  console.error('usage: node scripts/plate-bottle.mjs <item.png> <out.jpg> --accent "#RRGGBB" [--w N] [--h N]');
  process.exit(1);
}
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const W = Number(opt("w", 1600));
const H = Number(opt("h", 1000));
const ACCENT = String(opt("accent", "#C9A24B"));

/* stage: near-black vertical wash + a low accent glow pool + vignette */
const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0B0D12"/>
      <stop offset="0.55" stop-color="#08090D"/>
      <stop offset="1" stop-color="#050608"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.72" r="0.62">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.26"/>
      <stop offset="0.45" stop-color="${ACCENT}" stop-opacity="0.10"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vign" cx="0.5" cy="0.46" r="0.95">
      <stop offset="0.6" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#wash)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect width="100%" height="100%" fill="url(#vign)"/>
</svg>`);

const BOTTLE_H = Math.round(H * 0.74);
const FLOOR_Y = Math.round(H * 0.88); // where glass meets its reflection

const bottle = await sharp(input).resize({ height: BOTTLE_H }).png().toBuffer();
const bMeta = await sharp(bottle).metadata();
const bx = Math.round((W - bMeta.width) / 2);
const by = FLOOR_Y - bMeta.height;

/* reflection: flipped, alpha ramped out over its top 30%, softened */
const { data: rraw, info: rinfo } = await sharp(bottle).flip().raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const RAMP = Math.round(rinfo.height * 0.3);
for (let y = 0; y < rinfo.height; y++) {
  const k = y < RAMP ? (y / RAMP) * 0.28 : 0.28;
  const fade = 1 - Math.min(1, y / (rinfo.height * 0.55));
  const a = Math.max(0, k * fade);
  for (let x = 0; x < rinfo.width; x++) {
    const i = (y * rinfo.width + x) * 4 + 3;
    rraw[i] = Math.round(rraw[i] * a);
  }
}
const reflection = await sharp(rraw, { raw: rinfo }).blur(2.2).png().toBuffer();

await sharp(bg)
  .composite([
    { input: reflection, left: bx, top: FLOOR_Y },
    { input: bottle, left: bx, top: by },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(output);
console.log(`ok ${output} ${W}x${H} (ar ${(W / H).toFixed(3)}, accent ${ACCENT})`);
