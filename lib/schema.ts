import { z } from "zod";

/* controlled vocabularies (extend as the catalogue grows) */
export const Concentration = z.enum([
  "Parfum", "Extrait", "EDP", "EDT", "EDC", "Elixir", "Oil", "Cologne",
]);
export const OlfactoryFamily = z.enum([
  "Amber", "Amber/Oriental", "Woody", "Aromatic", "Fougere", "Floral",
  "Citrus", "Chypre", "Gourmand", "Leather", "Fresh", "Aquatic", "Green", "Spicy",
]);
export const Season = z.enum(["Spring", "Summer", "Fall", "Winter"]);
export const Occasion = z.enum([
  "Daily", "Office", "Evening", "NightOut", "Formal", "Leisure", "Date", "Special",
]);
export const Metal = z.enum(["gold", "silver"]);
export const Gender = z.enum(["Masculine", "Feminine", "Unisex"]);
/* relative price band, cheapest -> dearest; rendered as $ … $$$$ */
export const PriceTier = z.enum(["Budget", "Mid", "Premium", "Luxury"]);
export const ImageRole = z.enum([
  "item", "lifestyle", "hero", "bust", "unboxing", "packaging", "in-hand", "editorial", "daylight", "thumb",
]);

const Image = z.object({
  src: z.string(),
  role: ImageRole,
  alt: z.string().min(1),
  /** object-position for cover crops, per breakpoint */
  posDesktop: z.string().default("50% 50%"),
  posMobile: z.string().optional(),
  fit: z.enum(["cover", "contain"]).default("cover"),
  /** intrinsic aspect ratio (width / height) — drives the framed plate */
  ar: z.number().positive().optional(),
  /** tiny small-caps caption under a gallery plate (editorial role) */
  caption: z.string().optional(),
});

const Theme = z.object({
  /** 6-digit hex — used to derive the metal gradient, so no rgb()/names */
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accentGlow: z.string(),
  /** lighter / darker companions of the accent; default to the accent itself */
  accentBright: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentDeep: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  bg0: z.string().optional(),
  bg1: z.string().optional(),
  navy: z.string().optional(),
  metal: Metal.default("gold"),
});

/** Per-fragrance copy for the film chapters; anything omitted falls back to
 *  the shared defaults applied in app/[slug]/page.tsx. */
const FilmCopy = z.object({
  /** rail label of the opening chapter (default "Overture") */
  chapterOne: z.string().optional(),
  /** rail labels of the two photographic chapters */
  darkLabel: z.string().optional(),
  lightLabel: z.string().optional(),
  /** kicker + line over the dark full-bleed scene (kicker defaults to the family) */
  darkKicker: z.string().optional(),
  darkLine: z.string().optional(),
  /** kicker + line over the daylight full-bleed scene */
  lightKicker: z.string().optional(),
  lightLine: z.string().optional(),
  /** the campaign gallery chapter (rendered when editorial images exist) */
  galleryLabel: z.string().optional(),
  galleryKicker: z.string().optional(),
});

/* the leaf of the hierarchy: a concrete SKU = one volume of one concentration */
const Size = z.object({
  ml: z.number().positive(),
  sku: z.string().optional(),
  isDefault: z.boolean().default(false),
  /** imagery specific to THIS exact SKU; falls back to the variant, then the fragrance */
  images: z.array(Image).optional(),
});

/* the TITLE is the entry; concentration variants live inside it, volumes inside those.
   Fragrance -> Variant (concentration) -> Size (volume = SKU) */
const Variant = z.object({
  concentration: Concentration,
  sizes: z.array(Size).min(1),
  isDefault: z.boolean().default(false),
  /** imagery specific to THIS concentration (e.g. a different colourway); falls back to the fragrance */
  images: z.array(Image).optional(),
});

const Accord = z.object({
  name: z.string(),
  intensity: z.number().min(0).max(100),
});

export const FragranceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  brand: z.string(),
  releaseYear: z.number().int(),
  origin: z.string().optional(),
  gender: Gender.default("Masculine"),
  /** relative price band ($=Budget … $$$$=Luxury) — a positioning cue, not a sourced figure */
  tier: PriceTier,

  family: OlfactoryFamily,
  subFamily: z.string().optional(),
  notes: z.object({
    top: z.array(z.string()),
    heart: z.array(z.string()),
    base: z.array(z.string()),
  }),
  accords: z.array(Accord),
  /** notes to visually emphasise (e.g. the signature note) */
  signatureNotes: z.array(z.string()).default([]),

  /** the nose(s) behind the composition, when known */
  perfumers: z.array(z.string()).default([]),
  /** Fragrantica community verdicts, qualitative (e.g. "Long lasting", "Moderate") */
  stats: z
    .object({
      longevity: z.string().optional(),
      sillage: z.string().optional(),
    })
    .optional(),

  seasons: z.array(Season),
  occasions: z.array(Occasion),

  variants: z.array(Variant).min(1),

  /** one short, evocative line — the minimalist stand-in for the full poem */
  epigraph: z.string().optional(),
  descriptor: z.string(),
  /** per-fragrance chapter labels + scene copy for the film reel */
  film: FilmCopy.optional(),

  images: z.array(Image).min(1),

  inspiredBy: z.array(z.string()).default([]),
  /** free-form groupings for curated collections (e.g. "Amber Orientals", "Evening") */
  tags: z.array(z.string()).default([]),

  theme: Theme,
});

export type FragranceInput = z.input<typeof FragranceSchema>;
export type Fragrance = z.output<typeof FragranceSchema>;
