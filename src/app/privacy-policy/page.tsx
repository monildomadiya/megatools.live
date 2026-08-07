import type { Metadata } from 'next';
import { ProsePage } from '@/components/layout/ProsePage';
import Content from '@/content/legal/privacy-policy.mdx';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: withBrand('Privacy Policy'),
  description:
    'What MegaTools collects and what it does not. Calculator inputs never leave your device. Full detail on analytics, advertising cookies, GDPR and CCPA rights.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <ProsePage title="Privacy Policy" path="/privacy-policy" updatedAt="2026-08-07">
      <Content />
    </ProsePage>
  );
}
