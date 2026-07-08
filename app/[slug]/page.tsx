import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFragrances, getFragranceBySlug } from "@/lib/content";
import { CONCENTRATION_LABEL, defaultSku, resolveImage } from "@/lib/catalog";
import Reel, { type FilmData } from "@/components/film/Reel";

export const dynamicParams = false;

export function generateStaticParams() {
  return getFragrances().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = getFragranceBySlug(slug);
  if (!f) return {};
  const item = f.images.find((i) => i.role === "item") ?? f.images[0];
  const desc = f.epigraph ?? f.descriptor;
  return {
    title: { absolute: `${f.title} — ${f.brand}` },
    description: desc,
    openGraph: {
      title: `${f.title} — ${f.brand}`,
      description: desc,
      images: item ? [{ url: item.src, alt: item.alt }] : [],
    },
  };
}

export default async function FragrancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = getFragranceBySlug(slug);
  if (!f) notFound();

  // resolve the default SKU (concentration + volume) and its imagery via the cascade
  const { variant, size } = defaultSku(f);
  const bottle = resolveImage(f, variant, size, "item") ?? f.images[0];
  const atmos =
    resolveImage(f, variant, size, "unboxing") ??
    resolveImage(f, variant, size, "in-hand") ??
    resolveImage(f, variant, size, "lifestyle");
  const day = resolveImage(f, variant, size, "daylight");
  if (!bottle || !day) notFound();

  const conc = CONCENTRATION_LABEL[variant.concentration] ?? variant.concentration;
  const family = `${f.family.replace("/", " / ")} Woody`;
  const price = size.priceRange
    ? `$${size.priceRange[0]}–${size.priceRange[1]}`
    : size.price != null
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
      bottle: { src: bottle.src, alt: bottle.alt },
      atmos: atmos ? { src: atmos.src, alt: atmos.alt, pos: atmos.posDesktop ?? "50% 45%" } : null,
      day: { src: day.src, alt: day.alt, pos: day.posDesktop ?? "50% 42%" },
    },
  };

  return <Reel data={data} />;
}
