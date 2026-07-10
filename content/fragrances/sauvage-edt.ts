import type { FragranceInput } from "@/lib/schema";

/* Facts verified via Fragrantica search snippets (page is bot-walled),
 * FragIndex's mirror of the pyramid, and Parfumo fetched directly — all
 * agree on 2015 / Demachy / the note set. Accord intensities approximate
 * Fragrantica's bar order. Imagery: Escentual transparent packshot; scenes
 * are Unsplash stock (Monument Valley night / desert highway). */
const sauvageEdt: FragranceInput = {
  slug: "sauvage-edt",
  title: "Sauvage",
  brand: "Dior",
  releaseYear: 2015,
  origin: "France",
  gender: "Masculine",
  tier: "Premium",

  family: "Aromatic",
  subFamily: "Aromatic Fougère",
  notes: {
    top: ["Calabrian Bergamot", "Pepper"],
    heart: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Patchouli", "Geranium", "Elemi"],
    base: ["Ambroxan", "Cedar", "Labdanum"],
  },
  accords: [
    { name: "fresh spicy", intensity: 100 },
    { name: "amber", intensity: 82 },
    { name: "citrus", intensity: 76 },
    { name: "aromatic", intensity: 71 },
    { name: "musky", intensity: 62 },
  ],
  signatureNotes: ["Ambroxan", "Calabrian Bergamot"],

  perfumers: ["François Demachy"],
  stats: { longevity: "Long lasting", sillage: "Moderate to strong" },

  seasons: ["Spring", "Summer", "Fall"],
  occasions: ["Daily", "Office", "NightOut", "Date", "Leisure"],

  variants: [{ concentration: "EDT", sizes: [{ ml: 100 }], isDefault: true }],

  epigraph: "Wide open, even after dark.",
  descriptor: "Aromatic Fougère · Eau de Toilette",
  film: {
    chapterOne: "The Desert",
    darkLine: "The desert keeps its stars close.",
    lightLine: "Noon on the open road.",
  },

  images: [
    { src: "/fragrances/sauvage-edt/item.png", role: "item", fit: "contain", ar: 0.477,
      alt: "The Sauvage flacon in deep gradient blue, night pooling at its shoulders, the ribbed black cap resting above a thin band of cool silver" },
    { src: "/fragrances/sauvage-edt/dark.jpg", role: "lifestyle", ar: 1.5,
      alt: "The buttes of Monument Valley standing sentinel under a sky thick with stars, moonlight tracing their edges while the desert floor holds a faint ember glow",
      posDesktop: "50% 60%" },
    { src: "/fragrances/sauvage-edt/daylight.jpg", role: "daylight", ar: 1.5,
      alt: "An empty highway running straight toward the sandstone towers of Monument Valley, the desert dry and bright beneath a wide blue sky",
      posDesktop: "50% 55%" },

    /* chapter IV — the desert key visuals, the flacon as monolith */
    { src: "/fragrances/sauvage-edt/campaign-5.jpg", role: "editorial", ar: 0.75,
      caption: "The desert key visual",
      alt: "The Sauvage flacon stands alone on cracked desert earth, its blue-black gradient dissolving into clear glass against a haze of pale mountains" },
    { src: "/fragrances/sauvage-edt/campaign-2.jpg", role: "editorial", ar: 1.0,
      caption: "The 2015 launch",
      alt: "Depp rolls up a sleeve under an ozone-blue desert sky, rings and turquoise at his wrists, while the dark Sauvage flacon stands monumental against the scrubland" },
    { src: "/fragrances/sauvage-edt/campaign-6.jpg", role: "editorial", ar: 0.924,
      caption: "Monolith over desert rock",
      alt: "Seen from below like a standing stone, the flacon towers over sunlit desert rock, magnetic blue ink pooling at its shoulders" },
    { src: "/fragrances/sauvage-edt/campaign-1.jpg", role: "editorial", ar: 1.911,
      caption: "The blue-hour poster",
      alt: "Johnny Depp at blue hour, eyes closed against a bruised twilight sky, the SAUVAGE wordmark floating in white serif capitals across the deepening blue" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#7E9CC0",
    accentGlow: "rgba(126, 156, 192, 0.30)",
    accentBright: "#9FBBD9",
    accentDeep: "#4F6B8C",
    metal: "silver",
  },
};

export default sauvageEdt;
