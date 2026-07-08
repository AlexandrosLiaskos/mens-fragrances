import type { CSSProperties } from "react";
import type { Fragrance } from "./schema";

/** Map a fragrance's theme onto the shared chassis' CSS custom properties.
 *  Rendered inline on the server so themed colours are present on first paint. */
export function themeToCssVars(t: Fragrance["theme"]): CSSProperties {
  const vars: Record<string, string> = {
    "--accent": t.accent,
    "--accent-glow": t.accentGlow,
  };
  if (t.bg0) vars["--bg-0"] = t.bg0;
  if (t.bg1) vars["--bg-1"] = t.bg1;
  if (t.navy) vars["--navy"] = t.navy;
  return vars as CSSProperties;
}
