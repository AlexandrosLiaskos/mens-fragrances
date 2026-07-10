import type { FragranceInput } from "@/lib/schema";

/* Facts cross-checked across Fragrantica snippets (page is Cloudflare-walled),
 * FragIndex, Wikiparfum, creedboutique.com and Wikipedia. Perfumer credit is
 * split across sources (the Creeds vs IFF's Hérault); the working perfumer is
 * listed. Imagery: Creed Boutique packshot cut to transparency; scenes are
 * Pexels stock (night crags / summit above the clouds). */
const aventus: FragranceInput = {
  slug: "aventus",
  title: "Aventus",
  brand: "Creed",
  releaseYear: 2010,
  origin: "France",
  gender: "Masculine",
  tier: "Luxury",

  family: "Chypre",
  subFamily: "Chypre Fruity",
  notes: {
    top: ["Pineapple", "Bergamot", "Black Currant", "Apple"],
    heart: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
    base: ["Musk", "Oakmoss", "Ambergris", "Vanilla"],
  },
  accords: [
    { name: "fruity", intensity: 100 },
    { name: "woody", intensity: 72 },
    { name: "musky", intensity: 62 },
    { name: "fresh", intensity: 58 },
    { name: "smoky", intensity: 52 },
  ],
  signatureNotes: ["Pineapple", "Birch"],

  perfumers: ["Jean-Christophe Hérault", "Olivier Creed"],
  stats: { longevity: "Long lasting", sillage: "Moderate to strong" },

  seasons: ["Spring", "Summer", "Fall"],
  occasions: ["Daily", "Office", "NightOut", "Date", "Special"],

  variants: [{ concentration: "EDP", sizes: [{ ml: 100 }], isDefault: true }],

  epigraph: "Fortune favours the bold.",
  descriptor: "Chypre Fruity · Eau de Parfum",
  film: {
    chapterOne: "The Emperor",
    darkLine: "Smoke on the ridge, night in the valley.",
    lightLine: "Above the clouds, everything is already conquered.",
  },

  images: [
    { src: "/fragrances/aventus/item.png", role: "item", fit: "contain", ar: 0.570,
      alt: "The Aventus flacon in clear glass squared at the shoulders, crowned in faceted black, the etched ebony band carrying a small silver plaque where the emperor rides his rearing horse" },
    { src: "/fragrances/aventus/dark.jpg", role: "lifestyle", ar: 1.5,
      alt: "Black crags at nightfall in blue-grey gloom, ribbons of cloud smoking off the ridgeline like birch fires burning somewhere far below",
      posDesktop: "50% 40%" },
    { src: "/fragrances/aventus/daylight.jpg", role: "daylight", ar: 1.5,
      alt: "A dark summit breaking through a brilliant sea of cloud under hard blue morning light — the world's ceiling turned to floor" },

    /* chapter IV — Creed's own key art and the "Leave Your Mark" campaign */
    { src: "/fragrances/aventus/campaign-1.jpg", role: "editorial", ar: 2.083,
      caption: "Key visual",
      alt: "The Aventus flacon on a pedestal of raw black stone, shafts of pale light raking through the darkness behind it" },
    { src: "/fragrances/aventus/campaign-2.jpg", role: "editorial", ar: 2.153,
      caption: "The 2026 campaign",
      alt: "A dark horse in profile, mane plaited into knots, the Aventus bottle suspended from its bridle of black leather and braided gold" },
    { src: "/fragrances/aventus/campaign-3.jpg", role: "editorial", ar: 1.0,
      caption: "Leave Your Mark",
      alt: "The Aventus bottle lies at rest beside the impression it has left in a bed of pale stone dust — object and imprint" },
    { src: "/fragrances/aventus/campaign-4.jpg", role: "editorial", ar: 1.0,
      caption: "The mark in stone",
      alt: "No bottle at all — only its absence pressed into powdered stone like a fossil: the Creed script, the horseman seal, the word Aventus in bas-relief" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#3F8F6E",
    accentGlow: "rgba(63, 143, 110, 0.30)",
    accentBright: "#5FAE8B",
    accentDeep: "#27614A",
    metal: "silver",
  },
};

export default aventus;
