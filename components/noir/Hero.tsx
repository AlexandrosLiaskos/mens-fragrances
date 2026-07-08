"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import styles from "@/app/noir/noir.module.css";
import { BLUR_BG0 } from "./media";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  eyebrow: string;
  titleWords: string[];
  epigraph: string;
  imageSrc: string;
  imageAlt: string;
};

export default function Hero({ eyebrow, titleWords, epigraph, imageSrc, imageAlt }: Props) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // bottle micro-parallax as the hero scrolls away
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const parallaxY = useSpring(rawY, { stiffness: 90, damping: 24 });

  const copyContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const titleContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(14px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.0, ease: EASE } },
  };
  const epigraphV: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
  };

  return (
    <section ref={heroRef} className={styles.hero} id="page-top">
      <motion.div
        className={styles.heroCopy}
        variants={copyContainer}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.p variants={fadeUp} className={styles.heroEyebrow}>
          {eyebrow}
        </motion.p>

        <motion.h1 className={styles.heroTitle} variants={titleContainer}>
          <span className={styles.line}>
            {titleWords.map((w) => (
              <motion.span key={w} variants={word} className={styles.heroWord}>
                {w}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p variants={epigraphV} className={`${styles.epigraph} serif`}>
          {"“"}
          {epigraph}
          {"”"}
        </motion.p>

        <motion.a variants={fadeUp} href="#composition" className={styles.cue}>
          Discover the composition
        </motion.a>
      </motion.div>

      <motion.div className={styles.heroStage} style={reduce ? undefined : { y: parallaxY }}>
        {/* silver-blue moon-pool, breathing */}
        <motion.div
          className={styles.heroPool}
          aria-hidden="true"
          animate={reduce ? undefined : { opacity: [0.75, 1], scale: [1, 1.05] }}
          transition={
            reduce
              ? undefined
              : { duration: 9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }
        />
        <div className={styles.heroGlint} aria-hidden="true" />
        <div className={styles.heroGround} aria-hidden="true" />

        {/* bottle: fade in, then a slow idle drift */}
        <motion.div
          className={styles.heroImgWrap}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.2, duration: 1.2, ease: EASE }}
        >
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={
              reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              placeholder="blur"
              blurDataURL={BLUR_BG0}
              sizes="(max-width: 900px) 60vw, 24vw"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
