import type { HTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { site } from '@/lib/site';
/** Neutral bordered content panel. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={clsx('rounded-2xl border border-border bg-white p-6', className)} {...props} />; }
/** Compact status label. */
export function Badge({ children }: { children: ReactNode }) { return <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>; }
/** Explanatory notice; color is supplemented by text. */
export function Callout({ children, tone = 'info', title }: { children: ReactNode; tone?: 'info' | 'warning'; title: string }) { return <aside className={clsx('rounded-xl border p-5', tone === 'warning' ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50')}><p className="font-semibold text-primary">{title}</p><div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div></aside>; }
/** Label, primary result and optional supporting text. */
export function StatTile({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) { return <Card><dl><dt className="text-sm text-muted">{label}</dt><dd className="mt-2 text-3xl font-bold tabular-nums text-primary">{value}</dd></dl>{sub && <p className="mt-2 text-sm text-muted">{sub}</p>}</Card>; }
/** Native keyboard-accessible disclosure list; no FAQ schema. */
export function FAQ({ items }: { items: { question: string; answer: ReactNode }[] }) { return <section aria-label="Frequently asked questions"><h2 className="section-title">Frequently asked questions</h2><div className="divide-y divide-border">{items.map((item) => <details key={item.question} className="py-4"><summary className="cursor-pointer font-semibold text-primary">{item.question}</summary><div className="mt-3 leading-relaxed text-muted">{item.answer}</div></details>)}</div></section>; }
/** Contextual internal links to published tools. */
export function RelatedTools({ links }: { links: { title: string; href: string }[] }) { return <section><h2 className="section-title">Related tools</h2><ul className="flex flex-wrap gap-4">{links.map((link) => <li key={link.href}><Link className="text-link" href={link.href}>{link.title}</Link></li>)}</ul></section>; }
/** Exact independence disclaimer shared across pages. */
export function DisclaimerNote() { return <p className="text-sm leading-relaxed text-muted">{site.disclaimer}</p>; }
