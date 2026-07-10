import type { CSSProperties } from "react";
import type { Fragrance } from "./schema";

/** Map a fragrance's theme onto the shared chassis' CSS custom properties.
 *  Rendered inline on the server so themed colours are present on first paint.
 *  The film + catalogue CSS is written against --gold / --gold-bright /
 *  --gold-deep, so the per-fragrance accent is injected through those too. */
export function themeToCssVars(t: Fragrance["theme"]): CSSProperties {
  const bright = t.accentBright ?? t.accent;
  const deep = t.accentDeep ?? t.accent;
  const vars: Record<string, string> = {
    "--accent": t.accent,
    "--accent-glow": t.accentGlow,
    "--gold": t.accent,
    "--gold-bright": bright,
    "--gold-deep": deep,
    /* the horizontal "metal" rule, rebuilt from the accent trio
       (accent is validated as 6-digit hex, so hex-alpha suffixes are safe) */
    "--metal-gold-h": `linear-gradient(90deg, ${t.accent}00 0%, ${t.accent}B3 16%, ${bright} 50%, ${deep}B3 84%, ${t.accent}00 100%)`,
  };
  if (t.bg0) vars["--bg-0"] = t.bg0;
  if (t.bg1) vars["--bg-1"] = t.bg1;
  if (t.navy) vars["--navy"] = t.navy;
  return vars as CSSProperties;
}
