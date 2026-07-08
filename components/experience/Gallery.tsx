import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./experience.module.css";

export type GalleryImage = { src: string; alt: string; ar?: number };

/* A continuously drifting reel of the remaining photography, darkened into
   cinematic b-roll. Pure-CSS marquee (server component); pauses on hover and
   falls back to a manual horizontal scroll under prefers-reduced-motion. */
export default function Gallery({
  images,
  eyebrow = "In passing",
}: {
  images: GalleryImage[];
  eyebrow?: string;
}) {
  if (!images.length) return null;
  const loop = [...images, ...images]; // two copies -> seamless -50% loop

  return (
    <section className={styles.gallery} aria-label="Gallery">
      <div className={styles.galleryHead}>
        <p className={styles.galleryEyebrow}>{eyebrow}</p>
      </div>
      <div className={styles.galleryScroller}>
        <div className={styles.marquee}>
          {loop.map((img, i) => {
            const clone = i >= images.length;
            return (
              <figure
                key={i}
                className={styles.card}
                style={{ "--ar": String(img.ar ?? 0.5) } as CSSProperties}
                aria-hidden={clone ? true : undefined}
              >
                <Image
                  src={img.src}
                  alt={clone ? "" : img.alt}
                  fill
                  sizes="(max-width: 860px) 72vw, 34vw"
                  className={styles.cardImg}
                />
                <span className={styles.cardGrade} aria-hidden="true" />
                <span className={styles.cardVign} aria-hidden="true" />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
