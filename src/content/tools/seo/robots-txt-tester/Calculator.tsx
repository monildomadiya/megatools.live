'use client';

import { useId, useMemo, useState } from 'react';
import { ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

interface Rule {
  allow: boolean;
  pattern: string;
  line: number;
}

interface Group {
  agents: string[];
  rules: Rule[];
}

interface Parsed {
  groups: Group[];
  sitemaps: string[];
  crawlDelay: boolean;
  noindex: boolean;
  unknown: string[];
}

/**
 * Parses a robots.txt into groups, following RFC 9309.
 *
 * Consecutive user-agent lines share the group that follows them, which is the
 * detail most hand-written parsers miss: three user-agent lines and then one
 * disallow is one group covering three crawlers, not three groups.
 */
function parse(source: string): Parsed {
  const groups: Group[] = [];
  const sitemaps: string[] = [];
  const unknown: string[] = [];
  let crawlDelay = false;
  let noindex = false;

  let current: Group | null = null;
  let expectingAgents = false;

  source.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (line === '') return;

    const separator = line.indexOf(':');
    if (separator === -1) {
      unknown.push(`Line ${index + 1}: no colon — "${line}"`);
      return;
    }

    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    switch (key) {
      case 'user-agent': {
        if (current === null || !expectingAgents) {
          current = { agents: [], rules: [] };
          groups.push(current);
          expectingAgents = true;
        }
        current.agents.push(value.toLowerCase());
        return;
      }
      case 'allow':
      case 'disallow': {
        if (current === null) {
          unknown.push(`Line ${index + 1}: a rule before any user-agent line — it applies to nothing`);
          return;
        }
        expectingAgents = false;
        current.rules.push({ allow: key === 'allow', pattern: value, line: index + 1 });
        return;
      }
      case 'sitemap':
        sitemaps.push(value);
        return;
      case 'crawl-delay':
        crawlDelay = true;
        return;
      case 'noindex':
        noindex = true;
        return;
      default:
        unknown.push(`Line ${index + 1}: unrecognised directive "${key}"`);
    }
  });

  return { groups, sitemaps, crawlDelay, noindex, unknown };
}

/**
 * Path pattern → regex. Only two metacharacters exist: `*` for any run of
 * characters and `$` for end-of-URL. Everything else is literal, so it has to
 * be escaped rather than handed to the regex engine as written.
 */
function matches(pattern: string, path: string): boolean {
  if (pattern === '') return false; // An empty disallow grants everything; it never matches.

  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;

  const source = body
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');

  return new RegExp(`^${source}${anchored ? '$' : ''}`).test(path);
}

/** Specificity is the pattern's length, per RFC 9309 §2.2.2. */
const specificity = (pattern: string) => pattern.length;

/**
 * Group selection: the longest user-agent token that the crawler's name starts
 * with, falling back to the `*` group. Length is what breaks the tie, so
 * "googlebot-image" beats "googlebot" for Googlebot-Image.
 */
function selectGroup(groups: Group[], agent: string): { group: Group | null; token: string } {
  const name = agent.trim().toLowerCase();
  let best: { group: Group; token: string } | null = null;

  for (const group of groups) {
    for (const token of group.agents) {
      if (token === '*') continue;
      if (!name.startsWith(token)) continue;
      if (best === null || token.length > best.token.length) best = { group, token };
    }
  }

  if (best !== null) return best;

  const wildcard = groups.find((group) => group.agents.includes('*'));
  return wildcard ? { group: wildcard, token: '*' } : { group: null, token: '' };
}

const DEFAULT_ROBOTS = `User-agent: *
Disallow: /admin/
Disallow: /search
Disallow: /*.pdf$
Allow: /admin/public/

User-agent: Googlebot
Disallow: /no-google/

Sitemap: https://example.com/sitemap.xml`;

