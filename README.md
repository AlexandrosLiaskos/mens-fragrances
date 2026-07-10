# Men's Fragrances

A cinematic, noir men's fragrance house — each scent presented as a short film in the dark.

Built with **Next.js (App Router)**, **React**, **TypeScript**, and **Framer Motion**.

## Experience

- **Home (`/`)** — a dark catalogue: a minimalist gold filter rail (live search,
  faceted checklists, single-select, price range; a hamburger drawer on mobile)
  beside a grid of poster-cards that melt into the black.
- **Fragrance (`/film`)** — the fragrance rendered as a horizontal, film-like
  experience you move sideways through (scroll · arrow keys · swipe · chapter rail),
  with a persistent film HUD.

## Data

Fragrances are **content-as-code**: one typed record per fragrance in
`content/fragrances/`, validated at build time with **Zod** (`lib/schema.ts`).
Adding a scent is a single new file + its imagery. Imagery is served through
`next/image`; display type is self-hosted **Cormorant** + **Geist** via `next/font`.

### Adding a fragrance

```bash
node scripts/new-fragrance.mjs my-slug     # scaffold content file + image dir
```

1. Fill in `content/fragrances/my-slug.ts` — facts (Fragrantica-verified notes,
   accords, perfumers, longevity/sillage), the film copy (epigraph, chapter
   labels, the dark/light scene lines) and the theme accents (hex trio; they
   re-skin every gold element of the chassis for that page).
2. Drop three images into `public/fragrances/my-slug/`:
   - `item.png` — the whole bottle. If the source is a white studio packshot,
     cut it to transparency first: `node scripts/cut-bottle.mjs raw.jpg item.png`
     (use `fit: "contain"` + the printed `ar`). A photo already on black keeps
     `fit: "cover"`, whose edges the reel fades into the page.
   - a dark wide scene and a `daylight` wide scene for the two full-bleed
     chapters: `node scripts/prep-wide.mjs raw.jpg dark.jpg`
   - 2–4 official campaign / poster images (`role: "editorial"` + a tiny
     `caption`) — they become the chapter-IV gallery of hung plates
3. Register it in `content/registry.ts` (one import + one array entry).
   The build statically generates `/my-slug/`; an invalid record fails the build.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Structure

```
app/            routes (home, /film, per-fragrance)
components/     UI (home catalogue, film reel, …)
content/       fragrance data + registry
lib/           schema, data access, theming
public/        optimized imagery
```
