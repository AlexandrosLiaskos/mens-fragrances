import Link from "next/link";
import styles from "./experience.module.css";

export type Spec = { label: string; value: string };

export default function AcquireFooter({
  specs,
  ctaLabel,
  ctaHref,
  whisper,
  credit,
}: {
  specs: Spec[];
  ctaLabel: string;
  ctaHref: string;
  whisper: string;
  credit: string;
}) {
  return (
    <section className={styles.acquire}>
      <div className={styles.acquireInner}>
        <div className={styles.specRow}>
          {specs.map((s) => (
            <div className={styles.specCell} key={s.label}>
              <div className={styles.specLabel}>{s.label}</div>
              <div className={styles.specVal}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <Link href={ctaHref} className={styles.cta}>
            {ctaLabel}
          </Link>
        </div>

        <div className={styles.foot}>
          <span className={styles.folio} aria-hidden="true" />
          <p className={styles.footWhisper}>{whisper}</p>
          <p className={styles.footCredit}>{credit}</p>
        </div>
      </div>
    </section>
  );
}
