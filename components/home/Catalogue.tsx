"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./catalogue.module.css";

export type Item = {
  id: string;
  title: string;
  brand: string;
  year: number;
  subFamily: string;
  concentration: string; // display label, e.g. "Eau de Parfum"
  ml: number;
  tier: string;
  tierLabel: string;
  tierSymbol: string;
  tierRank: number;
  notes: string[];
  seasons: string[];
  occasions: string[];
  image: { src: string; alt: string };
  href: string;
};

const uniq = (a: string[]) => Array.from(new Set(a)).sort();

export default function Catalogue({
  items,
  signature,
}: {
  items: Item[];
  signature: string;
}) {
  const families = useMemo(() => uniq(items.map((i) => i.subFamily)), [items]);
  const notes = useMemo(() => uniq(items.flatMap((i) => i.notes)), [items]);
  const seasons = useMemo(() => uniq(items.flatMap((i) => i.seasons)), [items]);
  const occasions = useMemo(() => uniq(items.flatMap((i) => i.occasions)), [items]);
  const concentrations = useMemo(() => uniq(items.map((i) => i.concentration)), [items]);
  const volumes = useMemo(
    () => Array.from(new Set(items.map((i) => i.ml))).sort((a, b) => a - b).map((n) => `${n} ml`),
    [items]
  );
  const tiers = useMemo(() => {
    const seen = new Map<string, { tier: string; label: string; symbol: string; rank: number }>();
    for (const i of items) {
      if (!seen.has(i.tier)) seen.set(i.tier, { tier: i.tier, label: i.tierLabel, symbol: i.tierSymbol, rank: i.tierRank });
    }
    return Array.from(seen.values()).sort((a, b) => a.rank - b.rank);
  }, [items]);

  /* ---------- the opening title card ----------
     First visit of the session: a cinematic card holds centre-stage on
     black — "MEN'S" as a small gold kicker, then FRAGRANCES monumental,
     each letter blooming into focus from the centre outwards (the reel's
     own focus-pull). After a beat of stillness the letters drift up and
     dissolve while the page cascades in beneath the thinning veil, so
     the exit carries straight into the page. Every page animation is
     born paused (data-intro="pending") so nothing fires behind the
     curtain; the cascade is released the moment the veil starts to lift
     (state "leave"), not after it is gone. */
  type IntroState = "pending" | "hold" | "leave" | "play-intro" | "play";
  const [intro, setIntro] = useState<IntroState>("pending");

  useEffect(() => {
    let seen = false;
    let params: URLSearchParams | undefined;
    try {
      params = new URLSearchParams(window.location.search);
      /* /?intro replays the card even within a session */
      seen = sessionStorage.getItem("mf-intro-seen") === "1" && !params.has("intro");
    } catch {}
    if (seen) {
      setIntro("play");
      return;
    }
    setIntro("hold");
    /* debug: /?introhold=12000 freezes the title card for inspection */
    let holdMs = 3400;
    const v = Number(params?.get("introhold"));
    if (v > 0) holdMs = v;
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem("mf-intro-seen", "1");
      } catch {}
      setIntro("leave");
    }, holdMs);
    return () => window.clearTimeout(t);
  }, []);

  /* the veil needs ~1.6s to dissolve; then the overlay can unmount */
  useEffect(() => {
    if (intro !== "leave") return;
    const t = window.setTimeout(() => setIntro("play-intro"), 1600);
    return () => window.clearTimeout(t);
  }, [intro]);

  /* the opening wave plays once; afterwards filtering ripples in quickly */
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (intro === "pending" || intro === "hold") return;
    const t = window.setTimeout(() => setSettled(true), 2400);
    return () => window.clearTimeout(t);
  }, [intro]);

  const [q, setQ] = useState("");
  const [fam, setFam] = useState<Set<string>>(new Set());
  const [note, setNote] = useState<Set<string>>(new Set());
  const [season, setSeason] = useState<Set<string>>(new Set());
  const [occasion, setOccasion] = useState<Set<string>>(new Set());
  const [conc, setConc] = useState<string | null>(null);
  const [vol, setVol] = useState<Set<string>>(new Set());
  const [tierSel, setTierSel] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false); // mobile filter drawer

  const toggler = (s: Set<string>, set: (v: Set<string>) => void) => (v: string) => {
    const n = new Set(s);
    n.has(v) ? n.delete(v) : n.add(v);
    set(n);
  };

  const activeCount =
    (q ? 1 : 0) + fam.size + note.size + season.size + occasion.size + (conc ? 1 : 0) + vol.size + tierSel.size;

  const clearAll = () => {
    setQ("");
    setFam(new Set());
    setNote(new Set());
    setSeason(new Set());
    setOccasion(new Set());
    setConc(null);
    setVol(new Set());
    setTierSel(new Set());
  };

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        if (q) {
          const hay = `${it.title} ${it.brand} ${it.notes.join(" ")}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        if (fam.size && !fam.has(it.subFamily)) return false;
        if (note.size && !it.notes.some((n) => note.has(n))) return false;
        if (season.size && !it.seasons.some((s) => season.has(s))) return false;
        if (occasion.size && !it.occasions.some((o) => occasion.has(o))) return false;
        if (conc && it.concentration !== conc) return false;
        if (vol.size && !vol.has(`${it.ml} ml`)) return false;
        if (tierSel.size && !tierSel.has(it.tier)) return false;
        return true;
      }),
    [items, q, fam, note, season, occasion, conc, vol, tierSel]
  );

  return (
    <>
    <main
      className={styles.page}
      data-intro={
        intro === "play"
          ? "play"
          : intro === "leave" || intro === "play-intro"
            ? "play-intro"
            : "pending"
      }
    >
      <div className={styles.vign} aria-hidden="true" />

      <header className={styles.mast}>
        <span className={styles.wordmark}>
          Men&rsquo;s Fragrances
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static
            asset outside the fragrance image ladder */}
        <img
          src={signature}
          alt="Alexandros Liaskos"
          className={styles.signature}
        />
        <button
          className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close filters" : "Open filters"}
          aria-expanded={open}
        >
          <span className={styles.toggleLabel}>
            Filters
            {activeCount > 0 && <span className={styles.toggleCount}>{activeCount}</span>}
          </span>
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <div className={styles.body}>
        <aside className={`${styles.filters} ${open ? styles.filtersOpen : ""}`} aria-label="Filters">
          <input
            className={styles.search}
            type="search"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search fragrances"
          />

          <Group title="Family" count={fam.size}>
            <Checklist options={families} selected={fam} onToggle={toggler(fam, setFam)} />
          </Group>

          <Group title="Notes" count={note.size} scroll>
            <Checklist options={notes} selected={note} onToggle={toggler(note, setNote)} />
          </Group>

          <Group title="Concentration" count={conc ? 1 : 0}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {concentrations.map((c) => {
                const on = conc === c;
                return (
                  <li key={c}>
                    <button
                      className={`${styles.opt} ${on ? styles.optOn : ""}`}
                      onClick={() => setConc(on ? null : c)}
                      aria-pressed={on}
                    >
                      <span className={styles.optMark} aria-hidden="true" />
                      <span>{c}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Group>

          <Group title="Volume" count={vol.size}>
            <Checklist options={volumes} selected={vol} onToggle={toggler(vol, setVol)} />
          </Group>

          <Group title="Season" count={season.size}>
            <Checklist options={seasons} selected={season} onToggle={toggler(season, setSeason)} />
          </Group>

          <Group title="Occasion" count={occasion.size}>
            <Checklist options={occasions} selected={occasion} onToggle={toggler(occasion, setOccasion)} />
          </Group>

          <Group title="Price" count={tierSel.size}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {tiers.map((t) => {
                const on = tierSel.has(t.tier);
                return (
                  <li key={t.tier}>
                    <button
                      className={`${styles.opt} ${on ? styles.optOn : ""}`}
                      onClick={() => toggler(tierSel, setTierSel)(t.tier)}
                      aria-pressed={on}
                    >
                      <span className={styles.optMark} aria-hidden="true" />
                      <span className={styles.tierOpt}>
                        <span className={styles.tierSym}>{t.symbol}</span>
                        {t.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Group>

          {activeCount > 0 && (
            <button className={styles.clear} onClick={clearAll}>
              Clear all ({activeCount})
            </button>
          )}
          <button className={styles.done} onClick={() => setOpen(false)}>
            Show {filtered.length} {filtered.length === 1 ? "Item" : "Items"} &rarr;
          </button>
        </aside>

        <section className={styles.collection}>
          <h2 className={styles.collTitle}>The Collection</h2>
          {filtered.length === 0 ? (
            <p className={styles.empty}>Nothing matches those filters.</p>
          ) : (
            <div className={styles.grid} data-settled={settled || undefined}>
              {filtered.map((it, idx) => (
                <Link
                  key={it.id}
                  href={it.href}
                  className={styles.card}
                  style={{ "--i": idx } as CSSProperties}
                >
                  <div className={styles.cardImg}>
                    <Image
                      src={it.image.src}
                      alt={it.image.alt}
                      fill
                      sizes="(max-width: 860px) 45vw, 200px"
                      priority={idx < 4}
                    />
                  </div>
                  <span className={styles.cardEyebrow}>{it.brand}</span>
                  <span className={styles.cardName}>{it.title}</span>
                  <span className={styles.cardVariant}>
                    {it.concentration} · {it.ml} ml
                  </span>
                  <span className={styles.cardFamily}>{it.subFamily}</span>
                  <span
                    className={styles.cardTier}
                    aria-label={`Price tier: ${it.tierLabel}`}
                    title={it.tierLabel}
                  >
                    {[0, 1, 2, 3].map((k) => (
                      <span key={k} className={k <= it.tierRank ? styles.tierOn : styles.tierOff}>
                        $
                      </span>
                    ))}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>

    {(intro === "pending" || intro === "hold" || intro === "leave") && (
      <div
        className={`${styles.intro} ${intro === "leave" ? styles.introLeave : ""}`}
        aria-hidden="true"
      >
        <div className={styles.introCenter}>
          <span className={styles.introEyebrow}>Men&rsquo;s</span>
          <span className={styles.introWord}>
            {Array.from("Fragrances").map((ch, i, arr) => (
              <span
                key={i}
                className={styles.introChar}
                /* --d: distance from the word's centre — the bloom radiates outwards */
                style={{ "--d": Math.abs(i - (arr.length - 1) / 2) } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className={styles.introRule} />
        </div>
      </div>
    )}
    </>
  );
}

/* ---------- filter primitives ---------- */

function Group({
  title,
  count,
  scroll,
  children,
}: {
  title: string;
  count: number;
  scroll?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.group}>
      <button className={styles.groupHead} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className={styles.groupTitle}>
          {title}
          {count > 0 && <span className={styles.groupCount}>{count}</span>}
        </span>
        <span className={styles.groupSign} aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className={`${styles.groupBody} ${open ? styles.groupOpen : ""}`}>
        <div className={styles.groupInner}>
          <div className={`${styles.groupPad} ${scroll ? styles.groupScroll : ""}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function Checklist({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {options.map((o) => {
        const on = selected.has(o);
        return (
          <li key={o}>
            <button
              className={`${styles.opt} ${on ? styles.optOn : ""}`}
              onClick={() => onToggle(o)}
              aria-pressed={on}
            >
              <span className={styles.optMark} aria-hidden="true" />
              <span>{o}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
