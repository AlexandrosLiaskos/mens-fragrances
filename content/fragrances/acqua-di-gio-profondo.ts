import type { FragranceInput } from "@/lib/schema";

/* Facts extracted verbatim from the Fragrantica page HTML (perfume #59532;
 * accord intensities are Fragrantica's exact bar values) and cross-checked
 * on Parfumo and giorgioarmanibeauty-usa.com. Imagery: Notino packshot cut
 * to transparency; scenes are Unsplash stock (under the night sea / first
 * light on the shore). */
const acquaDiGioProfondo: FragranceInput = {
  slug: "acqua-di-gio-profondo",
  title: "Acqua di Giò Profondo",
  brand: "Giorgio Armani",
  releaseYear: 2020,
  origin: "Italy",
  gender: "Masculine",
  tier: "Premium",

  family: "Aquatic",
  subFamily: "Aquatic Aromatic",
  notes: {
    top: ["Sea Notes", "Aquozone", "Bergamot", "Green Mandarin"],
    heart: ["Rosemary", "Lavender", "Cypress", "Mastic"],
    base: ["Mineral Notes", "Musk", "Patchouli", "Amber"],
  },
  accords: [
    { name: "marine", intensity: 100 },
    { name: "aromatic", intensity: 97 },
    { name: "citrus", intensity: 72 },
    { name: "fresh spicy", intensity: 52 },
    { name: "woody", intensity: 44 },
  ],
  signatureNotes: ["Aquozone", "Sea Notes"],

  perfumers: ["Alberto Morillas"],
  stats: { longevity: "Long lasting", sillage: "Moderate" },

  seasons: ["Summer", "Spring"],
  occasions: ["Daily", "Office", "Leisure", "Date"],

  variants: [{ concentration: "EDP", sizes: [{ ml: 125 }], isDefault: true }],

  epigraph: "Deeper than blue.",
  descriptor: "Aquatic Aromatic · Eau de Parfum",
  film: {
    chapterOne: "The Deep",
    darkLine: "Beneath the surface, the sea turns to ink.",
    lightLine: "First light unlaces along the shore.",
  },

  images: [
    { src: "/fragrances/acqua-di-gio-profondo/item.png", role: "item", fit: "contain", ar: 0.491,
      alt: "The frosted indigo flacon, its deep navy cap over a slim silver collar, ACQUA DI GIÒ traced in pale silver across the glass and PROFONDO resting quietly at its base" },
    { src: "/fragrances/acqua-di-gio-profondo/dark.jpg", role: "lifestyle", ar: 1.895,
      alt: "Just beneath the night surface the sea turns to ink — pale swirls of light caught on the ceiling of water, small fish dissolving into the deep teal dark below",
      posDesktop: "50% 30%" },
    { src: "/fragrances/acqua-di-gio-profondo/daylight.jpg", role: "daylight", ar: 1.504,
      alt: "A quiet shoreline at first light, foam unlacing across wet sand as the water shades from glass-green to teal toward the open horizon" },

    /* chapter IV — the 2020 launch campaign, stills by Matthew Brookes */
    { src: "/fragrances/acqua-di-gio-profondo/campaign-1.jpg", role: "editorial", ar: 0.736,
      caption: "The new intensity, 2020",
      alt: "The official press advertisement: Aleksandar Rusić's face in monochrome close-up beside a ribbon of deep teal surf, the gradient-blue Profondo flacon below" },
    { src: "/fragrances/acqua-di-gio-profondo/campaign-2.jpg", role: "editorial", ar: 1.911,
      caption: "Key visual",
      alt: "The deep-blue lacquered bottle tilted mid-plunge in dark water, a column of silver bubbles streaming up its flank" },
    { src: "/fragrances/acqua-di-gio-profondo/campaign-5.jpg", role: "editorial", ar: 1.0,
      caption: "The Parfum, offshore",
      alt: "The Profondo Parfum flacon stands on a ridge of white sea-foam before a black-and-white ocean, its gradient blue glass the only colour in a monochrome sea" },
    { src: "/fragrances/acqua-di-gio-profondo/campaign-3.jpg", role: "editorial", ar: 1.778,
      caption: "The campaign film",
      alt: "The swimmer suspended in black water just beneath the surface, arms spread, a galaxy of bubbles blooming above him where he broke through" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#2E9DB3",
    accentGlow: "rgba(46, 157, 179, 0.32)",
    accentBright: "#55BCD1",
    accentDeep: "#1C6473",
    metal: "silver",
  },
};

export default acquaDiGioProfondo;
