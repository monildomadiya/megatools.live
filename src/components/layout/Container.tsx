import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
/** Consistent responsive content width. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mx-auto w-full max-w-7xl px-5 sm:px-8', className)} {...props} />;
}
/** Single page H1 followed by the answer-first summary. */
export function PageHeader({ title, summary, eyebrow }: { title: string; summary: ReactNode; eyebrow?: string }) {
  return <header className="mb-10 max-w-3xl">{eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted">{eyebrow}</p>}<h1 className="text-3xl font-bold tracking-tight text-primary sm:text-5xl">{title}</h1><div className="mt-5 text-lg leading-relaxed text-muted">{summary}</div></header>;
}
