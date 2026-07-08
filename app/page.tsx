import { getFragrances } from "@/lib/content";
import Catalogue, { type Item } from "@/components/home/Catalogue";

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

export default function Page() {
  const items: Item[] = getFragrances().map((f) => {
    const notes = [...f.notes.top, ...f.notes.heart, ...f.notes.base];
    const prices = f.variants
      .flatMap((v) => v.sizes)
      .flatMap((s) => (s.priceRange ? s.priceRange : s.price != null ? [s.price] : []));
    const priceMin = prices.length ? Math.min(...prices) : 0;
    const priceMax = prices.length ? Math.max(...prices) : 0;
    const item = f.images.find((i) => i.role === "item") ?? f.images[0];

    return {
      slug: f.slug,
      title: f.title,
      brand: f.brand,
      year: f.releaseYear,
      subFamily: (f.subFamily ?? f.family).replace("/", " / "),
      notes,
      seasons: f.seasons,
      occasions: f.occasions.map((o) => o.replace(/([a-z])([A-Z])/g, "$1 $2")),
      concentrations: f.variants.map((v) => CONCENTRATION[v.concentration] ?? v.concentration),
      priceMin,
      priceMax,
      image: { src: item.src, alt: item.alt },
      href: `/${f.slug}`,
    };
  });

  return <Catalogue items={items} />;
}