export default function RobotsTxtTester() {
  const [source, setSource] = useState(DEFAULT_ROBOTS);
  const [url, setUrl] = useState('/admin/public/brochure.pdf');
  const [agent, setAgent] = useState('Googlebot');

  const sourceId = useId();
  const urlId = useId();
  const agentId = useId();

  const parsed = useMemo(() => parse(source), [source]);

  /** Only the path and query are tested; the rest of a URL is not matched against. */
  const path = useMemo(() => {
    const trimmed = url.trim();
    if (trimmed === '') return '';
    try {
      const absolute = new URL(trimmed);
      return `${absolute.pathname}${absolute.search}`;
    } catch {
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    }
  }, [url]);

  const verdict = useMemo(() => {
    if (path === '') return null;

    const { group, token } = selectGroup(parsed.groups, agent);
    if (group === null) {
      return {
        allowed: true,
        token: '',
        rule: null as Rule | null,
        competing: [] as Rule[],
        reason:
          'No group in this file applies to that user-agent, and there is no * group. Everything is allowed.',
      };
    }

    const candidates = group.rules
      .filter((rule) => matches(rule.pattern, path))
      .sort((a, b) => {
        const difference = specificity(b.pattern) - specificity(a.pattern);
        // Equal specificity: allow wins, which is the standard's tie-break.
        if (difference !== 0) return difference;
        return Number(b.allow) - Number(a.allow);
      });

    const winner = candidates[0] ?? null;

    return {
      allowed: winner === null ? true : winner.allow,
      token,
      rule: winner,
      competing: candidates.slice(1),
      reason:
        winner === null
          ? 'No rule in the matching group matches this path, so it is allowed by default.'
          : `${winner.allow ? 'Allow' : 'Disallow'}: ${winner.pattern} on line ${winner.line} — the longest matching pattern.`,
    };
  }, [parsed, path, agent]);

  const fieldClass =
    'mt-2 w-full rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

  return (
    <CalculatorPanel label="Input · robots.txt">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={sourceId} className="text-sm font-semibold text-ink-800">
          Your robots.txt
        </label>
        <ResetButton
          onClick={() => {
            setSource(DEFAULT_ROBOTS);
            setUrl('/admin/public/brochure.pdf');
            setAgent('Googlebot');
          }}
        />
      </div>
      <textarea
        id={sourceId}
        value={source}
        onChange={(event) => setSource(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={'User-agent: *\nDisallow: /private/'}
        className={`numeric ${fieldClass} resize-y text-sm leading-relaxed`}
      />

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={urlId} className="block text-sm font-semibold text-ink-800">
            URL or path to test
          </label>
          <input
            id={urlId}
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="/some/page?ref=1"
            className={`numeric ${fieldClass} text-sm`}
          />
        </div>
        <div>
          <label htmlFor={agentId} className="block text-sm font-semibold text-ink-800">
            User-agent
          </label>
          <input
            id={agentId}
            type="text"
            value={agent}
            onChange={(event) => setAgent(event.target.value)}
            placeholder="Googlebot"
            className={`${fieldClass} text-sm`}
          />
        </div>
      </div>

      {verdict && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${agent || 'A crawler'} requesting ${path}`}
            value={verdict.allowed ? 'Allowed' : 'Blocked'}
            tone={verdict.allowed ? 'good' : 'bad'}
            verdict={verdict.reason}
          />

          <ResultRows
            rows={[
              {
                label: 'Group matched by user-agent',
                value: verdict.token === '' ? 'none' : verdict.token,
                emphasis: true,
              },
              { label: 'Path tested', value: path },
              {
                label: 'Other rules that also matched',
                value:
                  verdict.competing.length === 0
                    ? 'none'
                    : verdict.competing
                        .map((rule) => `${rule.allow ? 'Allow' : 'Disallow'}: ${rule.pattern}`)
                        .join(' · '),
              },
              {
                label: 'Groups in the file',
                value: String(parsed.groups.length),
              },
              {
                label: 'Sitemaps declared',
                value: parsed.sitemaps.length === 0 ? 'none' : String(parsed.sitemaps.length),
              },
            ]}
          />

          {verdict.token !== '' &&
            verdict.token !== '*' &&
            parsed.groups.some((group) => group.agents.includes('*')) && (
              <p className="rounded-control border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-600">
                A crawler obeys one group only. This file has a group naming{' '}
                {verdict.token}, so that crawler follows it and ignores the{' '}
                <span className="numeric">*</span> group entirely — the two are not merged.
                Any rule in the wildcard group that should also apply to it has to be repeated
                in its own group.
              </p>
            )}

          {parsed.noindex && (
            <p className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">
              This file contains a noindex directive. Google stopped honouring it on 1
              September 2019 and it was never part of the standard, so the line does nothing.
              Use a robots meta tag or an X-Robots-Tag header on the page itself instead —
              which means the page has to stay crawlable.
            </p>
          )}

          {parsed.crawlDelay && (
            <p className="rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              Crawl-delay is not part of the standard. Bing and Yandex have historically
              honoured it; Google ignores it and sets its rate from how your server responds.
            </p>
          )}

          {parsed.unknown.length > 0 && (
            <div className="rounded-card border border-line bg-surface p-5">
              <p className="text-sm font-semibold text-ink-800">Lines that will be ignored</p>
              <ul className="mt-2 space-y-1 text-sm leading-relaxed text-ink-600">
                {parsed.unknown.slice(0, 6).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {!verdict.allowed && (
            <p className="text-sm leading-relaxed text-ink-500">
              Blocked means not crawled. It does not mean removed from the index — a URL
              nobody is allowed to fetch can still be listed, without a description, on the
              strength of links pointing at it.
            </p>
          )}
        </div>
      )}

      {path === '' && (
        <p className="mt-6 text-sm leading-relaxed text-ink-500">
          Enter a path such as /admin/page, or a full URL. Only the path and query are tested
          — the scheme and host are not matched against.
        </p>
      )}
    </CalculatorPanel>
  );
}
