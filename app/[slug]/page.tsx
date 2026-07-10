import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFragrances, getFragranceBySlug } from "@/lib/content";
import { CONCENTRATION_LABEL, TIER_LABEL, tierSymbol, asset, defaultSku, resolveImage, humanize } from "@/lib/catalog";
import { themeToCssVars } from "@/lib/theme";
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
      images: item ? [{ url: asset(item.src), alt: item.alt }] : [],
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
  const family = (f.subFamily ?? f.family).replace("/", " / ");
  const tier = `${tierSymbol(f.tier)} · ${TIER_LABEL[f.tier] ?? f.tier}`;
  const wear = `${f.seasons.join(" / ")}${f.occasions[0] ? ` · ${humanize(f.occasions[0])}` : ""}`;

  const specs: [string, string][] = [
    ["Concentration", conc],
    ["Volume", `${size.ml} ml`],
  ];
  if (f.perfumers.length) specs.push(["Nose", f.perfumers.join(", ")]);
  specs.push(
    ["Origin", f.origin ? `${f.origin}, ${f.releaseYear}` : String(f.releaseYear)],
    ["Family", family],
    ["Wear", wear]
  );
  if (f.stats?.longevity) specs.push(["Longevity", f.stats.longevity]);
  if (f.stats?.sillage) specs.push(["Sillage", f.stats.sillage]);
  specs.push(["Price", tier]);

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
    film: {
      chapterOne: f.film?.chapterOne ?? "Overture",
      darkLabel: f.film?.darkLabel ?? "In the Dark",
      lightLabel: f.film?.lightLabel ?? "In Light",
      darkKicker: f.film?.darkKicker ?? family,
      darkLine: f.film?.darkLine ?? "Held close, after dark.",
      lightKicker: f.film?.lightKicker ?? "In Light",
      lightLine: f.film?.lightLine ?? "The same signature, stepped into daylight.",
      galleryLabel: f.film?.galleryLabel ?? "The Campaign",
      galleryKicker: f.film?.galleryKicker ?? "As the House Shows It",
    },
    specs,
    items: {
      bottle: { src: asset(bottle.src), alt: bottle.alt, ar: bottle.ar, fit: bottle.fit },
      atmos: atmos ? { src: asset(atmos.src), alt: atmos.alt, pos: atmos.posDesktop ?? "50% 45%" } : null,
      day: { src: asset(day.src), alt: day.alt, pos: day.posDesktop ?? "50% 42%" },
      gallery: f.images
        .filter((i) => i.role === "editorial")
        .map((i) => ({
          src: asset(i.src),
          alt: i.alt,
          pos: i.posDesktop ?? "50% 50%",
          ar: i.ar,
          caption: i.caption,
        })),
    },
  };

  return <Reel data={data} themeStyle={themeToCssVars(f.theme)} />;
}
