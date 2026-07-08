"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import styles from "./experience.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Epigraph({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  const words = text.split(" ");
  const underlineDelay = words.length * 0.09 + 0.3;

  if (reduce) {
    return (
      <section ref={ref} className={styles.epigraph}>
        <p className={styles.epiLine}>{text}</p>
        <div className={styles.epiUnderline} />
      </section>
    );
  }

  return (
    <section ref={ref} className={styles.epigraph}>
      <motion.p
        className={styles.epiLine}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {words.map((w, i) => (
          <motion.span key={`${w}-${i}`} className={styles.word} variants={word}>
            {w}
          </motion.span>
        ))}
      </motion.p>
      <motion.div
        className={styles.epiUnderline}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: underlineDelay }}
      />
    </section>
  );
}
