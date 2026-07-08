"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./experience.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BrightExhale({
  src,
  alt,
  ar = 0.686,
  caption,
}: {
  src: string;
  alt: string;
  ar?: number;
  caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  const initial = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 };
  const shown = { opacity: 1, y: 0 };

  return (
    <section className={styles.exhale}>
      <motion.div
        ref={ref}
        className={styles.exhaleFrame}
        style={{ aspectRatio: ar }}
        initial={initial}
        animate={inView ? shown : initial}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 860px) 60vw, 520px"
        />
      </motion.div>
      <p className={styles.exhaleCap}>{caption}</p>
    </section>
  );
}
