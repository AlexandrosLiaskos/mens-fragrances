import type { FragranceInput } from "@/lib/schema";

/* Facts verified against Fragrantica (perfume #25967, raw page source) and
 * cross-checked with FragIndex / Wikipedia / chanel.com. Accord intensities
 * are Fragrantica's own bar values. Imagery: Notino packshot cut to
 * transparency; scenes are Unsplash stock (blue-hour city / morning sea). */
const bleuDeChanelEdp: FragranceInput = {
  slug: "bleu-de-chanel-edp",
  title: "Bleu de Chanel",
  brand: "Chanel",
  releaseYear: 2014,
  origin: "France",
  gender: "Masculine",
  tier: "Premium",

  family: "Woody",
  subFamily: "Woody Aromatic",
  notes: {
    top: ["Grapefruit", "Lemon", "Mint", "Bergamot", "Pink Pepper", "Aldehydes", "Coriander"],
    heart: ["Ginger", "Jasmine", "Nutmeg", "Melon"],
    base: ["Incense", "Amber", "Cedar", "Sandalwood", "Amberwood", "Patchouli", "Labdanum"],
  },
  accords: [
    { name: "citrus", intensity: 95 },
    { name: "amber", intensity: 85 },
    { name: "woody", intensity: 64 },
    { name: "fresh spicy", intensity: 58 },
    { name: "aromatic", intensity: 45 },
  ],
  signatureNotes: ["Grapefruit", "Incense"],

  perfumers: ["Jacques Polge"],
  stats: { longevity: "Long lasting", sillage: "Moderate" },

  seasons: ["Spring", "Summer", "Fall", "Winter"],
  occasions: ["Daily", "Office", "Date", "Evening", "Formal"],

  variants: [{ concentration: "EDP", sizes: [{ ml: 100 }], isDefault: true }],

  epigraph: "The blue hour, bottled.",
  descriptor: "Woody Aromatic · Eau de Parfum",
  film: {
    chapterOne: "Blue",
    darkLine: "Ten thousand lights hold the blue hour.",
    lightLine: "Morning breaks over open water.",
  },

  images: [
    { src: "/fragrances/bleu-de-chanel-edp/item.png", role: "item", fit: "contain", ar: 0.674,
      alt: "The bevelled slab of midnight-blue glass stands square to the light, its silver-stamped name floating over a depth that shades from smoke to ink, the black cap heavy as a full stop" },
    { src: "/fragrances/bleu-de-chanel-edp/dark.jpg", role: "lifestyle", ar: 1.5,
      alt: "A city at blue hour seen from above — ten thousand amber lights burning through the dusk while the sky settles into deep marine darkness",
      posDesktop: "50% 55%" },
    { src: "/fragrances/bleu-de-chanel-edp/daylight.jpg", role: "daylight", ar: 1.5,
      alt: "Morning over open water — gulls crossing a washed blue sky, the surf turning silver where the early sun touches it",
      posDesktop: "50% 40%" },

    /* chapter IV — Chanel's flacon art: the EDP as hero throughout */
    { src: "/fragrances/bleu-de-chanel-edp/campaign-5.jpg", role: "editorial", ar: 0.75,
      caption: "The flacon at dusk",
      alt: "The Eau de Parfum flacon stands alone against a slate-blue dusk, silver lettering catching the light, its reflection pooling on the dark surface below" },
    { src: "/fragrances/bleu-de-chanel-edp/campaign-1.jpg", role: "editorial", ar: 1.778,
      caption: "The 2023 key visual",
      alt: "Three midnight-blue flacons lie tilted on a slate-violet ground while Timothée Chalamet's face emerges half-lit from the same indigo darkness" },
    { src: "/fragrances/bleu-de-chanel-edp/campaign-6.jpg", role: "editorial", ar: 0.75,
      caption: "The line, monumental",
      alt: "The Bleu de Chanel line stacked like dark monoliths on a deep blue gradient, the Eau de Parfum crowning the composition in silver-white lettering" },
    { src: "/fragrances/bleu-de-chanel-edp/campaign-4.jpg", role: "editorial", ar: 0.888,
      caption: "The still life",
      alt: "The square blue flacon resting on a dark lacquered tray, a shaving of sandalwood and a sprig of cedar behind it, everything dissolving into black" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#4A7FB5",
    accentGlow: "rgba(74, 127, 181, 0.32)",
    accentBright: "#6FA0D4",
    accentDeep: "#2E5578",
    metal: "silver",
  },
};

export default bleuDeChanelEdp;
