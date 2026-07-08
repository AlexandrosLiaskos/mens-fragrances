"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Fade + rise + de-blur when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Per-line mask reveal for the hero name (fires on mount). */
export function HeroName({ lines }: { lines: { text: string; thin?: boolean }[] }) {
  const reduce = useReducedMotion();
  return (
    <h1 className="name">
      {lines.map((l, i) => (
        <span className="name__line" key={i}>
          <motion.span
            style={{ display: "block" }}
            className={l.thin ? "thin" : ""}
            initial={reduce ? false : { y: "110%" }}
            animate={reduce ? undefined : { y: "0%" }}
            transition={{ duration: 1.1, delay: 0.25 + i * 0.14, ease: EASE }}
          >
            {l.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* Top scroll-progress hairline + minimal fading nav. */
export function Chrome({ backHref = "/", title }: { backHref?: string; title: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
      <nav className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <a className="nav__back eyebrow" href={backHref}>
          <span className="arrow">&larr;</span> Fragrances
        </a>
        <span className="nav__title">{title}</span>
      </nav>
    </>
  );
}

/* A single accord as a hairline meter that draws in on view. */
export function AccordMeter({
  name,
  intensity,
  delay = 0,
}: {
  name: string;
  intensity: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="accord">
      <div className="accord__row">
        <span className="accord__name">{name}</span>
        <span className="accord__pct">{intensity}</span>
      </div>
      <div className="accord__track">
        <motion.div
          className="accord__fill"
          initial={reduce ? { width: `${intensity}%` } : { width: "0%" }}
          whileInView={{ width: `${intensity}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, delay, ease: EASE }}
        >
          <span className="accord__node" style={{ left: "100%" }} />
        </motion.div>
      </div>
    </div>
  );
}

/* A short gold hairline that draws in beside copy. */
export function GoldRule({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="goldrule"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      aria-hidden="true"
    />
  );
}

/* Animated scroll cue for the hero. */
export function ScrollCue() {
  return (
    <div className="cue" aria-hidden="true">
      <span>Scroll</span>
      <span className="cue__rail" />
    </div>
  );
}
