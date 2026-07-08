"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./experience.module.css";

export type Accord = { name: string; intensity: number };

export default function AccordMeter({
  accords,
  heading = "Accord Structure",
}: {
  accords: Accord[];
  heading?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  const rows = [...accords].sort((a, b) => b.intensity - a.intensity);

  return (
    <section className={styles.accord}>
      <div className={styles.accordInner} ref={ref}>
        <p className={styles.accordHead}>{heading}</p>
        {rows.map((accord, i) => {
          const target = `${accord.intensity}%`;
          return (
            <div className={styles.accordRow} key={accord.name}>
              <span className={styles.accordName}>{accord.name}</span>
              <span className={styles.accordTrackWrap}>
                <motion.span
                  className={styles.accordFill}
                  initial={{ width: reduce ? target : 0 }}
                  animate={inView ? { width: target } : { width: reduce ? target : 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 120, damping: 24, delay: i * 0.08 }
                  }
                />
              </span>
              <span className={styles.accordVal}>{accord.intensity}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
