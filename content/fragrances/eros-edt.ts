import type { FragranceInput } from "@/lib/schema";

/* Facts verified on Parfumo (fetched directly) and FragIndex's word-for-word
 * mirror of the Fragrantica pyramid; Fragrantica naming preferred where they
 * differ. Imagery: Fragrantica's original press shot (fimgs.net) cut to
 * transparency; scenes are Unsplash stock (Canova's Perseus / the Aegean). */
const erosEdt: FragranceInput = {
  slug: "eros-edt",
  title: "Eros",
  brand: "Versace",
  releaseYear: 2012,
  origin: "Italy",
  gender: "Masculine",
  tier: "Mid",

  family: "Fougere",
  subFamily: "Aromatic Fougère",
  notes: {
    top: ["Mint", "Green Apple", "Lemon"],
    heart: ["Tonka Bean", "Ambroxan", "Geranium"],
    base: ["Madagascar Vanilla", "Virginian Cedar", "Atlas Cedar", "Vetiver", "Oakmoss"],
  },
  accords: [
    { name: "aromatic", intensity: 100 },
    { name: "vanilla", intensity: 87 },
    { name: "green", intensity: 72 },
    { name: "fresh", intensity: 66 },
    { name: "woody", intensity: 58 },
  ],
  signatureNotes: ["Mint", "Madagascar Vanilla"],

  perfumers: ["Aurélien Guichard"],
  stats: { longevity: "Long lasting", sillage: "Strong" },

  seasons: ["Fall", "Winter", "Spring"],
  occasions: ["NightOut", "Date", "Evening", "Leisure"],

  variants: [{ concentration: "EDT", sizes: [{ ml: 100 }], isDefault: true }],

  epigraph: "Mint, marble and myth.",
  descriptor: "Aromatic Fougère · Eau de Toilette",
  film: {
    chapterOne: "The Myth",
    darkLine: "Marble gods keep to the dark.",
    lightLine: "The Aegean at noon, glass-clear.",
  },

  images: [
    { src: "/fragrances/eros-edt/item.png", role: "item", fit: "contain", ar: 0.762,
      alt: "The turquoise flacon of Versace Eros, its glass cut with a Greek-key relief around a darkened Medusa, the gold-crowned cap catching the light" },
    { src: "/fragrances/eros-edt/dark.jpg", role: "lifestyle", ar: 1.5,
      alt: "Canova's Perseus in a moonblue vault of shadow, the head of Medusa held out at arm's length — marble gone cold turquoise in the dark",
      posDesktop: "50% 35%" },
    { src: "/fragrances/eros-edt/daylight.jpg", role: "daylight", ar: 1.777,
      alt: "Aegean shallows seen from above at noon — turquoise water the exact colour of the Eros glass, breaking white over sun-bleached rock" },

    /* chapter IV — the Mert & Marcus launch campaign with Brian Shimansky */
    { src: "/fragrances/eros-edt/campaign-1.jpg", role: "editorial", ar: 0.667,
      caption: "Key visual, 2012",
      alt: "A modern Eros in a slipping Grecian-print robe clasps a colossal Eros flacon against a field of saturated turquoise, VERSACE EROS in yellow capitals beneath" },
    { src: "/fragrances/eros-edt/campaign-2.jpg", role: "editorial", ar: 0.749,
      caption: "The chromatic campaign",
      alt: "A living statue: the model stands barefoot atop a stone plinth, lit like patinated bronze in the campaign's chromatic blue, the giant bottle tipped at its base" },
    { src: "/fragrances/eros-edt/campaign-3.jpg", role: "editorial", ar: 0.772,
      caption: "Press ad, 2013",
      alt: "Robed in red Baroque silk, the model hoists the monumental turquoise flacon overhead like an offering to the sky" },
    { src: "/fragrances/eros-edt/campaign-4.jpg", role: "editorial", ar: 0.667,
      caption: "The bottle",
      alt: "The deep sea-green flacon alone, cut with the Greca labyrinth and the Medusa in relief, standing on a molten gold ground" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#2EC4B6",
    accentGlow: "rgba(46, 196, 182, 0.30)",
    accentBright: "#56DCCE",
    accentDeep: "#1B7A72",
    metal: "gold",
  },
};

export default erosEdt;
