/* Shared, framework-agnostic constants for the /noir route.
 * No "use client" — safe to import from both server and client components.
 * Dark blur placeholders prevent any white flash on image load (a white
 * flash would break the noir). Colours match --bg-0 / --bg-sink. */

export const BLUR_BG0 =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjI4Ij48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMEIwRDEyIi8+PC9zdmc+";

export const BLUR_SINK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjEyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDYwNzBBIi8+PC9zdmc+";

/** Base directory for this fragrance's imagery. */
export const IMG = "/fragrances/his-confession";

export type ReelFrame = {
  src: string;
  alt: string;
  caption: string;
  /** intrinsic aspect ratio (w / h) so the frame reserves correct space */
  ar: number;
};
