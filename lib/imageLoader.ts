"use client";

/* Custom next/image loader for the static export: maps any requested width
 * onto the pre-generated WebP ladder (scripts/optimize-images.mjs), so
 * <Image> emits a real srcset while GitHub Pages stays a dumb file host.
 * Non-fragrance sources (none today) pass through untouched. */

const LADDER = [256, 384, 640, 828, 1080, 1350, 1600]; // keep in sync with the script

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!/\/fragrances\/.+\.(png|jpe?g)$/i.test(src)) return src;
  const w = LADDER.find((l) => l >= width) ?? LADDER[LADDER.length - 1];
  return src.replace(/\.(png|jpe?g)$/i, `.w${w}.webp`);
}
