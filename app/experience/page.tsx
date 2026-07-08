import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFragranceBySlug } from "@/lib/content";
import { themeToCssVars } from "@/lib/theme";
import CraneRail from "@/components/experience/CraneRail";
import Epigraph from "@/components/experience/Epigraph";
import AccordMeter from "@/components/experience/AccordMeter";
import Gallery from "@/components/experience/Gallery";
import BrightExhale from "@/components/experience/BrightExhale";
import AcquireFooter, { type Spec } from "@/components/experience/AcquireFooter";
import styles from "@/components/experience/experience.module.css";

const CONCENTRATION_LABEL: Record<string, string> = {
  Parfum: "Parfum",
  Extrait: "Extrait de Parfum",
  EDP: "Eau de Parfum",
  EDT: "Eau de Toilette",
  EDC: "Eau de Cologne",
  Elixir: "Elixir",
  Oil: "Perfume Oil",
  Cologne: "Cologne",
};

export const metadata: Metadata = {
  title: { absolute: "His Confession — Object Permanence" },
  description:
    "A crane shot down a single sculpture. Lattafa His Confession, held in the dark.",
};

export default function ExperiencePage() {
  const f = getFragranceBySlug("his-confession");
  if (!f) notFound();

  const item = f.images.find((i) => i.role === "item");
  const daylight = f.images.find((i) => i.role === "daylight");
  if (!item) notFound();

  // every remaining photo becomes the drifting b-roll reel
  const reel = f.images
    .filter((i) => i.role !== "item" && i.role !== "daylight")
    .map((i) => ({ src: i.src, alt: i.alt, ar: i.ar }));

  // default variant -> concentration + first size + price
  const variant = f.variants.find((v) => v.isDefault) ?? f.variants[0];
  const size = variant.sizes[0];
  const concentration = CONCENTRATION_LABEL[variant.concentration] ?? variant.concentration;

  let price: string | null = null;
  if (size.priceRange) price = `~$${size.priceRange[0]}–${size.priceRange[1]}`;
  else if (size.price) price = `~$${size.price}`;

  const specs: Spec[] = [
    { label: "Concentration", value: concentration },
    { label: "Volume", value: `${size.ml} ml` },
    ...(price ? [{ label: "Price", value: price }] : []),
    { label: "Season", value: f.seasons.join(" / ") },
    { label: "Occasion", value: f.occasions[0] ?? "Evening" },
  ];

  const eyebrow = [f.brand, String(f.releaseYear), f.origin]
    .filter(Boolean)
    .join(" · ");

  return (
    <main
      className={styles.page}
      style={themeToCssVars(f.theme)}
      data-metal={f.theme.metal}
    >
      <div className={styles.vignette} aria-hidden="true" />

      <Link href="/" className={styles.index}>
        <span className={styles.arrow} aria-hidden="true">
          &larr;
        </span>
        Index
      </Link>

      <CraneRail
        src={item.src}
        alt={item.alt}
        eyebrow={eyebrow}
        title={f.title}
        sub={f.subFamily ?? f.family}
        top={f.notes.top}
        heart={f.notes.heart}
        base={f.notes.base}
        signature={f.signatureNotes}
      />

      {f.epigraph && <Epigraph text={f.epigraph} />}

      <AccordMeter accords={f.accords} />

      <Gallery images={reel} eyebrow="In passing" />

      {daylight && (
        <BrightExhale
          src={daylight.src}
          alt={daylight.alt}
          ar={daylight.ar}
          caption={daylight.alt}
        />
      )}

      <AcquireFooter
        specs={specs}
        ctaLabel={`Acquire the ${concentration}`}
        ctaHref={`/fragrance/${f.slug}`}
        whisper={
          f.inspiredBy[0] ? `In the manner of ${f.inspiredBy[0]}.` : f.descriptor
        }
        credit="Cormorant · Geist"
      />
    </main>
  );
}
