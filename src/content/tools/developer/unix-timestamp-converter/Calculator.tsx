'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResultCard, ResultRows, SelectField } from '@/components/tool/fields';

const CONTROL =
  'mt-2 w-full rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

const LABEL = 'block text-sm font-semibold text-ink-800';

type Unit = 'auto' | 's' | 'ms' | 'us' | 'ns';

const UNITS = [
  { value: 'auto' as const, label: 'Detect from magnitude' },
  { value: 's' as const, label: 'Seconds' },
  { value: 'ms' as const, label: 'Milliseconds' },
  { value: 'us' as const, label: 'Microseconds' },
  { value: 'ns' as const, label: 'Nanoseconds' },
];

const DIVISOR: Record<Exclude<Unit, 'auto'>, number> = {
  s: 1,
  ms: 1e3,
  us: 1e6,
  ns: 1e9,
};

/**
 * Guesses the unit from the magnitude of the value.
 *
 * The bands are wide on purpose. A present-day timestamp is ~1.7e9 in seconds
 * and ~1.7e12 in milliseconds, three orders of magnitude apart, so anything
 * between those extremes still lands in the right bucket for any date from the
 * 1970s to the far future. Detection is shown in the output rather than applied
 * silently, because a 1970 date is the classic symptom of it guessing wrong.
 */
function detectUnit(value: number): Exclude<Unit, 'auto'> {
  const magnitude = Math.abs(value);
  if (magnitude >= 1e17) return 'ns';
  if (magnitude >= 1e14) return 'us';
  if (magnitude >= 1e11) return 'ms';
  return 's';
}

const UNIT_NAMES: Record<Exclude<Unit, 'auto'>, string> = {
  s: 'seconds',
  ms: 'milliseconds',
  us: 'microseconds',
  ns: 'nanoseconds',
};

function pad(value: number, width = 2): string {
  return String(Math.abs(value)).padStart(width, '0');
}

/** RFC 3339 in UTC. Built by hand so the output is exact rather than locale-dependent. */
function toRfc3339Utc(date: Date): string {
  const year = date.getUTCFullYear();
  const prefix = year < 0 ? '-' : '';
  return (
    `${prefix}${pad(year, 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}Z`
  );
}

/** Local offset as "+01:00", the form RFC 3339 wants. */
function offsetLabel(date: Date): string {
  const minutes = -date.getTimezoneOffset();
  const sign = minutes < 0 ? '-' : '+';
  return `${sign}${pad(Math.floor(Math.abs(minutes) / 60))}:${pad(Math.abs(minutes) % 60)}`;
}

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000_000],
  ['month', 2_592_000_000],
  ['week', 604_800_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
  ['second', 1000],
];

function relativeTo(ms: number, nowMs: number): string {
  const diff = ms - nowMs;
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(diff) >= size) {
      return formatter.format(Math.round(diff / size), unit);
    }
  }
  return 'just now';
}

/** "2026-08-10T14:30" as produced by datetime-local, read in the chosen frame. */
function fromLocalInput(value: string, asUtc: boolean): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = match[6] ? Number(match[6]) : 0;

  const date = asUtc
    ? new Date(Date.UTC(year, month - 1, day, hour, minute, second))
    : new Date(year, month - 1, day, hour, minute, second);

  return Number.isNaN(date.getTime()) ? null : date;
}

