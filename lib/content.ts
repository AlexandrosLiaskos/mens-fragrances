import "server-only";
import { cache } from "react";
import { FragranceSchema, type Fragrance } from "./schema";
import { registry } from "@/content/registry";

/** Validate every entry at build time. An invalid fragrance fails the build. */
export const getFragrances = cache((): Fragrance[] =>
  registry.map((raw, i) => {
    const parsed = FragranceSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `Invalid fragrance at registry index ${i}: ${parsed.error.message}`
      );
    }
    return parsed.data;
  })
);

export const getFragranceBySlug = cache((slug: string): Fragrance | undefined =>
  getFragrances().find((f) => f.slug === slug)
);
