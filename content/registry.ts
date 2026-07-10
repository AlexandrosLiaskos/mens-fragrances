import type { FragranceInput } from "@/lib/schema";
import hisConfession from "./fragrances/his-confession";
import diorHommeIntense from "./fragrances/dior-homme-intense";
import khamrah from "./fragrances/khamrah";
import leMaleLeParfum from "./fragrances/le-male-le-parfum";
import erosEdt from "./fragrances/eros-edt";
import bleuDeChanelEdp from "./fragrances/bleu-de-chanel-edp";
import sauvageEdt from "./fragrances/sauvage-edt";
import acquaDiGioProfondo from "./fragrances/acqua-di-gio-profondo";
import aventus from "./fragrances/aventus";

/* One line per fragrance. Add new entries here as they are authored.
 * The order is the display order on the home catalogue: the cabinet's
 * ambers first, then the fresh column, closing on the luxury shelf. */
export const registry: FragranceInput[] = [
  hisConfession,
  diorHommeIntense,
  khamrah,
  leMaleLeParfum,
  erosEdt,
  bleuDeChanelEdp,
  sauvageEdt,
  acquaDiGioProfondo,
  aventus,
];
