import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbList } from '@/lib/seo/jsonld';
import Link from 'next/link';
export type BreadcrumbItem = { label: string; href?: string };
/** Semantic breadcrumb trail; the current page is plain text. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return <><JsonLd data={breadcrumbList(items)} /><nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted"><ol className="flex flex-wrap items-center gap-2">{items.map((item, index) => <li key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <span aria-hidden="true">/</span>}{item.href && index !== items.length - 1 ? <Link href={item.href} className="hover:text-primary hover:underline">{item.label}</Link> : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}</li>)}</ol></nav></>;
}

