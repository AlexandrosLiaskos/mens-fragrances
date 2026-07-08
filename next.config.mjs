/** @type {import('next').NextConfig} */

/* GitHub Pages serves this repo at https://<user>.github.io/mens-fragrances/,
 * so the production build needs the repo name as a basePath. Locally
 * (dev + plain `next build`) PAGES_BASE_PATH is unset, so the site stays at root.
 * The deploy workflow sets PAGES_BASE_PATH=/mens-fragrances. */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig = {
  // emit a fully static site to ./out (no Node server — required for Pages)
  output: "export",
  basePath,
  // dir-index files (/slug/index.html) that Pages serves reliably
  trailingSlash: true,
  // the default next/image optimizer needs a server Pages can't provide
  images: { unoptimized: true },
};

export default nextConfig;
