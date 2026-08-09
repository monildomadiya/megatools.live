import { categories, getCategory } from '@/lib/tools/categories';
import { countToolsByCategory } from '@/lib/tools/registry';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard, ogSubtitle } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'MegaTools category';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = getCategory(category);

  if (!found) {
    return ogCard({
      eyebrow: 'MegaTools',
      title: 'Free online calculators',
      subtitle: 'Every tool shows the formula it uses and where it stops being reliable.',
    });
  }

  const count = countToolsByCategory(found.slug);

  return ogCard({
    eyebrow: `${count} ${count === 1 ? 'tool' : 'tools'}`,
    title: found.h1,
    subtitle: ogSubtitle(found.metaDescription),
    category: found.slug,
  });
}
