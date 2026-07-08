"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "@/app/noir/noir.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

type Accord = { name: string; intensity: number };

export default function AccordMeters({ accords }: { accords: Accord[] }) {
  const reduce = useReducedMotion();

  return (
    <div className={styles.meters}>
      {accords.map((a, i) => (
        <div key={a.name}>
          <div className={styles.meterHead}>
            <span className={styles.meterName}>{a.name}</span>
            <span className={styles.meterVal}>{a.intensity}</span>
          </div>
          <div className={styles.meterTrack}>
            <motion.div
              className={styles.meterFill}
              style={{ width: "100%" }}
              initial={reduce ? { scaleX: a.intensity / 100 } : { scaleX: 0 }}
              whileInView={{ scaleX: a.intensity / 100 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: EASE, delay: reduce ? 0 : i * 0.08 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
