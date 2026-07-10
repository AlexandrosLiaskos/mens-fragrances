/* Definition + brilliance pass for a cut-out bottle PNG destined for a
 * near-black page: two-scale unsharp (fine detail + local-contrast clarity),
 * a gentle contrast S, and a small saturation/highlight lift.
 *
 *   node scripts/enhance-item.mjs <in.png> <out.png> [--fine 1.1] [--clarity 0.55] [--sat 1.08] [--bright 1.03]
 *
 * The RGB is premultiplied over black before sharpening so the (invisible)
 * white remnants outside the alpha edge cannot ring back in as a halo; the
 * original alpha channel is carried over untouched.
 */
import sharp from "sharp";

const args = process.argv.slice(2);
const [input, output] = args;
if (!input || !output) {
  console.error("usage: node scripts/enhance-item.mjs <in.png> <out.png> [--fine N] [--clarity N] [--sat N] [--bright N]");
  process.exit(1);
}
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const FINE = opt("fine", 1.1);      // fine-detail unsharp strength (sigma 1)
const CLARITY = opt("clarity", 0.55); // local-contrast strength (sigma 4)
const SAT = opt("sat", 1.08);
const BRIGHT = opt("bright", 1.03);

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const n = W * H;

/* premultiply over black + split alpha */
const rgb = Buffer.alloc(n * 3);
const alpha = Buffer.alloc(n);
for (let p = 0; p < n; p++) {
  const a = data[p * 4 + 3];
  alpha[p] = a;
  rgb[p * 3] = (data[p * 4] * a) / 255;
  rgb[p * 3 + 1] = (data[p * 4 + 1] * a) / 255;
  rgb[p * 3 + 2] = (data[p * 4 + 2] * a) / 255;
}

const enhanced = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
  /* gentle S: steepen midtones, crush the toe a touch (brilliance on black) */
  .linear(1.07, -8)
  /* clarity: wide-radius unsharp lifts the facets and embossing */
  .sharpen({ sigma: 4, m1: CLARITY, m2: CLARITY })
  /* definition: fine-radius unsharp for edges, engraving, type */
  .sharpen({ sigma: 1, m1: FINE, m2: Math.min(FINE * 1.4, 2) })
  .modulate({ brightness: BRIGHT, saturation: SAT })
  .raw()
  .toBuffer();

/* recombine with the untouched alpha */
const out = Buffer.alloc(n * 4);
for (let p = 0; p < n; p++) {
  out[p * 4] = enhanced[p * 3];
  out[p * 4 + 1] = enhanced[p * 3 + 1];
  out[p * 4 + 2] = enhanced[p * 3 + 2];
  out[p * 4 + 3] = alpha[p];
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(output);
console.log(`ok ${output} ${W}x${H} (fine ${FINE}, clarity ${CLARITY}, sat ${SAT}, bright ${BRIGHT})`);
