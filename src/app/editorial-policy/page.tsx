import type { Metadata } from 'next';
import { ProsePage } from '@/components/layout/ProsePage';
import Content from '@/content/legal/editorial-policy.mdx';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: withBrand('Editorial Policy'),
  description:
    'How MegaTools sources formulas, chooses between competing equations, checks arithmetic, dates its updates, and handles corrections.',
  path: '/editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <ProsePage
      title="Editorial Policy"
      path="/editorial-policy"
      updatedAt="2026-08-07"
      intro="How content here is researched, written, checked, and corrected."
    >
      <Content />
    </ProsePage>
  );
}
