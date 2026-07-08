"use client";

import Image from "next/image";
import styles from "@/app/noir/noir.module.css";
import { BLUR_BG0, type ReelFrame } from "./media";

/**
 * Cinematic b-roll: a slow continuous drift of the secondary shots,
 * both edges feathered to black, paused on hover. The track is the
 * frame set duplicated once so translateX(-50%) loops seamlessly.
 * Reduced motion turns the drift off and lets the row scroll.
 */
export default function BrollReel({ frames }: { frames: ReelFrame[] }) {
  const doubled = [...frames, ...frames];

  return (
    <div className={styles.reel}>
      <div className={styles.reelTrack}>
        {doubled.map((f, i) => (
          <figure
            className={styles.frame}
            key={`${f.src}-${i}`}
            aria-hidden={i >= frames.length ? true : undefined}
          >
            <div className={styles.frameMedia} style={{ aspectRatio: String(f.ar) }}>
              <Image
                src={f.src}
                alt={i >= frames.length ? "" : f.alt}
                fill
                placeholder="blur"
                blurDataURL={BLUR_BG0}
                sizes="(max-width: 680px) 60vw, 30vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <figcaption className={styles.frameCap}>{f.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
