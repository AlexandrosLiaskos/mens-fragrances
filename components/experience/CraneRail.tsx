"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
  type MotionStyle,
} from "framer-motion";
import styles from "./experience.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

export type CraneRailProps = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  sub: string;
  top: string[];
  heart: string[];
  base: string[];
  signature: string[];
};

type BeatContent = {
  roman: string;
  label: string;
  notes: string[];
  signature?: string[];
};

/* ---------- shared helpers ---------- */

function isSignature(note: string, signature: string[]): boolean {
  return signature.some((s) => s.toLowerCase() === note.toLowerCase());
}

function NoteList({
  notes,
  signature = [],
}: {
  notes: string[];
  signature?: string[];
}) {
  return (
    <>
      {notes.map((note, i) => (
        <span key={note}>
          {i > 0 && <span className={styles.sep}>·</span>}
          {isSignature(note, signature) ? (
            <span className={styles.sigNote}>{note}</span>
          ) : (
            note
          )}
        </span>
      ))}
    </>
  );
}

/* the hero cold-open + beat copy markup, reused by both the
   animated and reduced-motion trees so wording never drifts */
function HeroCopy({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.sub}>{sub}</p>
    </div>
  );
}

function BeatCopy({ beat }: { beat: BeatContent }) {
  return (
    <div className={styles.beat}>
      <span className={styles.beatRoman}>{beat.roman}</span>
      <h2 className={styles.beatLabel}>{beat.label}</h2>
      <p className={styles.beatNotes}>
        <NoteList notes={beat.notes} signature={beat.signature} />
      </p>
      {beat.signature && beat.signature.length > 0 && (
        <span className={styles.sigTag}>signature · {beat.signature[0]}</span>
      )}
    </div>
  );
}

/* ---------- animated macro beat ---------- */

function MacroBeat({
  progress,
  range,
  beat,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  beat: BeatContent;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [18, 0, 0, -12]);
  return (
    <motion.div className={styles.layer} style={{ opacity, y }}>
      <BeatCopy beat={beat} />
    </motion.div>
  );
}

/* ============================================================
   MOTION CRANE — sticky scroll-driven camera
   ============================================================ */
function MotionCrane(props: CraneRailProps & { beats: BeatContent[] }) {
  const { src, alt, eyebrow, title, sub, beats } = props;
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // glide, not step
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30 });

  // crane camera: a gentle descent down the sculpture (minimal zoom)
  const scale = useTransform(smooth, [0, 1], [1.0, 1.1]);
  const posY = useTransform(smooth, [0, 0.5, 1], [8, 42, 92]);
  const objectPosition = useMotionTemplate`50% ${posY}%`;

  const imageLayerStyle = {
    scale,
    "--crane-pos": objectPosition,
  } as unknown as MotionStyle;

  // the single, brief, cool-gold collar sweep (beat II window only)
  const sweepOpacity = useTransform(smooth, [0.4, 0.5, 0.64], [0, 0.85, 0]);
  const sweepX = useTransform(smooth, [0.4, 0.64], [-140, 200]);

  // cool key light eases up slightly across the crane
  const keyOpacity = useTransform(smooth, [0, 1], [0.6, 1]);

  // hero + cue fade as the crane engages (use raw progress for snap)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.06, 0.1], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -20]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.02, 0.05], [1, 1, 0]);

  return (
    <div ref={trackRef} className={styles.track}>
      <div className={styles.stage}>
        <motion.div
          className={styles.keyLight}
          style={{ opacity: keyOpacity }}
          aria-hidden="true"
        />

        <div className={styles.imageCol}>
          <motion.div
            className={styles.imageMount}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <motion.div className={styles.imageLayer} style={imageLayerStyle}>
              <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes="(max-width: 860px) 64vw, 46vw"
                className={styles.imgEl}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.sweep}
            style={{ opacity: sweepOpacity, x: sweepX }}
            aria-hidden="true"
          />
        </div>

        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.copy}>
          <motion.div
            className={styles.layer}
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <HeroCopy eyebrow={eyebrow} title={title} sub={sub} />
          </motion.div>

          <MacroBeat progress={smooth} range={[0.06, 0.18, 0.3, 0.38]} beat={beats[0]} />
          <MacroBeat progress={smooth} range={[0.4, 0.5, 0.62, 0.7]} beat={beats[1]} />
          <MacroBeat progress={smooth} range={[0.72, 0.86, 1.05, 1.2]} beat={beats[2]} />
        </div>

        <motion.div className={styles.cue} style={{ opacity: cueOpacity }}>
          <span className={styles.cueTick} aria-hidden="true" />
          scroll
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   STATIC CRANE — reduced-motion baseline (built first, always safe)
   Three stacked crops of the one sculpture, each with its copy.
   ============================================================ */
function StaticCrane(props: CraneRailProps & { beats: BeatContent[] }) {
  const { src, alt, eyebrow, title, sub, beats } = props;
  // eyes / collar / plinth — matched to the animated crane stops
  const crops = ["50% 8%", "50% 42%", "50% 88%"];

  return (
    <div className={styles.static}>
      <section className={styles.staticHero}>
        <div className={styles.layer}>
          <HeroCopy eyebrow={eyebrow} title={title} sub={sub} />
        </div>
        <div className={styles.staticHeroFrame}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 860px) 90vw, 46vw"
            style={{ objectFit: "cover", objectPosition: "50% 18%" }}
          />
        </div>
      </section>

      {beats.map((beat, i) => (
        <section className={styles.staticBlock} key={beat.roman}>
          <div className={styles.staticCopy}>
            <BeatCopy beat={beat} />
          </div>
          <div className={styles.staticFrame}>
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 860px) 90vw, 46vw"
              style={{
                objectFit: "cover",
                objectPosition: crops[i],
                transform: "scale(1.2)",
              }}
            />
          </div>
        </section>
      ))}
    </div>
  );
}

/* ============================================================
   PUBLIC COMPONENT
   ============================================================ */
export default function CraneRail(props: CraneRailProps) {
  const reduce = useReducedMotion();

  const beats: BeatContent[] = [
    { roman: "I", label: "The Blindfold", notes: props.top },
    { roman: "II", label: "The Collar", notes: props.heart },
    {
      roman: "III",
      label: "The Confession",
      notes: props.base,
      signature: props.signature,
    },
  ];

  return reduce ? (
    <StaticCrane {...props} beats={beats} />
  ) : (
    <MotionCrane {...props} beats={beats} />
  );
}
