"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export type SceneImage = {
  src: string;
  alt: string;
  posDesktop?: string;
  posMobile?: string;
};

export function Scene({
  image,
  priority = false,
  variant,
  height = "134svh",
  spot = "50% 44%",
  zoom = 1,
  bloom,
  children,
}: {
  image: SceneImage;
  priority?: boolean;
  variant?: "light";
  height?: string;
  spot?: string;
  zoom?: number;
  bloom?: { top: string; left: string; w: string; h: string };
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [zoom, zoom, zoom] : [1.06 * zoom, 1.02 * zoom, 1.06 * zoom]
  );

  const style = {
    height,
    "--pos-d": image.posDesktop ?? "50% 50%",
    "--pos-m": image.posMobile ?? image.posDesktop ?? "50% 50%",
  } as CSSProperties;

  return (
    <section ref={ref} className={`scene ${variant === "light" ? "scene--light" : ""}`} style={style}>
      <motion.div className="scene__img" style={{ y, scale }}>
        <Image src={image.src} alt={image.alt} fill priority={priority} sizes="100vw" />
      </motion.div>
      <div className="scene__grade" />
      {bloom && (
        <div className="scene__bloom" style={{ top: bloom.top, left: bloom.left, width: bloom.w, height: bloom.h }} aria-hidden="true" />
      )}
      <div className="scene__spot" style={{ "--spot": spot } as CSSProperties} />
      <div className="scene__fade" />
      <div className="scene__content">{children}</div>
    </section>
  );
}
