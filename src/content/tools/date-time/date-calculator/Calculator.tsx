'use client';

import { useEffect, useMemo, useState } from 'react';
import { DateField, NumberField, ResetButton, ResultCard, ResultRows, SelectField, UnitToggle } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

const DIRECTIONS = [
  { value: 'add', label: 'Add' },
  { value: 'subtract', label: 'Subtract' },
] as const;

type Direction = (typeof DIRECTIONS)[number]['value'];

const UNITS = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
] as const;

type Unit = (typeof UNITS)[number]['value'];

/** Today, as `YYYY-MM-DD` in the reader's own timezone. */
function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * Everything runs on a UTC midnight timestamp rather than a local Date.
 *
 * A local Date carries a time of day, and a time of day is what lets a daylight
 * saving transition move a result across midnight — add one day to the Saturday
 * before a spring-forward and a local calculation can land you back on the same
 * date. Calendar arithmetic has no business knowing about clocks, so the clock
 * is removed before any of it starts.
 */
function parseIso(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Days in a given month, from day zero of the month after it. */
function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

interface Shift {
  result: Date;
  /** True when the target month was too short to hold the original day. */
  clamped: boolean;
}

function shift(from: Date, amount: number, unit: Unit): Shift {
  if (unit === 'days' || unit === 'weeks') {
    const days = unit === 'weeks' ? amount * 7 : amount;
    return { result: new Date(from.getTime() + days * 86_400_000), clamped: false };
  }

  const months = unit === 'years' ? amount * 12 : amount;
  const target = from.getUTCMonth() + months;
  const year = from.getUTCFullYear() + Math.floor(target / 12);
  // `%` keeps the sign of the dividend in JavaScript, so a subtraction that
  // crosses January would give a negative month index. The extra +12 and second
  // modulo normalise it back into 0-11 without a branch.
  const month = ((target % 12) + 12) % 12;

  const wanted = from.getUTCDate();
  const available = daysInMonth(year, month);
  const day = Math.min(wanted, available);

  return { result: new Date(Date.UTC(year, month, day)), clamped: day !== wanted };
}

const WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });
const LONG_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export default function DateCalculator() {
  // Empty until mounted. Seeding this with today's date during render would put
  // the server's date in the HTML and the reader's in the hydrated tree, which
  // is a hydration mismatch on every visitor whose day differs from UTC.
  const [start, setStart] = useState('');
  const [direction, setDirection] = useState<Direction>('add');
  const [amount, setAmount] = useState('90');
  const [unit, setUnit] = useState<Unit>('days');

  useEffect(() => {
    setStart(todayIso());
  }, []);

  const startDate = parseIso(start);
  const parsedAmount = Number(amount);

  // The empty-amount case is rejected here rather than in a separate boolean.
  // A `const valid = startDate !== null && …` flag reads as a guard but is only
  // a boolean, and TypeScript will not narrow `startDate` from it — which is
  // exactly the mistake that broke the build. Returning null from here means
  // the one check in the JSX narrows both values at once.
  const outcome = useMemo(() => {
    if (!startDate || amount.trim() === '' || !Number.isFinite(parsedAmount)) return null;
    const signed = direction === 'subtract' ? -parsedAmount : parsedAmount;
    return shift(startDate, Math.trunc(signed), unit);
  }, [amount, direction, parsedAmount, startDate, unit]);

  function reset() {
    setStart(todayIso());
    setDirection('add');
    setAmount('90');
    setUnit('days');
  }

  const elapsedDays =
    outcome && startDate
      ? Math.round((outcome.result.getTime() - startDate.getTime()) / 86_400_000)
      : 0;

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Direction"
          value={direction}
          onChange={setDirection}
          options={DIRECTIONS}
        />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <DateField
          label="Start date"
          value={start}
          onChange={setStart}
          hint="Defaults to today."
        />
        <NumberField
          label="Amount"
          value={amount}
          onChange={setAmount}
          inputMode="numeric"
          placeholder="90"
          error={amount.trim() !== '' && !Number.isFinite(parsedAmount) ? 'Enter a number.' : undefined}
        />
        <SelectField label="Unit" value={unit} onChange={setUnit} options={UNITS} />
      </div>

      {startDate && outcome && (
        <div className="mt-7">
          <ResultCard
            label={`${direction === 'add' ? 'Add' : 'Subtract'} ${Math.abs(Math.trunc(parsedAmount))} ${unit}`}
            value={LONG_DATE.format(outcome.result)}
            verdict={WEEKDAY.format(outcome.result)}
          >
            <ResultRows
              rows={[
                {
                  label: 'ISO 8601 format',
                  value: outcome.result.toISOString().slice(0, 10),
                  emphasis: true,
                },
                { label: 'Started from', value: LONG_DATE.format(startDate) },
                {
                  label: 'Calendar days apart',
                  value: Math.abs(elapsedDays).toLocaleString('en-US'),
                },
                {
                  label: 'Falls on a weekend',
                  value: [0, 6].includes(outcome.result.getUTCDay()) ? 'Yes' : 'No',
                },
              ]}
            />

            {outcome.clamped && (
              <p className="mt-4 rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                The target month is too short to hold day {startDate.getUTCDate()}, so the
                result has been clamped to the last day of the month. This is the
                convention almost every calendar and contract uses, and it is explained
                below.
              </p>
            )}

            {[0, 6].includes(outcome.result.getUTCDay()) && (
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                This lands on a weekend. Many contracts and court rules roll a deadline
                forward to the next working day — check which applies before treating this
                as the date.
              </p>
            )}
          </ResultCard>
        </div>
      )}
    </CalculatorPanel>
  );
}
