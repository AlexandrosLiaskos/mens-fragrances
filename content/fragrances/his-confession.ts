import type { FragranceInput } from "@/lib/schema";

/* Data hand-verified from Fragrantica / Parfumo / retailer listings.
 * Imagery: hero / unboxing / packaging / in-hand / daylight are the owner's
 * own photographs; `bust` is cropped from the brand key art. */
const hisConfession: FragranceInput = {
  slug: "his-confession",
  title: "His Confession",
  brand: "Lattafa",
  releaseYear: 2024,
  origin: "United Arab Emirates",
  gender: "Masculine",

  family: "Amber/Oriental",
  subFamily: "Amber Oriental Woody",
  notes: {
    top: ["Cinnamon", "Lavender", "Mandarin"],
    heart: ["Iris", "Benzoin", "Cypress", "Mahonial"],
    base: ["Vanilla", "Tonka Bean", "Amber", "Incense", "Cedarwood", "Patchouli"],
  },
  accords: [
    { name: "warm spicy", intensity: 95 },
    { name: "powdery", intensity: 85 },
    { name: "woody", intensity: 80 },
    { name: "amber", intensity: 78 },
    { name: "vanilla", intensity: 70 },
  ],
  signatureNotes: ["Tonka Bean"],

  seasons: ["Fall", "Winter"],
  occasions: ["Evening", "Formal", "NightOut"],

  variants: [
    { concentration: "EDP", sizes: [{ ml: 100, priceRange: [36, 50] }], isDefault: true },
  ],

  epigraph: "Tonka, you are my passion.",
  descriptor: "Amber Oriental · Eau de Parfum",

  images: [
    { src: "/fragrances/his-confession/item.jpg", role: "item", ar: 0.286,
      alt: "The His Confession bottle — a glossy black David bust with a gold blindfold and faceted collar on a black base" },
    { src: "/fragrances/his-confession/unboxing_2.jpg", role: "lifestyle", ar: 0.454,
      alt: "The bottle on a dark table by lamplight, a green plant and leather sofa behind",
      posDesktop: "50% 40%", posMobile: "50% 32%" },
    { src: "/fragrances/his-confession/unboxing.jpg", role: "unboxing", ar: 0.455,
      alt: "The presentation box open to reveal midnight-navy velvet and a gold poem panel",
      posDesktop: "50% 46%", posMobile: "50% 46%" },
    { src: "/fragrances/his-confession/packaging.jpg", role: "packaging", ar: 0.455,
      alt: "The wave-embossed outer box, gold foil reading His Confession, Eau de Parfum, 100 ml",
      posDesktop: "50% 30%", posMobile: "50% 24%" },
    { src: "/fragrances/his-confession/in-hand.jpg", role: "in-hand", ar: 0.630,
      alt: "The bottle held in hand over a wooden desk",
      posDesktop: "50% 42%", posMobile: "50% 44%" },
    { src: "/fragrances/his-confession/daylight.jpg", role: "daylight", ar: 0.686,
      alt: "The black bust bottle on white drapery among dried rose petals and thorn branches",
      posDesktop: "50% 42%", posMobile: "50% 42%" },
  ],

  inspiredBy: ["Dior Homme Intense"],

  theme: {
    accent: "#C9A24B",
    accentGlow: "rgba(201, 162, 75, 0.32)",
    navy: "#16263F",
    metal: "gold",
  },
};

export default hisConfession;
