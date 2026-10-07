import Link from 'next/link';
import { getChangelog } from '@/lib/data/changelog';
import { formatDate } from '@/lib/format';
/** Shared newest-first updates feed with an honest prelaunch empty state. */
export function UpdatesList({ limit }: { limit?: number }) {
  const entries = getChangelog().slice(0, limit);
  if (!entries.length) return <p className="text-muted">No rate updates yet. Official datasets will appear here as tools launch.</p>;
  return <ul className="space-y-5">{entries.map((entry) => <li key={`${entry.date}-${entry.title}`}><time dateTime={entry.date} className="text-sm text-muted">{formatDate(entry.date)}</time><h3 className="mt-1 font-semibold text-primary">{entry.url ? <Link href={entry.url} className="text-link">{entry.title}</Link> : entry.title}</h3>{entry.description && <p className="mt-2 text-sm text-muted">{entry.description}</p>}</li>)}</ul>;
}
