import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./home.module.css";

export type Cover = {
  slug: string;
  title: string;
  brand: string;
  year: number;
  subFamily: string;
  image: { src: string; alt: string };
  href: string;
};

export default function Home({ covers }: { covers: Cover[] }) {
  const single = covers.length === 1;
  return (
    <main className={styles.stage}>
      <div className={styles.ground} aria-hidden="true" />

      <header className={styles.mast}>
        <span className={styles.wordmark}>Men&rsquo;s Fragrances</span>
        <span className={styles.tag}>
          The Cabinet · {String(covers.length).padStart(2, "0")}{" "}
          {single ? "Fragrance" : "Fragrances"}
        </span>
      </header>

      <div className={styles.intro}>
        <p className={styles.introEyebrow}>The Collection</p>
        <p className={styles.introLine}>Each fragrance, rendered as a short film in the dark.</p>
      </div>

      <div className={`${styles.rail} ${single ? styles.railSingle : ""}`}>
        {covers.map((c, i) => (
          <Link
            key={c.slug}
            href={c.href}
            className={styles.cover}
            style={{ "--d": `${0.4 + i * 0.12}s` } as CSSProperties}
          >
            <div className={styles.coverImg}>
              <div className={styles.coverPool} aria-hidden="true" />
              <Image
                src={c.image.src}
                alt={c.image.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 640px) 80vw, 360px"
              />
            </div>
            <div className={styles.coverMeta}>
              <span className={styles.coverEyebrow}>
                {c.brand} · {c.year}
              </span>
              <span className={styles.coverName}>{c.title}</span>
              <span className={styles.coverFamily}>{c.subFamily}</span>
              <span className={styles.coverEnter}>
                Enter the film{" "}
                <span className={styles.arrow} aria-hidden="true">
                  &rarr;
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <footer className={styles.foot}>
        <span className={styles.footHint}>
          {single ? "Select to enter" : "Scroll · swipe to browse"}
        </span>
      </footer>
    </main>
  );
}
