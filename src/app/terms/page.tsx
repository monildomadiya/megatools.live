import type { Metadata } from 'next';
import { ProsePage } from '@/components/layout/ProsePage';
import Content from '@/content/legal/terms.mdx';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: withBrand('Terms of Use'),
  description:
    'The terms that govern use of MegaTools: what you may do with the tools and content, the absence of warranty, and the limitation of liability.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <ProsePage title="Terms of Use" path="/terms" updatedAt="2026-08-07">
      <Content />
    </ProsePage>
  );
}
