import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFragrances, getFragranceBySlug } from "@/lib/content";
import { themeToCssVars } from "@/lib/theme";
import { Story } from "@/components/story/Story";

export const dynamicParams = false;

export function generateStaticParams() {
  return getFragrances().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = getFragranceBySlug(slug);
  if (!f) return {};
  const hero = f.images.find((i) => i.role === "hero") ?? f.images[0];
  return {
    title: { absolute: `${f.title} — ${f.brand}` },
    description: `${f.subFamily ?? f.family}. ${f.descriptor}.`,
    themeColor: f.theme.bg0 ?? "#0B0D12",
    openGraph: {
      title: `${f.title} — ${f.brand}`,
      description: f.epigraph ?? f.descriptor,
      images: [{ url: hero.src }],
    },
  };
}

export default async function FragrancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = getFragranceBySlug(slug);
  if (!f) notFound();

  return (
    <main style={themeToCssVars(f.theme)} data-metal={f.theme.metal}>
      <Story fragrance={f} />
    </main>
  );
}
