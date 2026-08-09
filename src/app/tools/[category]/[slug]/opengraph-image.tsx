import { getCategory } from '@/lib/tools/categories';
import { allTools, getTool } from '@/lib/tools/registry';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard, ogSubtitle } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'MegaTools calculator';

// Mirrors the page's own params so every card is generated at build time rather
// than rendered on demand by the droplet the first time a crawler asks for one.
export const dynamicParams = false;

export function generateStaticParams() {
  return allTools.map((tool) => ({ category: tool.category, slug: tool.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const tool = getTool(category, slug);

  // generateStaticParams only ever produces real tools, so this is a type guard
  // rather than a case that can happen.
  if (!tool) {
    return ogCard({
      eyebrow: 'MegaTools',
      title: 'Free online calculators',
      subtitle: 'Every tool shows the formula it uses and where it stops being reliable.',
    });
  }

  return ogCard({
    eyebrow: getCategory(tool.category)?.name ?? 'Calculator',
    title: tool.h1,
    subtitle: ogSubtitle(tool.shortDescription),
    category: tool.category,
  });
}
