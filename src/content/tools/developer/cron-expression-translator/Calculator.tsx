'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/* ---------------------------------------------------------------------------
   Standard five-field cron, as specified by POSIX and implemented by Vixie
   cron and its descendants. Six-field dialects (Quartz, Spring) and the `L`,
   `W` and `#` extensions are deliberately not parsed — accepting them here
   would mean guessing which scheduler the reader is targeting, and quietly
   misreading a seconds field as minutes is exactly the failure this tool exists
   to prevent.
--------------------------------------------------------------------------- */

const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_LONG = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

interface FieldSpec {
  name: string;
  min: number;
  max: number;
  names?: string[];
  /** Offset applied to a name index to reach its numeric value. */
  nameBase?: number;
}

const FIELDS: FieldSpec[] = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'day of month', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12, names: MONTH_NAMES, nameBase: 1 },
  { name: 'day of week', min: 0, max: 7, names: DAY_NAMES, nameBase: 0 },
];

function parseValue(token: string, spec: FieldSpec): number | null {
  const upper = token.toUpperCase();
  if (spec.names) {
    const index = spec.names.indexOf(upper);
    if (index !== -1) return index + (spec.nameBase ?? 0);
  }
  if (!/^\d+$/.test(token)) return null;
  const value = Number(token);
  if (value < spec.min || value > spec.max) return null;
  return value;
}

/** Expands one field into the sorted set of values it matches. */
function parseField(raw: string, spec: FieldSpec): { values: number[] } | { error: string } {
  const out = new Set<number>();

  for (const part of raw.split(',')) {
    if (part === '') return { error: `Empty entry in the ${spec.name} field` };

    const [rangePart, stepPart] = part.split('/');
    let step = 1;

    if (stepPart !== undefined) {
      if (!/^\d+$/.test(stepPart) || Number(stepPart) < 1) {
        return { error: `"${part}" has an invalid step in the ${spec.name} field` };
      }
      step = Number(stepPart);
    }

    let start: number;
    let end: number;

    if (rangePart === '*' || rangePart === undefined) {
      start = spec.min;
      end = spec.max;
    } else if (rangePart!.includes('-')) {
      const [a, b] = rangePart!.split('-');
      const from = parseValue(a ?? '', spec);
      const to = parseValue(b ?? '', spec);
      if (from === null || to === null) {
        return { error: `"${rangePart}" is not a valid range for the ${spec.name} field` };
      }
      if (from > to) {
        return { error: `Range "${rangePart}" runs backwards in the ${spec.name} field` };
      }
      start = from;
      end = to;
    } else {
      const single = parseValue(rangePart!, spec);
      if (single === null) {
        return {
          error: `"${rangePart}" is not valid for the ${spec.name} field (${spec.min}–${spec.max})`,
        };
      }
      // A bare value with a step means "from here to the end of the range".
      start = single;
      end = stepPart !== undefined ? spec.max : single;
    }

    for (let value = start; value <= end; value += step) out.add(value);
  }

  return { values: [...out].sort((a, b) => a - b) };
}

interface Parsed {
  minutes: number[];
  hours: number[];
  daysOfMonth: number[];
  months: number[];
  /** Normalised so 7 and 0 both mean Sunday. */
  daysOfWeek: number[];
  domRestricted: boolean;
  dowRestricted: boolean;
  raw: string[];
}

function parseCron(expression: string): Parsed | { error: string } {
  const parts = expression.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 6) {
    return {
      error:
        'Six fields found. This parser reads the standard five-field form; Quartz and Spring add a seconds field at the front, so drop it or use a parser for that dialect.',
    };
  }
  if (parts.length !== 5) {
    return { error: `Expected 5 fields, found ${parts.length}.` };
  }

  const results = parts.map((part, index) => parseField(part, FIELDS[index]!));
  const failed = results.find((result) => 'error' in result);
  if (failed && 'error' in failed) return { error: failed.error };

  const [minutes, hours, daysOfMonth, months, daysOfWeek] = results.map((result) =>
    'values' in result ? result.values : [],
  ) as number[][];

  return {
    minutes: minutes!,
    hours: hours!,
    daysOfMonth: daysOfMonth!,
    months: months!,
    daysOfWeek: [...new Set(daysOfWeek!.map((day) => (day === 7 ? 0 : day)))].sort(),
    domRestricted: parts[2] !== '*',
    dowRestricted: parts[4] !== '*',
    raw: parts,
  };
}

/** Joins a list the way a person would say it. */
function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

const pad = (value: number) => String(value).padStart(2, '0');

function describe(parsed: Parsed): string {
  const rawMin = parsed.raw[0] ?? '*';

  let time: string;
  if (parsed.minutes.length === 60 && parsed.hours.length === 24) {
    time = 'Every minute';
  } else if (parsed.minutes.length === 60) {
    time = `Every minute of ${list(parsed.hours.map((h) => `${pad(h)}:00`))}`;
  } else if (rawMin.startsWith('*/') && parsed.hours.length === 24) {
    time = `Every ${rawMin.slice(2)} minutes`;
  } else if (parsed.minutes.length === 1 && parsed.hours.length === 1) {
    time = `At ${pad(parsed.hours[0]!)}:${pad(parsed.minutes[0]!)}`;
  } else if (parsed.hours.length === 24) {
    time = `At ${list(parsed.minutes.map((m) => `${pad(m)} past`))} of every hour`;
  } else if (parsed.minutes.length === 1) {
    time = `At ${list(parsed.hours.map((h) => `${pad(h)}:${pad(parsed.minutes[0]!)}`))}`;
  } else {
    time = `At minute ${list(parsed.minutes.map(String))} of ${list(
      parsed.hours.map((h) => `${pad(h)}:00`),
    )}`;
  }

  const clauses: string[] = [];

  if (parsed.dowRestricted) {
    clauses.push(`on ${list(parsed.daysOfWeek.map((d) => DAY_LONG[d]!))}`);
  }
  if (parsed.domRestricted) {
    clauses.push(`on day ${list(parsed.daysOfMonth.map(String))} of the month`);
  }
  if (parsed.months.length !== 12) {
    clauses.push(`in ${list(parsed.months.map((m) => MONTH_LONG[m - 1]!))}`);
  }

  const joiner =
    parsed.domRestricted && parsed.dowRestricted
      ? `${time}, ${clauses[0]} — or ${clauses.slice(1).join(', ')}`
      : `${time}${clauses.length > 0 ? `, ${clauses.join(', ')}` : ', every day'}`;

  return `${joiner}.`;
}

