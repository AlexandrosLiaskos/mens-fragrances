"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import clsx from "clsx";
import styles from "@/app/noir/noir.module.css";

/**
 * Micro-nav: hidden over the hero, appears past ~80vh and settles
 * into a thin bg-sink bar with a bottom hairline. No menu — the
 * product owns the frame.
 */
export default function NoirNav() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    setVisible(y > vh * 0.8);
    setScrolled(y > vh * 0.9);
  });

  return (
    <motion.nav
      className={clsx(styles.nav, visible && styles.isVisible, scrolled && styles.isScrolled)}
      aria-label="Primary"
    >
      <span className={styles.navWord}>LATTAFA</span>
      <a href="#acquire" className={styles.navAcquire}>
        Acquire
      </a>
    </motion.nav>
  );
}
