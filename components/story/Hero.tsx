"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Fragrance } from "@/lib/schema";
import { Reveal, HeroName, GoldRule, ScrollCue } from "./primitives";

type HeroImage = { src: string; alt: string; ar?: number };

function Descriptor({ text }: { text: string }) {
  const parts = text.split("·").map((p) => p.trim());
  return (
    <p className="oneline">
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="dot">·</span>}
          {p}
        </span>
      ))}
    </p>
  );
}

export function Hero({ f, image }: { f: Fragrance; image: HeroImage }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // the bottle drifts up and fades slightly as you leave the hero
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.5]);

  const words = f.title.split(" ");
  const lines = words.map((w, i) => ({ text: w, thin: words.length > 1 && i === 0 }));

  return (
    <section ref={ref} className="vhero">
      <div className="vhero__ground" aria-hidden="true" />
      <div className="vhero__scrim" aria-hidden="true" />
      <div className="vhero__inner">
        <div className="vhero__copy">
          <Reveal delay={0.05}>
            <p className="eyebrow">
              {f.brand} <span className="dot">·</span> {f.releaseYear}
              {f.origin ? <> <span className="dot">·</span> {f.origin}</> : null}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <GoldRule delay={0.2} />
          </Reveal>
          <HeroName lines={lines} />
          <Reveal delay={0.85}>
            <Descriptor text={f.descriptor} />
          </Reveal>
        </div>

        <motion.div className="vhero__stage" style={{ y, opacity, "--hero-ar": image.ar ?? 0.3 } as unknown as CSSProperties}>
          <div className="vhero__bloom" aria-hidden="true" />
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 860px) 100vw, 50vw" />
          </motion.div>
        </motion.div>
      </div>
      <ScrollCue />
    </section>
  );
}
