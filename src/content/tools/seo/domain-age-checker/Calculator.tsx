'use client';

import { useRef, useState } from 'react';
import { ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/* ---------------------------------------------------------------------------
   The only tool on this site that reaches the network.

   A registration date is held by the registry that issued the domain. It is not
   derivable from the page, the DNS records or anything on the reader's machine,
   so there is no local-only version of this tool to build. What is under our
   control is being plain about it: the request fires on an explicit button
   press rather than on keystroke, so a domain typed and thought better of is
   never sent, and the panel says where it goes before you press anything.
--------------------------------------------------------------------------- */

/**
 * RDAP's bootstrap service. Given any domain it redirects to the RDAP server of
 * the registry responsible for that TLD, which saves shipping and maintaining a
 * copy of IANA's bootstrap table.
 *
 * A cross-origin read only works because RFC 7480 §5.6 tells RDAP servers to
 * send `Access-Control-Allow-Origin: *`. Most gTLD registries follow it. Where
 * one does not, the fetch fails at the browser and is reported as a registry
 * that does not answer public queries — which, from the reader's side, is what
 * it amounts to.
 */
const RDAP_BOOTSTRAP = 'https://rdap.org/domain/';

interface RdapEvent {
  eventAction?: string;
  eventDate?: string;
}

interface RdapEntity {
  roles?: string[];
  vcardArray?: unknown;
}

interface RdapDomain {
  ldhName?: string;
  events?: RdapEvent[];
  status?: string[];
  entities?: RdapEntity[];
  nameservers?: { ldhName?: string }[];
}

/**
 * Reduces whatever the reader pasted to the domain RDAP expects.
 *
 * Deliberately conservative: scheme, path, port and a leading `www.` come off,
 * and nothing else. Stripping further would need the Public Suffix List to know
 * that `co.uk` is a suffix but `github.io` is too — several hundred kilobytes of
 * table to avoid one clear error message.
 */
function normaliseDomain(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');
  value = value.replace(/[/?#].*$/, '');
  value = value.replace(/:\d+$/, '');
  value = value.replace(/^www\./, '');
  value = value.replace(/\.$/, '');
  return value;
}

/**
 * Whole years, months and days between two dates.
 *
 * Done by counting whole months first and then measuring the remainder from the
 * resulting anniversary, rather than by subtracting the three fields and
 * borrowing when one goes negative. The borrow version is the one everybody
 * writes and it is wrong at month ends: from 31 January to 1 March, the day
 * field is -30 and borrowing February's 28 leaves it at -2, still negative.
 * Anchoring instead makes the clamp explicit and correct — one month after 31
 * January is 28 or 29 February, which is how calendars behave and how every
 * registrar counts a renewal.
 *
 * Both dates are reduced to UTC midnight first. The registry publishes a
 * timestamp, but an age reported in whole days has no use for the time of day,
 * and dropping it removes the case where an anniversary lands a few hours short
 * and reports one day fewer than it should.
 */
function elapsed(from: Date, to: Date) {
  const fromDay = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const toDay = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());

  const totalDays = Math.round((toDay - fromDay) / 86_400_000);

  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth());
  // The current month is only complete once the day of the month is reached.
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  if (months < 0) months = 0;

  const anchorYear = from.getUTCFullYear() + Math.floor((from.getUTCMonth() + months) / 12);
  const anchorMonth = (from.getUTCMonth() + months) % 12;
  // Day zero of the following month is the last day of this one — the month
  // length, without a lookup table or a leap-year rule.
  const lastDay = new Date(Date.UTC(anchorYear, anchorMonth + 1, 0)).getUTCDate();
  const anchor = Date.UTC(anchorYear, anchorMonth, Math.min(from.getUTCDate(), lastDay));

  const days = Math.round((toDay - anchor) / 86_400_000);

  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: Math.max(days, 0),
    totalDays: Math.max(totalDays, 0),
  };
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function eventDate(events: RdapEvent[] | undefined, action: string): string | undefined {
  return events?.find((event) => event.eventAction === action)?.eventDate;
}

/**
 * The registrar name out of a jCard.
 *
 * jCard is an array-of-arrays encoding of vCard, so the name sits at
 * `vcardArray[1][n][3]` for the entry whose first element is `fn`. It is worth
 * one careful walk rather than a chain of non-null assertions: this comes off
 * the network and any level of it can be missing or a different shape.
 */
function registrarName(entities: RdapEntity[] | undefined): string | undefined {
  const registrar = entities?.find((entity) => entity.roles?.includes('registrar'));
  const card = registrar?.vcardArray;
  if (!Array.isArray(card) || !Array.isArray(card[1])) return undefined;

  for (const field of card[1] as unknown[]) {
    if (Array.isArray(field) && field[0] === 'fn' && typeof field[3] === 'string') {
      return field[3];
    }
  }
  return undefined;
}

interface Report {
  domain: string;
  created?: string;
  expires?: string;
  changed?: string;
  registrar?: string;
  statuses: string[];
  nameservers: number;
}

export default function DomainAgeChecker() {
  const [input, setInput] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // One lookup at a time. Pressing the button again while a slow registry is
  // still answering aborts the first, so an older response can never land on
  // top of a newer one.
  const pending = useRef<AbortController | null>(null);

  async function lookup(event: React.FormEvent) {
    event.preventDefault();

    const domain = normaliseDomain(input);
    if (!domain || !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
      setReport(null);
      setError('Enter a domain such as example.com — no scheme and no path.');
      return;
    }

    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(RDAP_BOOTSTRAP + encodeURIComponent(domain), {
        headers: { Accept: 'application/rdap+json' },
        signal: controller.signal,
      });

      if (response.status === 404) {
        setReport(null);
        setError(
          `No registry record for ${domain}. Either it has never been registered, or its registry does not answer public RDAP queries — several country-code registries do not.`,
        );
        return;
      }
      if (!response.ok) {
        setReport(null);
        setError(`The registry returned an error (HTTP ${response.status}). Try again shortly.`);
        return;
      }

      const data = (await response.json()) as RdapDomain;
      const created = eventDate(data.events, 'registration');

      if (!created) {
        setReport(null);
        setError(
          `${domain} is registered, but its registry does not publish a creation date through RDAP. No tool can show a date the registry withholds.`,
        );
        return;
      }

      setReport({
        domain: data.ldhName ?? domain,
        created,
        expires: eventDate(data.events, 'expiration'),
        changed: eventDate(data.events, 'last changed'),
        registrar: registrarName(data.entities),
        statuses: data.status ?? [],
        nameservers: data.nameservers?.length ?? 0,
      });
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setReport(null);
      setError(
        'The lookup could not reach the registry. That is usually a registry with no public RDAP service, or a network or extension blocking the request.',
      );
    } finally {
      if (pending.current === controller) {
        pending.current = null;
        setLoading(false);
      }
    }
  }

  const createdDate = report?.created ? new Date(report.created) : null;
  const age =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? elapsed(createdDate, new Date())
      : null;

  return (
    <CalculatorPanel label="Domain · registry lookup">
      {/* Stated above the field, not below it and not only in the policy. The
          reader should know what pressing the button does before they press
          it. */}
      <p className="rounded-control border border-line bg-panel-2 px-4 py-3 text-sm leading-relaxed text-ink-600">
        <span className="font-semibold text-ink-800">This tool makes a network request.</span>{' '}
        A registration date lives with the registry, so the domain you enter is sent to{' '}
        <span className="numeric">rdap.org</span> and on to that registry. It does not pass
        through us. Nothing is sent until you press Look up.
      </p>

      <form onSubmit={lookup} className="mt-6">
        <label htmlFor="domain-input" className="block text-sm font-semibold text-ink-800">
          Domain
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="domain-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="example.com"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="numeric w-full rounded-control border border-line bg-panel-2 px-4 py-3 text-lg font-bold text-ink-900 outline-none transition-colors placeholder:font-normal placeholder:text-ink-400 focus:border-brand-500 sm:px-5"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-md shrink-0 disabled:opacity-60"
          >
            {loading ? 'Looking up…' : 'Look up'}
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Best coverage on .com, .net, .org and the newer generic domains. Many
          country-code registries publish nothing over RDAP.
        </p>
      </form>

      {error && (
        <p role="alert" className="mt-5 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">
          {error}
        </p>
      )}

      {report && age && (
        <div className="mt-7">
          <ResultCard
            label={`${report.domain} · first registered`}
            value={
              age.years > 0
                ? `${age.years}y ${age.months}m`
                : age.months > 0
                  ? `${age.months}m ${age.days}d`
                  : `${age.days}d`
            }
            unit="old"
            verdict={report.created ? `Created ${formatDate(report.created)}` : undefined}
          >
            <ResultRows
              rows={[
                {
                  label: 'Exact age',
                  value: `${age.years} years, ${age.months} months, ${age.days} days`,
                  emphasis: true,
                },
                { label: 'Total days', value: age.totalDays.toLocaleString('en-US') },
                {
                  label: 'Registry expiry',
                  value: report.expires ? formatDate(report.expires) : 'Not published',
                },
                {
                  label: 'Record last changed',
                  value: report.changed ? formatDate(report.changed) : 'Not published',
                },
                { label: 'Registrar', value: report.registrar ?? 'Not published' },
                {
                  label: 'Nameservers',
                  value: report.nameservers > 0 ? String(report.nameservers) : 'None listed',
                },
              ]}
            />
            {report.statuses.length > 0 && (
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                <span className="font-semibold text-ink-700">Registry status:</span>{' '}
                {report.statuses.join(', ')}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Dates come from the registry in UTC and are shown as published. If this
              domain lapsed and was registered again, the date above is the most recent
              registration, not the original one.
            </p>
          </ResultCard>
        </div>
      )}
    </CalculatorPanel>
  );
}
