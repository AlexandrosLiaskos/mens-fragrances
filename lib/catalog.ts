import "server-only";
import { getFragrances } from "./content";
import type { Fragrance } from "./schema";

/** deploy sub-path ("" locally, "/mens-fragrances" on GitHub Pages) */
const BASE_PATH = process.env.PAGES_BASE_PATH ?? "";
/** Prefix a public/ asset with the deploy basePath. next/image does NOT do this
 *  for string srcs, so on a sub-path host the raw "/fragrances/…" would 404. */
export const asset = (src: string) => (src.startsWith("/") ? `${BASE_PATH}${src}` : src);

export const CONCENTRATION_LABEL: Record<string, string> = {
  EDP: "Eau de Parfum",
  EDT: "Eau de Toilette",
  EDC: "Eau de Cologne",
  Parfum: "Parfum",
  Extrait: "Extrait de Parfum",
  Elixir: "Elixir",
  Oil: "Perfume Oil",
  Cologne: "Cologne",
};

/** relative price bands, cheapest → dearest; the $-count is the array index + 1 */
export const PRICE_TIERS = ["Budget", "Mid", "Premium", "Luxury"] as const;
export const TIER_LABEL: Record<string, string> = {
  Budget: "Budget",
  Mid: "Mid-range",
  Premium: "Premium",
  Luxury: "Luxury",
};
/** "$", "$$", … from the tier's position in PRICE_TIERS */
export const tierSymbol = (tier: string) => {
  const i = PRICE_TIERS.indexOf(tier as (typeof PRICE_TIERS)[number]);
  return "$".repeat(i < 0 ? 1 : i + 1);
};
/** 0-based rank for ordering ($ = 0 … $$$$ = 3); -1 if unknown */
export const tierRank = (tier: string) =>
  PRICE_TIERS.indexOf(tier as (typeof PRICE_TIERS)[number]);

/** "NightOut" -> "Night Out" */
export const humanize = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1 $2");

type Variant = Fragrance["variants"][number];
type Size = Variant["sizes"][number];
type Img = Fragrance["images"][number];

/** Image cascade for a SKU: size override -> concentration override -> fragrance default. */
export function resolveImage(
  f: Fragrance,
  v: Variant,
  s: Size,
  role: string
): Img | undefined {
  return (
    s.images?.find((i) => i.role === role) ??
    v.images?.find((i) => i.role === role) ??
    f.images.find((i) => i.role === role)
  );
}

/** The default (variant, size) for a fragrance page: first marked isDefault, else the first. */
export function defaultSku(f: Fragrance): { variant: Variant; size: Size } {
  const variant = f.variants.find((v) => v.isDefault) ?? f.variants[0];
  const size = variant.sizes.find((s) => s.isDefault) ?? variant.sizes[0];
  return { variant, size };
}

export type Sku = {
  id: string;
  fragranceSlug: string;
  title: string;
  brand: string;
  year: number;
  subFamily: string;
  concentration: string; // display label
  ml: number;
  tier: string; // controlled value, e.g. "Budget"
  tierLabel: string; // human label, e.g. "Mid-range"
  tierSymbol: string; // "$" … "$$$$"
  tierRank: number; // 0-based position, for ordering the filter
  notes: string[];
  seasons: string[];
  occasions: string[];
  image: { src: string; alt: string };
  href: string;
};

/** Flatten the Fragrance -> Concentration -> Volume tree into one item per SKU. */
export function getSkus(): Sku[] {
  const out: Sku[] = [];
  for (const f of getFragrances()) {
    const notes = [...f.notes.top, ...f.notes.heart, ...f.notes.base];
    const occasions = f.occasions.map(humanize);
    const subFamily = (f.subFamily ?? f.family).replace("/", " / ");
    for (const v of f.variants) {
      for (const s of v.sizes) {
        const item = resolveImage(f, v, s, "item") ?? f.images[0];
        out.push({
          id: `${f.slug}--${v.concentration}--${s.ml}`,
          fragranceSlug: f.slug,
          title: f.title,
          brand: f.brand,
          year: f.releaseYear,
          subFamily,
          concentration: CONCENTRATION_LABEL[v.concentration] ?? v.concentration,
          ml: s.ml,
          tier: f.tier,
          tierLabel: TIER_LABEL[f.tier] ?? f.tier,
          tierSymbol: tierSymbol(f.tier),
          tierRank: tierRank(f.tier),
          notes,
          seasons: f.seasons,
          occasions,
          image: { src: asset(item.src), alt: item.alt },
          href: `/${f.slug}`,
        });
      }
    }
  }
  return out;
}
