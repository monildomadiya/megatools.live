import { allTools } from '@/lib/tools/registry';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'MegaTools — free online calculators that show their work';

// Applies to every route without its own opengraph-image, so the legal and
// about pages inherit this rather than sharing nothing.
export default function Image() {
  return ogCard({
    eyebrow: `${allTools.length} free tools`,
    title: 'Calculators that show their work',
    subtitle:
      'Every tool gives you the formula, a worked example, its sources, and the point where it stops being reliable.',
  });
}
