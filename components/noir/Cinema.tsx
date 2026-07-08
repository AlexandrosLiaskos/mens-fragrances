"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import styles from "@/app/noir/noir.module.css";
import { BLUR_BG0 } from "./media";

/* A full-bleed (100vw) cinematic-noir image band: heavy grade + cool tint +
   vignette, edges fading into the page, gentle scroll parallax, text laid over. */
export default function Cinema({
  src,
  alt,
  pos = "50% 50%",
  variant,
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  pos?: string;
  variant?: "bright";
  priority?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className={`${styles.cinema} ${variant === "bright" ? styles.cinemaBright : ""}`}
    >
      <motion.div className={styles.cinemaImg} style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_BG0}
          sizes="100vw"
          style={{ "--pos": pos } as CSSProperties}
        />
      </motion.div>
      <div className={styles.cinemaTint} aria-hidden="true" />
      <div className={styles.cinemaGrade} aria-hidden="true" />
      <div className={styles.cinemaVign} aria-hidden="true" />
      <div className={styles.cinemaFade} aria-hidden="true" />
      <div className={styles.cinemaContent}>{children}</div>
    </section>
  );
}
