import type { FragranceInput } from "@/lib/schema";

/* Facts identical across Fragrantica (verified via snippets; page 403s),
 * Parfumo (fetched directly) and Lattafa's official US store. No perfumer is
 * publicly credited for the original Khamrah. Same house as His Confession.
 * Imagery: Lattafa's official packshot cut to transparency; scenes are
 * Pexels stock (Arabian lantern / date palm in the dunes). */
const khamrah: FragranceInput = {
  slug: "khamrah",
  title: "Khamrah",
  brand: "Lattafa",
  releaseYear: 2022,
  origin: "United Arab Emirates",
  gender: "Masculine",
  tier: "Budget",

  family: "Amber/Oriental",
  subFamily: "Amber Spicy",
  notes: {
    top: ["Cinnamon", "Nutmeg", "Bergamot"],
    heart: ["Dates", "Praline", "Tuberose", "Mahonial"],
    base: ["Vanilla", "Tonka Bean", "Amberwood", "Myrrh", "Benzoin", "Akigalawood"],
  },
  accords: [
    { name: "sweet", intensity: 100 },
    { name: "warm spicy", intensity: 95 },
    { name: "amber", intensity: 84 },
    { name: "vanilla", intensity: 80 },
    { name: "cinnamon", intensity: 72 },
  ],
  signatureNotes: ["Dates", "Cinnamon"],

  stats: { longevity: "Long lasting", sillage: "Strong" },

  seasons: ["Fall", "Winter"],
  occasions: ["Evening", "NightOut", "Date", "Special"],

  variants: [{ concentration: "EDP", sizes: [{ ml: 100 }], isDefault: true }],

  epigraph: "Dates and cinnamon, poured slow.",
  descriptor: "Amber Spicy · Eau de Parfum",
  film: {
    chapterOne: "The Pour",
    darkLine: "Lantern light, cinnamon-gold.",
    lightLine: "A lone palm among the honey dunes.",
  },

  images: [
    { src: "/fragrances/khamrah/item.png", role: "item", fit: "contain", ar: 0.631,
      alt: "The Khamrah flacon — a whisky tumbler of cut glass, its slashed facets scattering light over cognac-dark juice, a small gold plate lettered in Arabic at its heart" },
    { src: "/fragrances/khamrah/dark.jpg", role: "lifestyle", ar: 1.5,
      alt: "An Arabian lantern pierced with crescents and stars burns low on a dark table, spilling cinnamon-gold light across the wood while the night blurs to black around it",
      posDesktop: "38% 55%" },
    { src: "/fragrances/khamrah/daylight.jpg", role: "daylight", ar: 1.5,
      alt: "A lone date palm among honey-coloured dunes under a pale desert sky, the wind-ribbed sand lit like warm amber at midday" },

    /* chapter IV — frames from Lattafa's official Khamrah film */
    { src: "/fragrances/khamrah/campaign-1.jpg", role: "editorial", ar: 0.778,
      caption: "The key visual",
      alt: "The cut-glass tumbler bottle alone against pure black, its amber liquid lit from within like whisky by candlelight, a faint reflection pooling beneath it" },
    { src: "/fragrances/khamrah/campaign-2.jpg", role: "editorial", ar: 1.778,
      caption: "Campaign film still",
      alt: "Two faceted bottles lean through the dark on a diagonal, one sunk in shadow, the other blazing amber and gold where the light catches the cut glass" },
    { src: "/fragrances/khamrah/campaign-3.jpg", role: "editorial", ar: 1.778,
      caption: "The cut-glass crown",
      alt: "Seen from above against black, the crystal shoulders of the flacon splay outward like a star of cut glass, the small gold Lattafa plaque glinting at its centre" },
  ],

  inspiredBy: ["Kilian Angels' Share"],

  theme: {
    accent: "#C98737",
    accentGlow: "rgba(201, 135, 55, 0.32)",
    accentBright: "#E0A455",
    accentDeep: "#8A5A22",
    metal: "gold",
  },
};

export default khamrah;
