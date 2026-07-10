import type { FragranceInput } from "@/lib/schema";

/* Facts read directly from the Fragrantica page HTML (perfume #61856; accord
 * widths from the page's own accord-search links) and cross-checked on
 * Parfumo and jeanpaulgaultier.com. Officially an "Eau de Parfum Intense".
 * Imagery: Fragrantica's original press shot (fimgs.net) cut to transparency;
 * scenes are Unsplash stock (foggy harbour rigging / sails at noon). */
const leMaleLeParfum: FragranceInput = {
  slug: "le-male-le-parfum",
  title: "Le Male Le Parfum",
  brand: "Jean Paul Gaultier",
  releaseYear: 2020,
  origin: "France",
  gender: "Masculine",
  tier: "Mid",

  family: "Amber/Oriental",
  subFamily: "Amber Fougère",
  notes: {
    top: ["Cardamom"],
    heart: ["Lavender", "Iris"],
    base: ["Vanilla", "Oriental Notes", "Woodsy Notes"],
  },
  accords: [
    { name: "warm spicy", intensity: 100 },
    { name: "vanilla", intensity: 71 },
    { name: "lavender", intensity: 52 },
    { name: "aromatic", intensity: 51 },
    { name: "powdery", intensity: 50 },
  ],
  signatureNotes: ["Cardamom", "Vanilla"],

  perfumers: ["Quentin Bisch", "Natalie Gracia-Cetto"],
  stats: { longevity: "Long lasting", sillage: "Strong" },

  seasons: ["Fall", "Winter"],
  occasions: ["Evening", "NightOut", "Date", "Formal"],

  variants: [{ concentration: "EDP", sizes: [{ ml: 125 }], isDefault: true }],

  epigraph: "A sailor's vanilla, in dress uniform.",
  descriptor: "Amber Fougère · Eau de Parfum",
  film: {
    chapterOne: "The Sailor",
    darkLine: "Fog on the harbour; the watch has changed.",
    lightLine: "Full sail under a Mediterranean noon.",
  },

  images: [
    { src: "/fragrances/le-male-le-parfum/item.png", role: "item", fit: "contain", ar: 0.449,
      alt: "The sailor's torso recast in midnight glass — matte stripes banding a gloss-black chest, the gold pump and ringed collar rising from its shoulders like a decoration earned at sea" },
    { src: "/fragrances/le-male-le-parfum/dark.jpg", role: "lifestyle", ar: 1.5,
      alt: "A tall ship's rigging dissolving into harbour fog after dark, two amber lamps burning warm against the blue-black night",
      posDesktop: "50% 40%" },
    { src: "/fragrances/le-male-le-parfum/daylight.jpg", role: "daylight", ar: 1.5,
      alt: "Three white sails leaning into a brilliant Mediterranean noon, the sea a deep lacquered blue and the far islands fading to haze",
      posDesktop: "50% 55%" },

    /* chapter IV — the 2020 campaign: the flacon on deck and below it */
    { src: "/fragrances/le-male-le-parfum/campaign-1.jpg", role: "editorial", ar: 0.8,
      caption: "Mitchell Slaggert, 2020",
      alt: "The official poster: a sailor with white cap tilted back and a navy peacoat over bare shoulders sits in near-darkness beside the black-and-gold torso flacon" },
    { src: "/fragrances/le-male-le-parfum/campaign-5.jpg", role: "editorial", ar: 1.258,
      caption: "The engine room",
      alt: "The matte-black striped torso, crowned in polished gold, stands at attention on the brass engine-order telegraph of a ship's engine room, amid copper pipework and lamplit valves" },
    { src: "/fragrances/le-male-le-parfum/campaign-2.jpg", role: "editorial", ar: 1.258,
      caption: "Key visual",
      alt: "The matte-black striped torso bottle with its gilded collar stands in the amber glow of a ship's porthole, a silver travel spray at its side" },
    { src: "/fragrances/le-male-le-parfum/campaign-6.jpg", role: "editorial", ar: 1.911,
      caption: "Rope and stripes",
      alt: "Twin portraits on midnight navy: the black flacon rises from a coil of rope, gold atomizer gleaming, beside a macro study of its lacquered marinière stripes" },
  ],

  inspiredBy: [],

  theme: {
    accent: "#C9A24B",
    accentGlow: "rgba(201, 162, 75, 0.32)",
    accentBright: "#DCB65C",
    accentDeep: "#8A6D2E",
    navy: "#16263F",
    metal: "gold",
  },
};

export default leMaleLeParfum;
