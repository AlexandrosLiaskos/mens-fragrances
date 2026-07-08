"use client";

import type { Fragrance } from "@/lib/schema";
import { Hero } from "./Hero";
import { Scene } from "./Scene";
import { Reveal, Chrome, AccordMeter } from "./primitives";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <div className="fact__label">{label}</div>
      <div className="fact__value">{value}</div>
    </div>
  );
}

export function Story({ fragrance: f }: { fragrance: Fragrance }) {
  const img = (role: string) => f.images.find((i) => i.role === role);
  const variant = f.variants.find((v) => v.isDefault) ?? f.variants[0];
  const size = variant.sizes[0];
  const price = size.priceRange
    ? `$${size.priceRange[0]}–${size.priceRange[1]}`
    : size.price
      ? `$${size.price}`
      : "—";

  const tiers = [
    { label: "Opening", n: "Top", notes: f.notes.top },
    { label: "Heart", n: "Middle", notes: f.notes.heart },
    { label: "Base", n: "Dry-down", notes: f.notes.base },
  ];
  const sig = new Set(f.signatureNotes.map((s) => s.toLowerCase()));

  const item = img("item");
  const lifestyle = img("lifestyle");
  const unboxing = img("unboxing");
  const packaging = img("packaging");
  const inHand = img("in-hand");
  const daylight = img("daylight");

  return (
    <>
      <Chrome backHref="/" title={f.title} />

      {/* ACT I — the bottle, melded into the dark */}
      {item && <Hero f={f} image={item} />}

      {/* ACT II — the confession (atmospheric) */}
      {lifestyle && (
        <Scene image={lifestyle} spot="50% 40%" zoom={1.42}>
          <div className="cap">
            <Reveal>
              <p className="eyebrow">The confession</p>
            </Reveal>
            {f.epigraph && (
              <Reveal delay={0.08}>
                <p className="cap__q">&ldquo;{f.epigraph}&rdquo;</p>
              </Reveal>
            )}
            <Reveal delay={0.16}>
              <p className="cap__meta">By {f.brand}</p>
            </Reveal>
          </div>
        </Scene>
      )}

      {/* ACT III — the composition */}
      <section className="essence">
        <div className="essence__bloom" aria-hidden="true" />
        <div className="essence__inner">
          <div className="essence__head">
            <Reveal>
              <p className="eyebrow">The composition</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="serif">{f.subFamily ?? f.family}</h2>
            </Reveal>
          </div>

          <div className="notes">
            {tiers.map((t, ti) => (
              <Reveal key={t.label} delay={ti * 0.08}>
                <div className="tier">
                  <div className="tier__label">
                    <span>{t.label}</span>
                    <span className="n">{t.n}</span>
                  </div>
                  <div className="tier__notes">
                    {t.notes.map((n, ni) => (
                      <span key={n}>
                        {ni > 0 && <span className="sep">·</span>}
                        <span className={sig.has(n.toLowerCase()) ? "star" : ""}>{n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="accords">
            <Reveal>
              <p className="eyebrow accords__ey">Character</p>
            </Reveal>
            {f.accords.map((a, ai) => (
              <AccordMeter key={a.name} name={a.name} intensity={a.intensity} delay={ai * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ACT IV — the reveal */}
      {unboxing && (
        <Scene image={unboxing} spot="55% 46%">
          <div className="cap">
            <Reveal>
              <p className="eyebrow">The reveal</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="cap__title">Midnight velvet</h3>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="cap__meta">Eau de Parfum · {size.ml} ml</p>
            </Reveal>
          </div>
        </Scene>
      )}

      {/* ACT V — the object */}
      {packaging && (
        <Scene image={packaging} spot="50% 44%" zoom={1.32}>
          <div className="cap">
            <Reveal>
              <p className="eyebrow">The object</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="cap__title">Cased in gold foil</h3>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="cap__meta">{size.ml} ml · Natural spray</p>
            </Reveal>
          </div>
        </Scene>
      )}

      {/* ACT VI — worn */}
      {inHand && (
        <Scene image={inHand} spot="50% 46%" zoom={1.42}>
          <div className="cap">
            <Reveal>
              <p className="eyebrow">Worn</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="cap__title">In the hand</h3>
            </Reveal>
          </div>
        </Scene>
      )}

      {/* ACT VII — daylight break */}
      {daylight && (
        <Scene image={daylight} variant="light" spot="50% 40%">
          <div className="cap">
            <Reveal>
              <p className="eyebrow">Still life</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="cap__title">The confession in daylight</h3>
            </Reveal>
          </div>
        </Scene>
      )}

      {/* ACT VIII — the record + exit */}
      <section className="facts">
        <div className="facts__inner">
          <Reveal>
            <div className="facts__grid">
              <Fact label="Family" value={f.subFamily ?? f.family} />
              <Fact label="House" value={f.brand} />
              <Fact label="Year" value={String(f.releaseYear)} />
              <Fact label="Concentration" value="Eau de Parfum" />
              <Fact label="Size" value={`${size.ml} ml`} />
              <Fact label="Price" value={price} />
              <Fact label="Season" value={f.seasons.join(" / ")} />
              <Fact label="Wear" value={f.occasions[0]} />
            </div>
          </Reveal>
          {f.inspiredBy.length > 0 && (
            <Reveal delay={0.1}>
              <p className="facts__mood">
                In the mood of <em className="serif">{f.inspiredBy.join(", ")}</em>
                <span> — a community observation.</span>
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer__wm" aria-hidden="true">{f.title}</div>
        <a className="footer__back" href="/">
          <span className="arrow">&larr;</span> Return to the catalogue
        </a>
        <p className="footer__meta">
          {f.brand} · {f.origin} · Fragrance data compiled from community sources
        </p>
      </footer>
    </>
  );
}
