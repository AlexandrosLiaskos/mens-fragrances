"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import styles from "@/app/noir/noir.module.css";

const DIM = "#55565B"; // ink-3
const LIT = "#F4F1EA"; // ink-0

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const color = useTransform(progress, range, [DIM, LIT]);
  return <motion.span style={{ color }}>{children} </motion.span>;
}

/**
 * Noir voiceover: each word lights from ink-3 to ink-0 as the line
 * passes screen centre. The first word is a static gold small-caps
 * drop-accent — the one ornament, used once.
 */
export default function Manifesto({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = text.split(" ");
  const [first, ...rest] = words;
  const n = rest.length;

  return (
    <section className={`${styles.section} ${styles.raise} ${styles.manifesto}`}>
      <div className={styles.manifestoInner}>
        <p className={styles.eyebrow}>The Overture</p>
        <p ref={ref} className={styles.manifestoText}>
          <span className={styles.dropcap}>{first} </span>
          {reduce
            ? <span style={{ color: "#C7C3BA" }}>{rest.join(" ")}</span>
            : rest.map((w, i) => {
                const start = i / n;
                const end = (i + 1) / n;
                return (
                  <Word key={`${w}-${i}`} progress={scrollYProgress} range={[start, end]}>
                    {w}
                  </Word>
                );
              })}
        </p>
      </div>
    </section>
  );
}
