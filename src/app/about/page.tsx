import type { Metadata } from 'next';
import { ProsePage } from '@/components/layout/ProsePage';
import Content from '@/content/legal/about.mdx';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: withBrand('About MegaTools'),
  description:
    'How MegaTools builds its calculators: primary sources, printed formulas, worked examples, and an honest account of where each tool stops being reliable.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <ProsePage
      title="About MegaTools"
      path="/about"
      intro="Free calculators that show the formula, work the example, cite the source, and tell you where the answer stops holding."
    >
      <Content />
    </ProsePage>
  );
}
