import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFragranceBySlug } from "@/lib/content";
import Reel, { type FilmData } from "@/components/film/Reel";

export const metadata: Metadata = {
  title: "His Confession — In Camera",
  description:
    "Lattafa His Confession — a dark, horizontal, film-like fragrance experience.",
};

const CONCENTRATION: Record<string, string> = {
  EDP: "Eau de Parfum",
  EDT: "Eau de Toilette",
  EDC: "Eau de Cologne",
  Parfum: "Parfum",
  Extrait: "Extrait de Parfum",
  Elixir: "Elixir",
  Oil: "Perfume Oil",
  Cologne: "Cologne",
};

export default function FilmPage() {
  const f = getFragranceBySlug("his-confession");
  if (!f) notFound();

  const img = (role: string) => f.images.find((i) => i.role === role);
  const item = img("item");
  const atmos = img("unboxing") ?? img("in-hand") ?? img("lifestyle");
  const day = img("daylight");
  if (!item || !day) notFound();

  const variant = f.variants.find((v) => v.isDefault) ?? f.variants[0];
  const size = variant.sizes[0];
  const conc = CONCENTRATION[variant.concentration] ?? variant.concentration;
  const family = `${f.family.replace("/", " / ")} Woody`;
  const price = size.priceRange
    ? `$${size.priceRange[0]}–${size.priceRange[1]}`
    : size.price
      ? `$${size.price}`
      : "—";

  const data: FilmData = {
    brand: f.brand,
    title: f.title,
    origin: f.origin ?? "",
    year: f.releaseYear,
    family,
    subFamily: f.subFamily ?? f.family,
    epigraph: f.epigraph ?? "",
    descriptor: f.descriptor,
    notes: f.notes,
    signature: f.signatureNotes,
    accords: f.accords,
    inspiredBy: f.inspiredBy[0] ?? "",
    specs: [
      ["Concentration", conc],
      ["Volume", `${size.ml} ml`],
      ["Origin", `${f.origin}, ${f.releaseYear}`],
      ["Family", family],
      ["Wear", "Fall / Winter · Evening"],
      ["Price", `approx. ${price}`],
    ],
    items: {
      bottle: { src: item.src, alt: item.alt },
      atmos: atmos ? { src: atmos.src, alt: atmos.alt, pos: atmos.posDesktop ?? "50% 45%" } : null,
      day: { src: day.src, alt: day.alt, pos: day.posDesktop ?? "50% 42%" },
    },
  };

  return <Reel data={data} />;
}
