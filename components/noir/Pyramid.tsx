"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import styles from "@/app/noir/noir.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

type Tier = { label: string; numeral: string; notes: string[] };

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

export default function Pyramid({
  tiers,
  signature,
}: {
  tiers: Tier[];
  signature: string[];
}) {
  const reduce = useReducedMotion();
  const sig = new Set(signature.map((s) => s.toLowerCase()));

  return (
    <div className={styles.pyramid}>
      {tiers.map((tier) => (
        <motion.div
          key={tier.label}
          className={styles.tier}
          variants={container}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div variants={item} className={styles.tierHead}>
            <span className={styles.tierLabel}>{tier.label}</span>
            <span className={styles.tierNum}>{tier.numeral}</span>
          </motion.div>
          <div className={styles.tierNotes}>
            {tier.notes.map((note) => {
              const isSig = sig.has(note.toLowerCase());
              return (
                <motion.div key={note} variants={item} className={styles.note}>
                  {isSig ? (
                    <span className={styles.noteSig}>
                      <span className={styles.noteName}>{note}</span>
                      <span className={styles.sigTag}>Signature</span>
                    </span>
                  ) : (
                    note
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
