"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import styles from "./film.module.css";

type Img = { src: string; alt: string; pos?: string };

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
  specs: [string, string][];
  items: { bottle: Img; atmos: Img | null; day: Img };
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function Reel({ data }: { data: FilmData }) {
  const chapters = [
    { id: "title", label: "Confession" },
    ...(data.items.atmos ? [{ id: "atmos", label: "In the Dark" }] : []),
    { id: "notes", label: "The Notes" },
    { id: "accord", label: "The Character" },
    { id: "light", label: "In Light" },
    { id: "acquire", label: "Acquire" },
  ];
  const n = chapters.length;

  const [i, setI] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);

  const goto = useCallback(
    (idx: number) => setI(() => Math.max(0, Math.min(n - 1, idx))),
    [n]
  );
  const go = useCallback(
    (d: number) => setI((p) => Math.max(0, Math.min(n - 1, p + d))),
    [n]
  );

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
  }, [go, goto, n]);

  /* wheel / trackpad — vertical or horizontal advances chapters */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
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
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchend", te, { passive: true });
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchend", te);
    };
  }, [go]);

  const sig = new Set(data.signature.map((s) => s.toLowerCase()));
  const isSig = (note: string) => sig.has(note.toLowerCase());

  return (
    <div className={styles.stage} ref={stageRef}>
      <div className={styles.ground} aria-hidden="true" />

      <div
        className={styles.track}
        style={{ transform: `translateX(-${i * 100}vw)` }}
      >
        {chapters.map((c, idx) => (
          <section
            key={c.id}
            className={styles.panel}
            data-active={idx === i}
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
                <div className={styles.bottle}>
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
                <p className={`${styles.frameKicker} ${styles.rv}`}>{data.family}</p>
                <p className={`${styles.frameLine} ${styles.rv}`}>
                  Warmth, confessed in the dark.
                </p>
              </FullFrame>
            )}

            {c.id === "notes" && (
              <div className={styles.notes}>
                <p className={`${styles.eyebrow} ${styles.eyebrowGold} ${styles.rv}`}>
                  The Composition
                </p>
                <div className={styles.tiers}>
                  {(
                    [
                      ["Top", data.notes.top],
                      ["Heart", data.notes.heart],
                      ["Base", data.notes.base],
                    ] as [string, string[]][]
                  ).map(([label, notes], t) => (
                    <div
                      className={`${styles.tier} ${styles.rv}`}
                      key={label}
                      style={{ "--d": `${0.1 + t * 0.12}s` } as CSSProperties}
                    >
                      <span className={styles.tierLabel}>
                        {ROMAN[t]} · {label}
                      </span>
                      <div className={styles.tierNotes}>
                        {notes.map((note) => (
                          <span
                            key={note}
                            className={isSig(note) ? styles.noteSig : styles.note}
                          >
                            {note}
                          </span>
                        ))}
                      </div>
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
                <p className={`${styles.frameKicker} ${styles.rv}`}>In Light</p>
                <p className={`${styles.frameLine} ${styles.rv}`}>
                  The confession, stepped into daylight.
                </p>
              </FullFrame>
            )}

            {c.id === "acquire" && (
              <div className={styles.acquire}>
                <p className={`${styles.eyebrow} ${styles.rv}`}>The Object</p>
                <dl className={styles.spec}>
                  {data.specs.map(([kk, vv], s) => (
                    <div
                      className={`${styles.specRow} ${styles.rv}`}
                      key={kk}
                      style={{ "--d": `${0.1 + s * 0.06}s` } as CSSProperties}
                    >
                      <dt className={styles.specKey}>{kk}</dt>
                      <dd className={styles.specVal}>{vv}</dd>
                    </div>
                  ))}
                </dl>
                {data.inspiredBy && (
                  <p className={`${styles.aside} ${styles.rv}`}>
                    In the spirit of {data.inspiredBy}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* ---------- persistent film HUD ---------- */}
      <div className={styles.hud}>
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