export default function UnixTimestampConverter() {
  const [raw, setRaw] = useState('');
  const [unit, setUnit] = useState<Unit>('auto');
  const [dateInput, setDateInput] = useState('');
  const [frame, setFrame] = useState<'local' | 'utc'>('local');
  // Null until mounted: reading the clock during render would produce different
  // markup on the server and in the browser, and React would discard the tree.
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [zone, setZone] = useState('UTC');

  useEffect(() => {
    setNowMs(Date.now());
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parsed = useMemo(() => {
    const trimmed = raw.replace(/[_,\s]/g, '');
    if (trimmed === '') return null;
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return null;

    const value = Number(trimmed);
    if (!Number.isFinite(value)) return null;

    const resolved = unit === 'auto' ? detectUnit(value) : unit;
    const ms = (value / DIVISOR[resolved]) * 1000;

    // Beyond ±8.64e15 ms the ECMAScript Date range ends and every method
    // returns NaN, which would otherwise render as "Invalid Date" everywhere.
    if (!Number.isFinite(ms) || Math.abs(ms) > 8.64e15) return null;

    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return null;

    return { value, resolved, ms, date };
  }, [raw, unit]);

  const reverse = useMemo(() => {
    const date = fromLocalInput(dateInput, frame === 'utc');
    if (!date) return null;
    return {
      date,
      seconds: Math.floor(date.getTime() / 1000),
      millis: date.getTime(),
    };
  }, [dateInput, frame]);

  function useNow() {
    const ms = Date.now();
    setUnit('s');
    setRaw(String(Math.floor(ms / 1000)));
  }

  return (
    <CalculatorPanel label="Timestamp · both directions">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label htmlFor="timestamp" className={LABEL}>
            Unix timestamp
          </label>
          <button type="button" onClick={useNow} className="btn btn-outline btn-sm">
            Use current time
          </button>
        </div>
        <input
          id="timestamp"
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          inputMode="numeric"
          spellCheck={false}
          autoComplete="off"
          placeholder="1770000000"
          className={`numeric ${CONTROL}`}
        />
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Underscores, commas and spaces are ignored, so a value copied out of a log or a
          code literal can be pasted as-is.
        </p>
      </div>

      <div className="mt-5">
        <SelectField label="Unit" value={unit} onChange={setUnit} options={UNITS} />
      </div>

      {raw.trim() !== '' && parsed === null && (
        <p role="alert" className="mt-5 text-sm text-red-600">
          That is not a timestamp this tool can read. Enter an integer — optionally
          negative for dates before 1970 — within the range of a representable date.
        </p>
      )}

      {parsed && (
        <div className="mt-6 space-y-4">
          <ResultCard
            label={`Read as ${UNIT_NAMES[parsed.resolved]}${unit === 'auto' ? ' (detected)' : ''}`}
            value={toRfc3339Utc(parsed.date)}
            verdict={
              nowMs === null ? undefined : `${relativeTo(parsed.ms, nowMs)} · ${zone} shown below`
            }
          />

          <ResultRows
            rows={[
              {
                label: 'UTC',
                value: parsed.date.toLocaleString('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'medium',
                  timeZone: 'UTC',
                }),
                emphasis: true,
              },
              {
                label: `Local (${zone})`,
                value: parsed.date.toLocaleString('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'medium',
                }),
              },
              { label: 'ISO 8601 / RFC 3339', value: toRfc3339Utc(parsed.date) },
              { label: 'Local UTC offset', value: offsetLabel(parsed.date) },
              { label: 'Seconds', value: String(Math.floor(parsed.ms / 1000)) },
              { label: 'Milliseconds', value: String(Math.round(parsed.ms)) },
              { label: 'Day of week', value: parsed.date.toLocaleDateString('en-GB', { weekday: 'long' }) },
              {
                label: 'Day of year',
                value: String(
                  Math.floor(
                    (Date.UTC(parsed.date.getUTCFullYear(), parsed.date.getUTCMonth(), parsed.date.getUTCDate()) -
                      Date.UTC(parsed.date.getUTCFullYear(), 0, 0)) /
                      86_400_000,
                  ),
                ),
              },
            ]}
          />
        </div>
      )}

      <hr className="my-8 border-line" />

      <div>
        <label htmlFor="datetime" className={LABEL}>
          Date and time to timestamp
        </label>
        <input
          id="datetime"
          type="datetime-local"
          step={1}
          value={dateInput}
          onChange={(event) => setDateInput(event.target.value)}
          className={`numeric ${CONTROL}`}
        />
      </div>

      <div className="mt-5">
        <SelectField
          label="Interpret the entered time as"
          value={frame}
          onChange={setFrame}
          options={[
            { value: 'local', label: `Local time (${zone})` },
            { value: 'utc', label: 'UTC' },
          ]}
          hint="The same wall-clock reading is a different instant in each frame, which is where most off-by-hours bugs come from."
        />
      </div>

      {reverse && (
        <div className="mt-6">
          <ResultRows
            rows={[
              { label: 'Unix seconds', value: String(reverse.seconds), emphasis: true },
              { label: 'Milliseconds', value: String(reverse.millis) },
              { label: 'RFC 3339 (UTC)', value: toRfc3339Utc(reverse.date) },
              {
                label: 'UTC',
                value: reverse.date.toLocaleString('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'medium',
                  timeZone: 'UTC',
                }),
              },
            ]}
          />
        </div>
      )}

      <p className="mt-6 text-sm leading-relaxed text-ink-500">
        Everything here runs in your browser — nothing is sent to a server. Conversions
        follow the POSIX definition, under which every day is exactly 86,400 seconds, so
        leap seconds are not represented.
      </p>
    </CalculatorPanel>
  );
}
