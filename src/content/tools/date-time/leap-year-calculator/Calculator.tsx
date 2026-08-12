'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/**
 * The Gregorian rule, written as the three clauses it actually has rather than
 * as one boolean expression, so the panel can say which clause decided the
 * answer. "1900 was not a leap year" surprises people, and the useful reply is
 * the reason rather than the verdict.
 */
function leapReason(year: number): { leap: boolean; rule: string } {
  if (year % 4 !== 0) {
    return { leap: false, rule: 'Not divisible by 4 — an ordinary common year.' };
  }
  if (year % 100 !== 0) {
    return { leap: true, rule: 'Divisible by 4 and not by 100 — the usual leap year.' };
  }
  if (year % 400 !== 0) {
    return {
      leap: false,
      rule: 'A century year not divisible by 400 — the exception that skips the leap day.',
    };
  }
  return {
    leap: true,
    rule: 'A century year divisible by 400 — the exception to the exception.',
  };
}

/** Leap years in [from, to] inclusive, by counting multiples rather than looping. */
function leapsUpTo(year: number): number {
  return Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
}

function weekdayOfFeb29(year: number): string {
  // Built through setUTCFullYear rather than Date.UTC, which maps years 0-99
  // onto 1900-1999 and would answer for the wrong millennium.
  const date = new Date(Date.UTC(2000, 1, 29));
  date.setUTCFullYear(year);
  return date.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
}

function nextLeap(year: number, direction: 1 | -1): number {
  let candidate = year + direction;
  while (!leapReason(candidate).leap) candidate += direction;
  return candidate;
}

type Mode = 'check' | 'range';

export default function LeapYearCalculator() {
  const [mode, setMode] = useState<Mode>('check');
  const [year, setYear] = useState('2026');
  const [from, setFrom] = useState('2000');
  const [to, setTo] = useState('2050');

  const single = useMemo(() => {
    if (mode !== 'check') return null;
    const value = Number(year);
    if (!Number.isInteger(value) || value < 1 || value > 9999) return null;

    const { leap, rule } = leapReason(value);
    return {
      value,
      leap,
      rule,
      days: leap ? 366 : 365,
      weekday: leap ? weekdayOfFeb29(value) : null,
      next: nextLeap(value, 1),
      previous: value > 1 ? nextLeap(value, -1) : null,
      // Anything before the 1582 reform is proleptic: the rule is applied to
      // years that were still being counted the Julian way at the time.
      proleptic: value < 1583,
    };
  }, [mode, year]);

  const range = useMemo(() => {
    if (mode !== 'range') return null;
    const start = Number(from);
    const end = Number(to);
    if (!Number.isInteger(start) || !Number.isInteger(end)) return null;
    if (start < 1 || end > 9999 || end < start) return null;

    const count = leapsUpTo(end) - leapsUpTo(start - 1);
    const years = end - start + 1;

    return {
      start,
      end,
      count,
      years,
      days: years * 365 + count,
      skipped: Array.from({ length: Math.min(end - start + 1, 4000) }, (_, index) => start + index)
        .filter((candidate) => candidate % 100 === 0 && candidate % 400 !== 0),
    };
  }, [mode, from, to]);

  function reset() {
    setMode('check');
    setYear('2026');
    setFrom('2000');
    setTo('2050');
  }

  return (
    <CalculatorPanel>
      <div className="mb-5">
        <UnitToggle
          label="What to work out"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'check', label: 'Check a year' },
            { value: 'range', label: 'Count in a range' },
          ]}
        />
      </div>

      {mode === 'check' ? (
        <NumberField
          label="Year"
          value={year}
          onChange={setYear}
          step={1}
          min={1}
          max={9999}
          inputMode="numeric"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="From year"
            value={from}
            onChange={setFrom}
            step={1}
            inputMode="numeric"
          />
          <NumberField
            label="To year"
            value={to}
            onChange={setTo}
            step={1}
            inputMode="numeric"
            hint="Inclusive at both ends."
          />
        </div>
      )}

      {single && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`Is ${single.value} a leap year?`}
            value={single.leap ? 'Yes' : 'No'}
            tone={single.leap ? 'good' : 'neutral'}
            verdict={single.rule}
          />

          <ResultRows
            rows={[
              { label: 'Days in the year', value: String(single.days), emphasis: true },
              {
                label: '29 February falls on',
                value: single.weekday ?? 'there is no 29 February',
              },
              { label: 'Next leap year', value: String(single.next) },
              {
                label: 'Previous leap year',
                value: single.previous === null ? '—' : String(single.previous),
              },
              {
                label: 'Leap years so far this century',
                value: String(
                  leapsUpTo(single.value) - leapsUpTo(Math.floor((single.value - 1) / 100) * 100),
                ),
              },
            ]}
          />

          {single.value % 100 === 0 && (
            <p className="rounded-control border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-600">
              Century years are where the rule earns its keep. {single.value} is divisible by
              100, so the four-year rule alone would have made it a leap year;{' '}
              {single.value % 400 === 0
                ? 'being divisible by 400 as well restores it.'
                : 'not being divisible by 400 takes it away.'}
            </p>
          )}

          {single.proleptic && (
            <p className="rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              The Gregorian calendar was introduced in 1582, so this answer is proleptic — the
              modern rule applied backwards to a year that was counted the Julian way at the
              time. Under the Julian rule, every fourth year was a leap year with no century
              exceptions.
            </p>
          )}
        </div>
      )}

      {range && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`Leap years from ${range.start} to ${range.end}`}
            value={String(range.count)}
            unit={range.count === 1 ? 'leap year' : 'leap years'}
            verdict={`${range.years} calendar years · ${range.days.toLocaleString('en-US')} days in total`}
          />
          <ResultRows
            rows={[
              { label: 'Leap years', value: String(range.count), emphasis: true },
              { label: 'Common years', value: String(range.years - range.count) },
              { label: 'Total days', value: range.days.toLocaleString('en-US') },
              {
                label: 'Century years skipped',
                value:
                  range.skipped.length === 0
                    ? 'none in this range'
                    : range.skipped.join(', '),
              },
            ]}
          />
        </div>
      )}

      {mode === 'range' && range === null && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter two whole years between 1 and 9999, with the second not before the first.
        </p>
      )}

      {mode === 'check' && single === null && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a whole year between 1 and 9999.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