function nextRuns(parsed: Parsed, from: number, limit = 5): Date[] {
  const runs: Date[] = [];
  const start = new Date(from);
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);

  // Scanning day by day rather than minute by minute: a year of minutes is half
  // a million iterations, a year of days is 365.
  for (let day = 0; day < 1500 && runs.length < limit; day += 1) {
    const month = cursor.getMonth() + 1;
    const dom = cursor.getDate();
    const dow = cursor.getDay();

    const monthOk = parsed.months.includes(month);
    const domOk = parsed.daysOfMonth.includes(dom);
    const dowOk = parsed.daysOfWeek.includes(dow);

    // The rule that trips everyone: when both day fields are restricted they
    // are ORed, not ANDed. Specified behaviour, inherited from Vixie cron.
    const dayOk =
      parsed.domRestricted && parsed.dowRestricted ? domOk || dowOk : domOk && dowOk;

    if (monthOk && dayOk) {
      for (const hour of parsed.hours) {
        for (const minute of parsed.minutes) {
          const candidate = new Date(cursor);
          candidate.setHours(hour, minute, 0, 0);
          if (candidate >= start) {
            runs.push(candidate);
            if (runs.length >= limit) break;
          }
        }
        if (runs.length >= limit) break;
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return runs;
}

const PRESETS = [
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Daily at 02:30', value: '30 2 * * *' },
  { label: 'Weekdays at 09:00', value: '0 9 * * 1-5' },
  { label: 'First of the month', value: '0 0 1 * *' },
  { label: 'The OR trap', value: '0 0 1 * MON' },
];

export default function CronExpressionTranslator() {
  const [expression, setExpression] = useState('30 2 * * 1-5');
  const [now, setNow] = useState<number | null>(null);
  const fieldId = useId();

  // Deferred to an effect rather than read during render: the server has no
  // idea what time it is where the reader is, and computing run times during
  // SSR would produce markup that cannot match the client's.
  useEffect(() => setNow(Date.now()), []);

  const parsed = useMemo(() => parseCron(expression), [expression]);
  const ok = !('error' in parsed);

  const runs = useMemo(
    () => (ok && now !== null ? nextRuns(parsed as Parsed, now) : []),
    [ok, parsed, now],
  );

  const zone =
    typeof Intl !== 'undefined'
      ? (Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'local time')
      : 'local time';

  return (
    <CalculatorPanel label="Expression">
      <div>
        <label htmlFor={fieldId} className="block text-sm font-semibold text-ink-800">
          Cron expression
        </label>
        <input
          id={fieldId}
          type="text"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          placeholder="30 2 * * 1-5"
          className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-4 py-3 text-lg font-bold text-ink-900 transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 sm:px-5 sm:text-xl"
        />
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Five fields: minute, hour, day of month, month, day of week. Names such as MON and
          JAN are accepted.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => setExpression(preset.value)}
            className={`h-9 rounded-lg border px-3 text-sm font-semibold transition-colors ${
              expression === preset.value
                ? 'border-transparent bg-brand-solid text-on-brand'
                : 'border-line text-ink-700 hover:bg-panel-2'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {'error' in parsed ? (
        <p role="alert" className="mt-6 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">
          {parsed.error}
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          <ResultCard label="In plain English" value={describe(parsed)} />

          {parsed.domRestricted && parsed.dowRestricted && (
            <div className="rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              <p className="font-bold">Both day fields are set, so they are ORed</p>
              <p className="mt-1.5">
                This runs on the matching day of the month <em>and also</em> on every
                matching weekday — not only when the two coincide. That is specified
                behaviour rather than a quirk, and it is the most common way a cron schedule
                fires more often than intended.
              </p>
            </div>
          )}

          <ResultRows
            rows={[
              { label: 'Minute', value: parsed.raw[0]! },
              { label: 'Hour', value: parsed.raw[1]! },
              { label: 'Day of month', value: parsed.raw[2]! },
              { label: 'Month', value: parsed.raw[3]! },
              { label: 'Day of week', value: parsed.raw[4]! },
              {
                label: 'Matching times per day',
                value: String(parsed.minutes.length * parsed.hours.length),
              },
            ]}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              Next runs, in {zone}
            </p>
            {now === null ? (
              <p className="rounded-card border border-line bg-panel-2 px-4 py-3 text-sm text-ink-500">
                Working out the schedule…
              </p>
            ) : runs.length > 0 ? (
              <ResultRows
                rows={runs.map((run, index) => ({
                  label: index === 0 ? 'Next run' : `Then`,
                  value: run.toLocaleString('en-GB', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  emphasis: index === 0,
                }))}
              />
            ) : (
              <p className="rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                No run found in the next four years. This is usually an impossible date such
                as 30 February.
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Shown in your browser&rsquo;s time zone. Cron runs in the time zone of the
              machine executing it, which for a server or a managed scheduler is often UTC.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={() => setExpression('30 2 * * 1-5')} />
      </div>
    </CalculatorPanel>
  );
}
