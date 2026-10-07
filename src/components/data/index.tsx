import { formatDate } from '@/lib/format';
/** Dataset retrieval date, never the current build date. */
export function UpdatedBadge({ lastUpdated }: { lastUpdated: string }) { return <span className="text-sm text-muted">Last updated: <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time></span>; }
/** Dataset provenance displayed alongside every rate table or calculator. */
export function SourcesBox({ sources, effectiveFrom, effectiveTo, lastUpdated }: { sources: { url: string; title: string }[]; effectiveFrom?: string; effectiveTo?: string; lastUpdated: string }) { return <aside className="rounded-xl border border-border bg-slate-50 p-6"><h2 className="text-lg font-semibold text-primary">Sources & dates</h2><ul className="my-3 space-y-2">{sources.map((source) => <li key={source.url}><a href={source.url} className="text-link break-all">{source.title}</a></li>)}</ul>{effectiveFrom&&<p className="mb-2 text-sm text-muted">Effective from: <time dateTime={effectiveFrom}>{formatDate(effectiveFrom)}</time>{effectiveTo&&<> through <time dateTime={effectiveTo}>{formatDate(effectiveTo)}</time></>}</p>}<UpdatedBadge lastUpdated={lastUpdated} /></aside>; }



