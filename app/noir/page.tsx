import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFragranceBySlug } from "@/lib/content";
import { type ReelFrame } from "@/components/noir/media";
import Cinema from "@/components/noir/Cinema";
import NoirNav from "@/components/noir/NoirNav";
import Hero from "@/components/noir/Hero";
import Manifesto from "@/components/noir/Manifesto";
import Pyramid from "@/components/noir/Pyramid";
import AccordMeters from "@/components/noir/AccordMeters";
import BrollReel from "@/components/noir/BrollReel";
import Reveal from "@/components/noir/Reveal";
import styles from "./noir.module.css";

export const metadata: Metadata = {
  title: "His Confession — Chiaroscuro",
  description:
    "Lattafa His Confession, Eau de Parfum — an Amber Oriental Woody rendered as a cinematic-noir editorial.",
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

const REEL: { role: string; caption: string }[] = [
  { role: "unboxing", caption: "The Reveal" },
  { role: "packaging", caption: "The Vessel" },
  { role: "lifestyle", caption: "By Lamplight" },
  { role: "in-hand", caption: "In Hand" },
];

const MANIFESTO =
  "Warmth, confessed in the dark — cinnamon and iris drawn slow over tonka, amber and incense; an amber oriental woody worn like a secret kept after nightfall.";

const TONKA_COPY =
  "At the centre of the confession sits tonka bean — warm, almond-dark, faintly sweet. It is the passion the whole composition is built around, and the note that lingers longest on the skin.";

const INSPIRED_SUB =
  "An honest homage rather than a copy — Lattafa renders the idea in its own hand: warmer, more nocturnal, and offered at a fraction of the price.";

export default function NoirPage() {
  const f = getFragranceBySlug("his-confession");
  if (!f) notFound();

  const imageByRole = (role: string) => f.images.find((i) => i.role === role);

  const hero = imageByRole("item");
  const inHand = imageByRole("in-hand");
  const daylight = imageByRole("daylight");
  if (!hero || !inHand || !daylight) notFound();

  const variant = f.variants.find((v) => v.isDefault) ?? f.variants[0];
  const size = variant.sizes[0];
  const concentrationLabel = CONCENTRATION[variant.concentration] ?? variant.concentration;
  const familyLabel = `${f.family.replace("/", " / ")} Woody`; // "Amber / Oriental Woody"
  const priceLabel = size.priceRange
    ? `approx. $${size.priceRange[0]}–${size.priceRange[1]}`
    : size.price
      ? `$${size.price}`
      : "—";

  const datelineItems = [
    f.brand,
    String(f.releaseYear),
    f.origin ?? "",
    familyLabel,
    `${concentrationLabel} · ${size.ml} ml`,
  ].filter(Boolean);

  const tiers = [
    { label: "Top", numeral: "I", notes: f.notes.top },
    { label: "Heart", numeral: "II", notes: f.notes.heart },
    { label: "Base", numeral: "III", notes: f.notes.base },
  ];

  const reelFrames: ReelFrame[] = REEL.map(({ role, caption }) => {
    const im = imageByRole(role)!;
    return { src: im.src, alt: im.alt, caption, ar: im.ar ?? 0.66 };
  }).filter((frame) => Boolean(frame.src));

  const specRows: [string, string][] = [
    ["Concentration", concentrationLabel],
    ["Volume", `${size.ml} ml`],
    ["Origin", `${f.origin}, ${f.releaseYear}`],
    ["Family", familyLabel],
    ["Wear", "Fall / Winter, Evening"],
    ["Price", priceLabel],
  ];

  return (
    <main className={styles.page}>
      <div className={styles.vignette} aria-hidden="true" />
      <NoirNav />

      {/* 1 · HERO */}
      <Hero
        eyebrow={`${f.brand} · ${f.origin} · ${f.releaseYear}`}
        titleWords={f.title.split(" ")}
        epigraph={f.epigraph ?? ""}
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />

      {/* 2 · OVERTURE / MANIFESTO */}
      <Manifesto text={MANIFESTO} />

      {/* 3 · DATELINE */}
      <section className={`${styles.section} ${styles.base0} ${styles.dateline}`}>
        <Reveal className={styles.inner}>
          <div className={styles.datelineRow}>
            {datelineItems.map((item, i) => (
              <span key={item} className={styles.datelineItem}>
                {item}
                {i < datelineItems.length - 1 && (
                  <span className={styles.datelineDot} aria-hidden="true">
                    {"  ·  "}
                  </span>
                )}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 4 · COMPOSITION / PYRAMID */}
      <section id="composition" className={`${styles.section} ${styles.raise}`}>
        <div className={styles.inner}>
          <Reveal className={styles.compHead}>
            <p className={`${styles.eyebrow} ${styles.eyebrowGold}`}>The Composition</p>
            <h2 className={`${styles.h2} serif`}>From the first breath to the last.</h2>
          </Reveal>
          <Pyramid tiers={tiers} signature={f.signatureNotes} />
        </div>
      </section>

      {/* 5 · TONKA SPOTLIGHT — full-bleed cinematic band */}
      <Cinema src={inHand.src} alt={inHand.alt} pos="50% 40%">
        <div className={styles.cinemaLockup}>
          <p className={`${styles.eyebrow} ${styles.eyebrowGold}`}>The Heart</p>
          <h2 className={styles.tonkaTitle}>Tonka</h2>
          <p className={styles.tonkaCopy}>{TONKA_COPY}</p>
        </div>
      </Cinema>

      {/* 6 · ACCORD PROFILE */}
      <section className={`${styles.section} ${styles.raise}`}>
        <div className={styles.inner}>
          <Reveal className={styles.accordsHead}>
            <p className={`${styles.eyebrow} ${styles.eyebrowGold}`}>The Accords</p>
            <h2 className={`${styles.h2} serif`}>The measure of its character.</h2>
          </Reveal>
          <AccordMeters accords={f.accords} />
        </div>
      </section>

      {/* 7 · B-ROLL REEL */}
      <section className={`${styles.section} ${styles.base0} ${styles.broll}`}>
        <Reveal className={styles.brollHead}>
          <p className={styles.eyebrow}>The Object</p>
          <h2 className={`${styles.h2} serif`}>Held, unboxed, worn.</h2>
        </Reveal>
        <BrollReel frames={reelFrames} />
      </section>

      {/* 8 · DAYLIGHT COUNTERPOINT — full-bleed bright band */}
      <Cinema
        src={daylight.src}
        alt={daylight.alt}
        pos={daylight.posDesktop ?? "50% 42%"}
        variant="bright"
      >
        <div className={styles.cinemaLockup}>
          <p className={styles.cinemaCap}>The confession, stepped into the light.</p>
        </div>
      </Cinema>

      {/* 9 · SPECIFICATION */}
      <section className={`${styles.section} ${styles.base0}`}>
        <div className={styles.inner}>
          <Reveal className={styles.specHead}>
            <p className={styles.eyebrow}>Specification</p>
          </Reveal>
          <Reveal>
            <dl className={styles.specList}>
              {specRows.map(([key, value]) => (
                <div key={key} className={styles.specRow}>
                  <dt className={styles.specKey}>{key}</dt>
                  <dd className={`${styles.specVal} serif`}>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* 10 · INSPIRED-BY ASIDE */}
      {f.inspiredBy.length > 0 && (
        <section className={`${styles.section} ${styles.raise}`}>
          <Reveal className={`${styles.inner} ${styles.inspiredInner}`}>
            <p className={styles.inspiredLead}>In the spirit of {f.inspiredBy[0]}</p>
            <p className={styles.inspiredSub}>{INSPIRED_SUB}</p>
          </Reveal>
        </section>
      )}

      {/* 11 · CTA + FOOTER */}
      <section id="acquire" className={`${styles.section} ${styles.cta}`}>
        <div className={`${styles.inner} ${styles.ctaInner}`}>
          <Reveal>
            <a href="#acquire" className={styles.acquire}>
              Acquire — {concentrationLabel}, {size.ml} ml
            </a>
          </Reveal>
          <div className={styles.footer}>
            <span className={styles.footerWm}>{f.brand}</span>
            <div className={styles.footerRule} aria-hidden="true" />
            <p className={styles.footerMeta}>
              {f.title} · {concentrationLabel} · {f.releaseYear}
              <br />
              Editorial concept — imagery courtesy of {f.brand}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
