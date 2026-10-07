import type { ReactNode } from 'react';
import { Container, PageHeader } from './Container';
import { Breadcrumbs } from './Breadcrumbs';
/** Shared static trust-page structure. */
export function TrustPage({ title, summary, children, path }: { title: string; summary: string; children: ReactNode; path: string }) {
  return <Container className="py-10 sm:py-14"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: title, href: path }]} /><PageHeader title={title} summary={summary} /><div className="prose-content">{children}</div></Container>;
}

