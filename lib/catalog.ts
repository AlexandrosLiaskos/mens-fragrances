import "server-only";
import { getFragrances } from "./content";
import type { Fragrance } from "./schema";

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
  priceMin: number;
  priceMax: number;
  priceLabel: string;
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
        const priceMin = s.priceRange ? s.priceRange[0] : (s.price ?? 0);
        const priceMax = s.priceRange ? s.priceRange[1] : (s.price ?? 0);
        const priceLabel = s.priceRange
          ? `$${s.priceRange[0]}–${s.priceRange[1]}`
          : s.price != null
            ? `$${s.price}`
            : "—";
        out.push({
          id: `${f.slug}--${v.concentration}--${s.ml}`,
          fragranceSlug: f.slug,
          title: f.title,
          brand: f.brand,
          year: f.releaseYear,
          subFamily,
          concentration: CONCENTRATION_LABEL[v.concentration] ?? v.concentration,
          ml: s.ml,
          priceMin,
          priceMax,
          priceLabel,
          notes,
          seasons: f.seasons,
          occasions,
          image: { src: item.src, alt: item.alt },
          href: `/${f.slug}`,
        });
      }
    }
  }
  return out;
}
