import type { FragranceInput } from "@/lib/schema";

/* Facts verified against Fragrantica (perfume #13016, live page HTML) and
 * cross-checked with FragIndex / Silloria / Escentual. This is the 2011 EDP —
 * the composition Lattafa His Confession is widely compared against.
 * Imagery: bottle is a retailer packshot cut to transparency; scenes are
 * licensed stock (Pexels) chosen for the iris-and-lavender character. */
const diorHommeIntense: FragranceInput = {
  slug: "dior-homme-intense",
  title: "Dior Homme Intense",
  brand: "Dior",
  releaseYear: 2011,
  origin: "France",
  gender: "Masculine",
  tier: "Premium",

  family: "Woody",
  subFamily: "Woody Floral Musk",
  notes: {
    top: ["Lavender"],
    heart: ["Iris", "Ambrette (Musk Mallow)", "Pear"],
    base: ["Virginia Cedar", "Vetiver"],
  },
  accords: [
    { name: "iris", intensity: 100 },
    { name: "woody", intensity: 75 },
    { name: "powdery", intensity: 67 },
    { name: "earthy", intensity: 55 },
    { name: "aromatic", intensity: 51 },
  ],
  signatureNotes: ["Iris"],

  perfumers: ["François Demachy"],
  stats: { longevity: "Long lasting", sillage: "Moderate to strong" },

  seasons: ["Fall", "Winter"],
  occasions: ["Evening", "Date", "NightOut", "Formal"],

  variants: [{ concentration: "EDP", sizes: [{ ml: 100 }], isDefault: true }],

  epigraph: "Iris, worn like a secret.",
  descriptor: "Woody Floral Musk · Eau de Parfum",
  film: {
    chapterOne: "The Original",
    darkLine: "The iris opens where the light ends.",
    lightLine: "Lavender, first light over Provence.",
  },

  images: [
    { src: "/fragrances/dior-homme-intense/item.png", role: "item", fit: "contain", ar: 0.562,
      alt: "The Dior Homme Intense flacon — a slab of amber glass under a graphite-black shoulder, the silver DIOR HOMME serif holding the last of the light while the juice glows like late honey" },
    { src: "/fragrances/dior-homme-intense/dark.jpg", role: "lifestyle", ar: 1.5,
      alt: "A single iris unfurling out of absolute darkness, its violet falls veined in gold and white — the flower at the heart of the fragrance, met at midnight" },
    { src: "/fragrances/dior-homme-intense/daylight.jpg", role: "daylight", ar: 1.5,
      alt: "Rows of lavender running toward the Provençal hills at first light, the sky washed apricot while the field still keeps the night's violet",
      posDesktop: "50% 60%" },

    /* chapter IV — Dior's own flacon art, closed by a Lindbergh still */
    { src: "/fragrances/dior-homme-intense/campaign-5.jpg", role: "editorial", ar: 0.75,
      caption: "Amber heart, dark wood",
      alt: "The flacon reclines in a hollow of dark driftwood, its amber heart lit from within like a lantern, dew-beaded iris petals resting pale and gold at its foot" },
    { src: "/fragrances/dior-homme-intense/campaign-6.jpg", role: "editorial", ar: 2.773,
      caption: "The 2026 campaign banner",
      alt: "The Dior Homme Intense flacon stands hero-lit at right, burning amber against the smeared golden light of a darkened bar, Robert Pattinson watching from the leather shadows" },
    { src: "/fragrances/dior-homme-intense/campaign-1.jpg", role: "editorial", ar: 2.346,
      caption: "Intense City, 2016",
      alt: "Robert Pattinson in black and white, collar of a camel overcoat gripped in both fists, a theatre marquee dissolving into grain behind him" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#B3A6D9",
    accentGlow: "rgba(179, 166, 217, 0.30)",
    accentBright: "#C9BFE8",
    accentDeep: "#6F668F",
    metal: "silver",
  },
};

export default diorHommeIntense;
