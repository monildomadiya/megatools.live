import type { Metadata } from 'next';
import { ProsePage } from '@/components/layout/ProsePage';
import Content from '@/content/legal/cookie-policy.mdx';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: withBrand('Cookie Policy'),
  description:
    'Every cookie that can appear on MegaTools, who sets it, what it does, how long it lasts, and how to turn it off. The site sets none of its own.',
  path: '/cookie-policy',
});

export default function CookiePolicyPage() {
  return (
    <ProsePage title="Cookie Policy" path="/cookie-policy" updatedAt="2026-08-07">
      <Content />
    </ProsePage>
  );
}
