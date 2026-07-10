/* Scaffold a new fragrance entry:
 *   node scripts/new-fragrance.mjs <slug>
 * Creates content/fragrances/<slug>.ts from a commented template and
 * public/fragrances/<slug>/ for its imagery, then prints the registry line.
 * Refuses to overwrite an existing entry.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("usage: node scripts/new-fragrance.mjs <kebab-case-slug>");
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "content", "fragrances", `${slug}.ts`);
if (existsSync(file)) {
  console.error(`${file} already exists — not touching it.`);
  process.exit(2);
}
const camel = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

const template = `import type { FragranceInput } from "@/lib/schema";

/* Facts (notes, accords, year, origin) verified against Fragrantica / Parfumo.
 * tier is a relative price band ($=Budget … $$$$=Luxury), not a sourced figure. */
const ${camel}: FragranceInput = {
  slug: "${slug}",
  title: "",
  brand: "",
  releaseYear: 2024,
  origin: "",
  gender: "Masculine",
  tier: "Mid",

  family: "Woody", // Amber | Amber/Oriental | Woody | Aromatic | Fougere | Floral | Citrus | Chypre | Gourmand | Leather | Fresh | Aquatic | Green | Spicy
  subFamily: "",
  notes: {
    top: [],
    heart: [],
    base: [],
  },
  accords: [
    // strongest first, intensity ≈ Fragrantica bar width
    { name: "", intensity: 90 },
  ],
  signatureNotes: [],

  perfumers: [],
  stats: { longevity: "", sillage: "" },

  seasons: [], // Spring | Summer | Fall | Winter
  occasions: [], // Daily | Office | Evening | NightOut | Formal | Leisure | Date | Special

  variants: [{ concentration: "EDP", sizes: [{ ml: 100 }], isDefault: true }],

  epigraph: "",
  descriptor: "",
  film: {
    chapterOne: "Overture", // rail label of the opening chapter
    darkLine: "",
    lightLine: "",
  },

  images: [
    // roles the reel uses: item (bottle; fit:"contain" + ar for transparent
    // cut-outs), lifestyle/unboxing/in-hand (dark scene), daylight (light scene),
    // editorial ×2-4 (the campaign gallery chapter; caption sits under the plate)
    { src: "/fragrances/${slug}/item.png", role: "item", fit: "contain", ar: 0.5, alt: "" },
    { src: "/fragrances/${slug}/dark.jpg", role: "lifestyle", ar: 1.5, alt: "" },
    { src: "/fragrances/${slug}/daylight.jpg", role: "daylight", ar: 1.5, alt: "" },
    { src: "/fragrances/${slug}/campaign-1.jpg", role: "editorial", ar: 0.75, caption: "", alt: "" },
    { src: "/fragrances/${slug}/campaign-2.jpg", role: "editorial", ar: 0.75, caption: "", alt: "" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#C9A24B",
    accentGlow: "rgba(201, 162, 75, 0.32)",
    accentBright: "#DCB65C",
    accentDeep: "#8A6D2E",
    metal: "gold",
  },
};

export default ${camel};
`;

writeFileSync(file, template);
mkdirSync(join(root, "public", "fragrances", slug), { recursive: true });
console.log(`created content/fragrances/${slug}.ts and public/fragrances/${slug}/`);
console.log(`now add to content/registry.ts:`);
console.log(`  import ${camel} from "./fragrances/${slug}";  →  registry: [..., ${camel}]`);
