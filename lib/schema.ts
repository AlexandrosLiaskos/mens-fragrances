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
});

const Theme = z.object({
  accent: z.string(),
  accentGlow: z.string(),
  bg0: z.string().optional(),
  bg1: z.string().optional(),
  navy: z.string().optional(),
  metal: Metal.default("gold"),
});

const Size = z.object({
  ml: z.number().positive(),
  price: z.number().positive().optional(),
  priceRange: z.tuple([z.number(), z.number()]).optional(),
});

/** the TITLE is the entry; concentration variants live inside it */
const Variant = z.object({
  concentration: Concentration,
  sizes: z.array(Size).min(1),
  isDefault: z.boolean().default(false),
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

  seasons: z.array(Season),
  occasions: z.array(Occasion),

  variants: z.array(Variant).min(1),

  /** one short, evocative line — the minimalist stand-in for the full poem */
  epigraph: z.string().optional(),
  descriptor: z.string(),

  images: z.array(Image).min(1),

  inspiredBy: z.array(z.string()).default([]),

  theme: Theme,
});

export type FragranceInput = z.input<typeof FragranceSchema>;
export type Fragrance = z.output<typeof FragranceSchema>;
