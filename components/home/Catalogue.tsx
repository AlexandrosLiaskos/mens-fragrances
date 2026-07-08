"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./catalogue.module.css";

export type Item = {
  slug: string;
  title: string;
  brand: string;
  year: number;
  subFamily: string;
  notes: string[];
  seasons: string[];
  occasions: string[];
  concentrations: string[];
  priceMin: number;
  priceMax: number;
  image: { src: string; alt: string };
  href: string;
};

const uniq = (a: string[]) => Array.from(new Set(a)).sort();

export default function Catalogue({ items }: { items: Item[] }) {
  const families = useMemo(() => uniq(items.map((i) => i.subFamily)), [items]);
  const notes = useMemo(() => uniq(items.flatMap((i) => i.notes)), [items]);
  const seasons = useMemo(() => uniq(items.flatMap((i) => i.seasons)), [items]);
  const occasions = useMemo(() => uniq(items.flatMap((i) => i.occasions)), [items]);
  const concentrations = useMemo(() => uniq(items.flatMap((i) => i.concentrations)), [items]);
  const bounds = useMemo<[number, number]>(() => {
    const lo = Math.min(...items.map((i) => i.priceMin));
    const hi = Math.max(...items.map((i) => i.priceMax));
    return [Math.floor(lo), Math.ceil(hi)];
  }, [items]);

  const [q, setQ] = useState("");
  const [fam, setFam] = useState<Set<string>>(new Set());
  const [note, setNote] = useState<Set<string>>(new Set());
  const [season, setSeason] = useState<Set<string>>(new Set());
  const [occasion, setOccasion] = useState<Set<string>>(new Set());
  const [conc, setConc] = useState<string | null>(null);
  const [pMin, setPMin] = useState(bounds[0]);
  const [pMax, setPMax] = useState(bounds[1]);
  const [open, setOpen] = useState(false); // mobile filter drawer

  const toggler = (s: Set<string>, set: (v: Set<string>) => void) => (v: string) => {
    const n = new Set(s);
    n.has(v) ? n.delete(v) : n.add(v);
    set(n);
  };

  const priceActive = pMin > bounds[0] || pMax < bounds[1];
  const activeCount =
    (q ? 1 : 0) + fam.size + note.size + season.size + occasion.size + (conc ? 1 : 0) + (priceActive ? 1 : 0);

  const clearAll = () => {
    setQ("");
    setFam(new Set());
    setNote(new Set());
    setSeason(new Set());
    setOccasion(new Set());
    setConc(null);
    setPMin(bounds[0]);
    setPMax(bounds[1]);
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
        if (conc && !it.concentrations.includes(conc)) return false;
        if (it.priceMax < pMin || it.priceMin > pMax) return false;
        return true;
      }),
    [items, q, fam, note, season, occasion, conc, pMin, pMax]
  );

  return (
    <main className={styles.page}>
      <div className={styles.vign} aria-hidden="true" />

      <header className={styles.mast}>
        <span className={styles.wordmark}>Men&rsquo;s Fragrances</span>
        <span className={styles.tag}>
          The Cabinet · {String(items.length).padStart(2, "0")}{" "}
          {items.length === 1 ? "Fragrance" : "Fragrances"}
        </span>
        <button
          className={styles.toggle}
          onClick={() => setOpen(true)}
          aria-label="Open filters"
          aria-expanded={open}
        >
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Filters
          {activeCount > 0 && <span className={styles.toggleCount}>{activeCount}</span>}
        </button>
      </header>

      <div className={styles.body}>
        <aside
          className={`${styles.filters} ${open ? styles.filtersOpen : ""}`}
          aria-label="Filters"
          aria-hidden={undefined}
        >
          <button
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Close filters"
          >
            &times;
          </button>
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

          <Group title="Season" count={season.size}>
            <Checklist options={seasons} selected={season} onToggle={toggler(season, setSeason)} />
          </Group>

          <Group title="Occasion" count={occasion.size}>
            <Checklist options={occasions} selected={occasion} onToggle={toggler(occasion, setOccasion)} />
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

          <Group title="Price" count={priceActive ? 1 : 0}>
            <div className={styles.price}>
              <div className={styles.priceVals}>
                <span>${pMin}</span>
                <span>${pMax}</span>
              </div>
              <input
                className={styles.range}
                type="range"
                min={bounds[0]}
                max={bounds[1]}
                value={pMin}
                onChange={(e) => setPMin(Math.min(Number(e.target.value), pMax))}
                aria-label="Minimum price"
              />
              <input
                className={styles.range}
                type="range"
                min={bounds[0]}
                max={bounds[1]}
                value={pMax}
                onChange={(e) => setPMax(Math.max(Number(e.target.value), pMin))}
                aria-label="Maximum price"
              />
            </div>
          </Group>

          {activeCount > 0 && (
            <button className={styles.clear} onClick={clearAll}>
              Clear all ({activeCount})
            </button>
          )}
          <button className={styles.done} onClick={() => setOpen(false)}>
            Show {filtered.length} {filtered.length === 1 ? "Fragrance" : "Fragrances"} &rarr;
          </button>
        </aside>

        <section className={styles.collection}>
          <h2 className={styles.collTitle}>The Collection</h2>
          {filtered.length === 0 ? (
            <p className={styles.empty}>Nothing matches those filters.</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((it) => (
                <Link key={it.slug} href={it.href} className={styles.card}>
                  <div className={styles.cardImg}>
                    <Image src={it.image.src} alt={it.image.alt} fill sizes="(max-width: 860px) 45vw, 200px" />
                  </div>
                  <span className={styles.cardEyebrow}>
                    {it.brand} · {it.year}
                  </span>
                  <span className={styles.cardName}>{it.title}</span>
                  <span className={styles.cardFamily}>{it.subFamily}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
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
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.group}>
      <button
        className={styles.groupHead}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
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
  square,
}: {
  options: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
  square?: boolean;
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
              <span className={`${styles.optMark} ${square ? styles.optMarkSquare : ""}`} aria-hidden="true" />
              <span>{o}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
