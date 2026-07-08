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
