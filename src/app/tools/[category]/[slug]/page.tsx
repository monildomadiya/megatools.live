import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolShell } from '@/components/tool/ToolShell';
import { getToolModule } from '@/content/tools/modules';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';
import { allTools, getTool, toolHref } from '@/lib/tools/registry';
import { tocForTool } from '@/lib/tools/toc';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

/**
 * Every tool page is prerendered at build time. There is no dynamic tool data,
 * so `dynamicParams: false` turns any unknown URL into a real 404 rather than an
 * attempted on-demand render — important on a site where a mistyped slug should
 * never produce a soft 404 that Google might index.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return allTools.map((tool) => ({ category: tool.category, slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) return {};

  return buildMetadata({
    title: withBrand(tool.metaTitle),
    description: tool.metaDescription,
    path: toolHref(tool),
    keywords: tool.keywords,
  });
}

export default async function ToolPage({ params }: PageProps) {
  const { category, slug } = await params;
  const tool = getTool(category, slug);
  const module = getToolModule(category, slug);

  // A tool present in the registry but missing from modules.ts is a wiring
  // mistake, not a user-facing 404 — but failing closed is still safer than
  // rendering a page with no calculator on it.
  if (!tool || !module) notFound();

  const { Calculator, Content } = module;

  // Read from the MDX source, which happens at build time only: every tool page
  // is prerendered and `dynamicParams` is false, so no request ever touches the
  // filesystem for this.
  const toc = tocForTool(category, slug);

  return (
    <ToolShell tool={tool} calculator={<Calculator />} toc={toc}>
      <Content />
    </ToolShell>
  );
}
