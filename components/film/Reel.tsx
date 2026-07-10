"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./film.module.css";

type Img = { src: string; alt: string; pos?: string; ar?: number; fit?: "cover" | "contain" };
type Plate = Img & { caption?: string };

export type FilmData = {
  brand: string;
  title: string;
  origin: string;
  year: number;
  family: string;
  subFamily: string;
  epigraph: string;
  descriptor: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  signature: string[];
  accords: { name: string; intensity: number }[];
  inspiredBy: string;
  /** per-fragrance chapter labels + scene copy (defaults resolved server-side) */
  film: {
    chapterOne: string;
    darkLabel: string;
    lightLabel: string;
    darkKicker: string;
    darkLine: string;
    lightKicker: string;
    lightLine: string;
    galleryLabel: string;
    galleryKicker: string;
  };
  specs: [string, string][];
  items: { bottle: Img; atmos: Img | null; day: Img; gallery: Plate[] };
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function Reel({
  data,
  themeStyle,
}: {
  data: FilmData;
  themeStyle?: CSSProperties;
}) {
  const chapters = [
    { id: "title", label: data.film.chapterOne },
    ...(data.items.atmos ? [{ id: "atmos", label: data.film.darkLabel }] : []),
    // the two photographic mood scenes sit together: dark then light
    { id: "light", label: data.film.lightLabel },
    // the house's own campaign imagery, when we have it
    ...(data.items.gallery.length ? [{ id: "gallery", label: data.film.galleryLabel }] : []),
    { id: "notes", label: "The Notes" },
    { id: "accord", label: "The Character" },
    { id: "acquire", label: "Epilogue" },
  ];
  const n = chapters.length;

  const [i, setI] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);

  /* lightbox over the gallery chapter: index into items.gallery, or null */
  const [view, setView] = useState<number | null>(null);
  const viewRef = useRef<number | null>(null);
  viewRef.current = view;
  const galleryLen = data.items.gallery.length;

  /* arriving from the collection: let the stage finish rising out of
     black before the opening chapter cascades in, so the entrance reads
     black → ground → bottle breathing in → the type, one layer at a time */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 320);
    return () => window.clearTimeout(t);
  }, []);

  const goto = useCallback(
    (idx: number) => setI(() => Math.max(0, Math.min(n - 1, idx))),
    [n]
  );
  const go = useCallback(
    (d: number) => setI((p) => Math.max(0, Math.min(n - 1, p + d))),
    [n]
  );

  /* keyboard — while the lightbox is open, arrows page the plates instead */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (viewRef.current !== null) {
        if (e.key === "Escape") {
          e.preventDefault();
          setView(null);
        } else if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
          e.preventDefault();
          setView((v) => (v === null ? v : Math.min(galleryLen - 1, v + 1)));
        } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
          e.preventDefault();
          setView((v) => (v === null ? v : Math.max(0, v - 1)));
        }
        return;
      }
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") goto(0);
      else if (e.key === "End") goto(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, goto, n, galleryLen]);

  /* wheel / trackpad — vertical or horizontal advances chapters */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (viewRef.current !== null) return; // the lightbox holds the reel still
      if (lock.current) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 14) return;
      lock.current = true;
      go(d > 0 ? 1 : -1);
      // hold until the 0.9s slide settles, so a fast scroll can't cut a transition short
      window.setTimeout(() => (lock.current = false), 960);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go]);

  /* touch swipe */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let sx = 0,
      sy = 0;
    const ts = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const te = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (ax < 46 && ay < 46) return;
      const horizontal = ax >= ay;
      if (viewRef.current !== null) {
        if (horizontal) {
          // sideways pages the open lightbox…
          setView((v) =>
            v === null ? v : dx < 0 ? Math.min(galleryLen - 1, v + 1) : Math.max(0, v - 1)
          );
        } else {
          // …a vertical flick dismisses the plate
          setView(null);
        }
        return;
      }
      // vertical swipes read like scrolling a page: up = onward, down = back
      if (horizontal) go(dx < 0 ? 1 : -1);
      else go(dy < 0 ? 1 : -1);
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchend", te, { passive: true });
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchend", te);
    };
  }, [go, galleryLen]);

  const sig = new Set(data.signature.map((s) => s.toLowerCase()));
  const isSig = (note: string) => sig.has(note.toLowerCase());

  /* gallery geometry: portrait-leaning sets sit in one exact-ratio row,
     landscape-leaning sets wrap into a salon wall — never crop */
  const galleryArs = data.items.gallery.map((g) => g.ar ?? 0.75);
  const galleryArSum = galleryArs.reduce((a, b) => a + b, 0);
  const galleryWide =
    galleryArs.length > 0 && galleryArSum / galleryArs.length > 1.25;

  return (
    <div className={styles.stage} ref={stageRef} style={themeStyle}>
      <div className={styles.ground} aria-hidden="true" />

      <div
        className={styles.track}
        style={{ transform: `translateX(-${i * 100}vw)` }}
      >
        {chapters.map((c, idx) => (
          <section
            key={c.id}
            className={styles.panel}
            data-active={ready && idx === i}
            aria-hidden={idx !== i}
          >
            {c.id === "title" && (
              <div className={styles.title}>
                <div className={styles.titleCopy}>
                  <p className={`${styles.eyebrow} ${styles.rv}`}>
                    {data.brand} · {data.origin} · {data.year}
                  </p>
                  <h1 className={`${styles.bigTitle} ${styles.rv}`}>{data.title}</h1>
                  <p className={`${styles.epi} ${styles.rv}`}>&ldquo;{data.epigraph}&rdquo;</p>
                </div>
                <div
                  className={`${styles.bottle} ${
                    data.items.bottle.fit === "contain" ? styles.bottleContain : ""
                  }`}
                  style={
                    {
                      "--bottle-ar": String(data.items.bottle.ar ?? 0.286),
                    } as CSSProperties
                  }
                >
                  <div className={styles.pool} aria-hidden="true" />
                  <Image
                    src={data.items.bottle.src}
                    alt={data.items.bottle.alt}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 46vw"
                  />
                </div>
              </div>
            )}

            {c.id === "atmos" && data.items.atmos && (
              <FullFrame img={data.items.atmos}>
                <p className={`${styles.frameKicker} ${styles.rv}`}>{data.film.darkKicker}</p>
                <p className={`${styles.frameLine} ${styles.rv}`}>{data.film.darkLine}</p>
              </FullFrame>
            )}

            {c.id === "gallery" && data.items.gallery.length > 0 && (
              <div className={styles.gallery}>
                <p className={`${styles.eyebrow} ${styles.eyebrowGold} ${styles.rv}`}>
                  {data.film.galleryKicker}
                </p>
                <div
                  className={`${styles.plates} ${galleryWide ? styles.platesWrap : ""}`}
                  data-count={data.items.gallery.length}
                  style={{ "--ar-sum": String(galleryArSum || 2.2) } as CSSProperties}
                >
                  {data.items.gallery.map((g, k) => (
                    <figure
                      className={`${styles.plate} ${styles.rv}`}
                      key={g.src}
                      style={
                        {
                          "--d": `${0.14 + k * 0.13}s`,
                          "--plate-ar": String(g.ar ?? 0.75),
                        } as CSSProperties
                      }
                    >
                      <button
                        type="button"
                        className={styles.plateBtn}
                        onClick={() => setView(k)}
                        aria-label={`View plate ${k + 1}${g.caption ? ` — ${g.caption}` : ""}`}
                        aria-haspopup="dialog"
                      >
                        <div className={styles.plateImg}>
                          <Image
                            src={g.src}
                            alt={g.alt}
                            fill
                            sizes="(max-width: 900px) 50vw, 33vw"
                            style={{ objectPosition: g.pos ?? "50% 50%" }}
                          />
                        </div>
                      </button>
                      <figcaption className={styles.plateCap}>
                        <span className={styles.plateNo}>
                          {String(k + 1).padStart(2, "0")}
                        </span>
                        {g.caption ?? ""}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {c.id === "notes" && (
              <div className={styles.notes}>
                <p className={`${styles.eyebrow} ${styles.eyebrowGold} ${styles.rv}`}>
                  The Composition
                </p>
                <div className={styles.pyramid}>
                  {(
                    [
                      ["Top", "the first breath", data.notes.top],
                      ["Heart", "the hour after", data.notes.heart],
                      ["Base", "what remains", data.notes.base],
                    ] as [string, string, string[]][]
                  ).map(([label, whisper, notes], t) => (
                    <div
                      className={`${styles.band} ${styles.rv}`}
                      key={label}
                      style={{ "--d": `${0.12 + t * 0.14}s` } as CSSProperties}
                    >
                      <div className={styles.bandLabel}>
                        <span className={styles.bandHead}>
                          <span className={styles.bandRoman}>{ROMAN[t]}</span>
                          <span className={styles.bandTier}>{label}</span>
                        </span>
                        <span className={styles.bandWhisper}>{whisper}</span>
                      </div>
                      <p className={styles.bandNotes}>
                        {notes.map((note, j) => (
                          <Fragment key={note}>
                            {j > 0 && (
                              <span className={styles.bandSep} aria-hidden="true">
                                ·
                              </span>
                            )}
                            <span className={isSig(note) ? styles.noteSig : undefined}>
                              {note}
                            </span>
                          </Fragment>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {c.id === "accord" && (
              <div className={styles.character}>
                <div className={styles.charHead}>
                  <p className={`${styles.eyebrow} ${styles.eyebrowGold} ${styles.rv}`}>
                    The Character
                  </p>
                  <h2 className={`${styles.charTitle} ${styles.rv}`}>{data.subFamily}</h2>
                </div>
                <div className={styles.meters}>
                  {data.accords.map((a, k) => (
                    <div
                      className={`${styles.meter} ${styles.rv}`}
                      key={a.name}
                      style={{ "--d": `${0.15 + k * 0.09}s` } as CSSProperties}
                    >
                      <div className={styles.meterHead}>
                        <span className={styles.meterName}>{a.name}</span>
                        <span className={styles.meterVal}>{a.intensity}</span>
                      </div>
                      <div className={styles.meterTrack}>
                        <span
                          className={styles.meterFill}
                          style={
                            {
                              "--w": `${a.intensity}%`,
                              "--d": `${0.25 + k * 0.09}s`,
                            } as CSSProperties
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {c.id === "light" && (
              <FullFrame img={data.items.day} bright>
                <p className={`${styles.frameKicker} ${styles.rv}`}>{data.film.lightKicker}</p>
                <p className={`${styles.frameLine} ${styles.rv}`}>{data.film.lightLine}</p>
              </FullFrame>
            )}

            {c.id === "acquire" && (
              <div className={styles.colophon}>
                <p className={`${styles.eyebrow} ${styles.eyebrowGold} ${styles.rv}`}>
                  The Object
                </p>
                <dl
                  className={styles.factGrid}
                  data-cols={data.specs.length % 4 === 0 ? 4 : 3}
                >
                  {data.specs.map(([kk, vv], s) => (
                    <div
                      className={`${styles.fact} ${styles.rv}`}
                      key={kk}
                      style={{ "--d": `${0.12 + s * 0.07}s` } as CSSProperties}
                    >
                      <dt className={styles.factKey}>{kk}</dt>
                      <dd className={styles.factVal}>{vv}</dd>
                    </div>
                  ))}
                </dl>
                <div
                  className={`${styles.colophonEnd} ${styles.rv}`}
                  style={{ "--d": "0.75s" } as CSSProperties}
                >
                  <span className={styles.colophonRule} aria-hidden="true" />
                  {data.inspiredBy ? (
                    <p className={styles.aside}>In the spirit of {data.inspiredBy}</p>
                  ) : (
                    <p className={styles.aside}>
                      {data.brand} · {data.year}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* ---------- persistent film HUD ---------- */}
      <div className={styles.hud}>
        <Link href="/" className={styles.back} aria-label="Back to the collection">
          <span className={styles.backArrow} aria-hidden="true">&larr;</span>
          <span className={styles.backLabel}>Collection</span>
        </Link>

        <div className={styles.progress}>
          <span
            className={styles.progressBar}
            style={{ transform: `scaleX(${(i + 1) / n})` }}
          />
        </div>

        <div className={styles.brand}>{data.title}</div>
        <div className={styles.counter}>
          <span className={styles.counterNow}>{String(i + 1).padStart(2, "0")}</span>
          <span className={styles.counterSep}>/</span>
          <span>{String(n).padStart(2, "0")}</span>
        </div>

        <button
          className={styles.prev}
          onClick={() => go(-1)}
          disabled={i === 0}
          aria-label="Previous chapter"
        >
          &larr;
        </button>
        <button
          className={styles.next}
          onClick={() => go(1)}
          disabled={i === n - 1}
          aria-label="Next chapter"
        >
          &rarr;
        </button>

        <nav className={styles.rail} aria-label="Chapters">
          {chapters.map((c, idx) => (
            <button
              key={c.id}
              className={`${styles.dot} ${idx === i ? styles.dotOn : ""}`}
              onClick={() => goto(idx)}
              aria-label={`${ROMAN[idx]} — ${c.label}`}
              aria-current={idx === i}
            >
              <span className={styles.dotRoman}>{ROMAN[idx]}</span>
              <span className={styles.dotLabel}>{c.label}</span>
            </button>
          ))}
        </nav>

        {i === 0 && (
          <div className={styles.hint} aria-hidden="true">
            scroll · swipe · &rarr;
          </div>
        )}
      </div>

      {/* ---------- gallery lightbox ---------- */}
      {view !== null && data.items.gallery[view] && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={data.items.gallery[view].caption ?? data.items.gallery[view].alt}
          onClick={() => setView(null)}
        >
          <figure
            className={styles.lbFigure}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={styles.lbImg}
              style={{ "--lb-ar": String(data.items.gallery[view].ar ?? 1.5) } as CSSProperties}
            >
              <Image
                key={data.items.gallery[view].src}
                src={data.items.gallery[view].src}
                alt={data.items.gallery[view].alt}
                fill
                sizes="92vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <figcaption className={styles.lbCap}>
              <span className={styles.plateNo}>
                {String(view + 1).padStart(2, "0")}
              </span>
              {data.items.gallery[view].caption ?? ""}
              <span className={styles.lbAlt}>{data.items.gallery[view].alt}</span>
            </figcaption>
          </figure>

          <button
            type="button"
            className={styles.lbClose}
            onClick={(e) => {
              e.stopPropagation();
              setView(null);
            }}
            aria-label="Close"
            autoFocus
          >
            &times;
          </button>

          {galleryLen > 1 && (
            <>
              <button
                type="button"
                className={`${styles.lbNav} ${styles.lbPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setView((v) => (v === null ? v : Math.max(0, v - 1)));
                }}
                disabled={view === 0}
                aria-label="Previous plate"
              >
                &larr;
              </button>
              <button
                type="button"
                className={`${styles.lbNav} ${styles.lbNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setView((v) => (v === null ? v : Math.min(galleryLen - 1, v + 1)));
                }}
                disabled={view === galleryLen - 1}
                aria-label="Next plate"
              >
                &rarr;
              </button>
              <div className={styles.lbCount} aria-hidden="true">
                <span className={styles.counterNow}>
                  {String(view + 1).padStart(2, "0")}
                </span>
                <span className={styles.counterSep}>/</span>
                <span>{String(galleryLen).padStart(2, "0")}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function FullFrame({
  img,
  bright,
  children,
}: {
  img: Img;
  bright?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.full} ${bright ? styles.fullBright : ""}`}>
      <div className={styles.fullImg}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="100vw"
          style={{ objectPosition: img.pos ?? "50% 50%" }}
        />
      </div>
      <div className={styles.fullTint} aria-hidden="true" />
      <div className={styles.fullGrade} aria-hidden="true" />
      <div className={styles.fullVign} aria-hidden="true" />
      <div className={styles.fullCopy}>{children}</div>
    </div>
  );
}
