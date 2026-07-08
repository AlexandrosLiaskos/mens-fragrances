import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const serif = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    { path: "./fonts/cormorant-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-italic-400.woff2", weight: "400", style: "italic" },
  ],
});

const sans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./fonts/geist-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/geist-500.woff2", weight: "500", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Men's Fragrances",
    template: "%s — Men's Fragrances",
  },
  description: "A quiet catalogue of modern men's fragrances.",
  themeColor: "#0B0D12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
