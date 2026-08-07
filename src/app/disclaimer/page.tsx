import type { Metadata } from 'next';
import { ProsePage } from '@/components/layout/ProsePage';
import Content from '@/content/legal/disclaimer.mdx';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: withBrand('Disclaimer'),
  description:
    'MegaTools publishes calculators, not advice. What that means for health, financial, and tax results, and when to check with a professional instead.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <ProsePage
      title="Disclaimer"
      path="/disclaimer"
      updatedAt="2026-08-07"
      intro="These are calculators, not advice. On some of these topics that distinction genuinely matters."
    >
      <Content />
    </ProsePage>
  );
}
