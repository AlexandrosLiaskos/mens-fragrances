/* Build-time image ladder for the static export: for every image under
 * public/fragrances, emit WebP variants at the standard widths so the
 * custom next/image loader (lib/imageLoader.ts) can serve real srcsets.
 *
 *   node scripts/optimize-images.mjs        # generate missing variants
 *   node scripts/optimize-images.mjs --force
 *
 * Variants sit beside the original:  item.png -> item.w640.webp
 * Never upscales; the largest variant is the original width.
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/* keep in sync with LADDER in lib/imageLoader.ts */
const LADDER = [256, 384, 640, 828, 1080, 1350, 1600];
const QUALITY = 82;
const FORCE = process.argv.includes("--force");

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "fragrances");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const sources = walk(root).filter(
  (p) => /\.(png|jpe?g)$/i.test(p) && !/\.w\d+\.webp$/i.test(p)
);

let made = 0, kept = 0;
for (const src of sources) {
  const meta = await sharp(src).metadata();
  /* every ladder step exists for every image (capped at the source width,
     never upscaled) so the loader can never point at a missing file */
  for (const w of LADDER) {
    const out = join(
      dirname(src),
      `${basename(src, extname(src))}.w${w}.webp`
    );
    if (!FORCE && existsSync(out)) { kept++; continue; }
    await sharp(src)
      .resize({ width: Math.min(w, meta.width) })
      .webp({ quality: QUALITY })
      .toFile(out);
    made++;
  }
}
console.log(`ok: ${made} variants written, ${kept} already current, ${sources.length} source images`);
