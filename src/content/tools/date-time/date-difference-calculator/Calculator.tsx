'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { DateField, ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const FIELD =
  'mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

const DAY_MS = 86_400_000;

/**
 * All arithmetic runs in UTC, for the same reason the age calculator does: a
 * span crossing a daylight saving boundary is 23 or 25 hours long, which is
 * enough to push a division over a day boundary and report the wrong count.
 * Parsing to UTC midnight removes the clock from a whole-date question.
 */
function toUtc(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function addMonths(date: Date, months: number): Date {
  const index = date.getUTCMonth() + months;
  const year = date.getUTCFullYear() + Math.floor(index / 12);
  const month = ((index % 12) + 12) % 12;
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), daysInMonth(year, month))));
}

/**
 * Calendar breakdown, anchored on a clamped month anniversary rather than
 * computed by borrowing day numbers. The borrowing approach produces negative
 * remainders at month ends; anchoring cannot, because the anchor is by
 * construction never after the target.
 */
function calendarSpan(from: Date, to: Date) {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (addMonths(from, months) > to) months -= 1;

  const anchor = addMonths(from, months);
  const days = Math.round((to.getTime() - anchor.getTime()) / DAY_MS);

  return { years: Math.floor(months / 12), months: months % 12, days, totalMonths: months };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** ISO 8601 week number: weeks start Monday, week 1 contains the first Thursday. */
function isoWeek(date: Date): { year: number; week: number } {
  const target = new Date(date.getTime());
  const dayOfWeek = (target.getUTCDay() + 6) % 7; // Monday = 0
  target.setUTCDate(target.getUTCDate() - dayOfWeek + 3); // the Thursday of this week
  const isoYear = target.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayOfWeek = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayOfWeek + 3);
  const week = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * DAY_MS));
  return { year: isoYear, week };
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DateDifferenceCalculator() {
  // Both fields start empty rather than prefilled with today. This component is
  // server-rendered before it hydrates, and seeding state from `new Date()`
  // would let the server's date and the reader's date disagree across midnight.
  // The buttons below fill them in on click, where only the browser's clock is
  // ever involved.
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [holidayInput, setHolidayInput] = useState('');

  const result = useMemo(() => {
    const from = toUtc(start);
    const to = toUtc(end);
    if (!from || !to) return null;

    // Order is normalised so the counts are always positive; the direction is
    // reported separately rather than as a negative number, which reads badly.
    const reversed = from > to;
    const [early, late] = reversed ? [to, from] : [from, to];

    const totalDays = Math.round((late.getTime() - early.getTime()) / DAY_MS);
    const span = calendarSpan(early, late);

    // Holidays are matched against the same UTC-midnight representation, and
    // only counted when they land on a weekday inside the range — a holiday on
    // a Saturday was never a working day to lose.
    const holidays = new Set(
      holidayInput
        .split(/[\s,;]+/)
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => toUtc(token))
        .filter((date): date is Date => date !== null)
        .map((date) => date.getTime()),
    );

    let weekdays = 0;
    let weekendDays = 0;
    let holidaysInRange = 0;

    // Counted day by day rather than by a closed-form week formula. The range
    // is bounded by what a date input can express, and an explicit loop is far
    // easier to verify against a wall calendar than the arithmetic shortcut.
    for (let t = early.getTime() + DAY_MS; t <= late.getTime(); t += DAY_MS) {
      const day = new Date(t).getUTCDay();
      if (day === 0 || day === 6) {
        weekendDays += 1;
      } else if (holidays.has(t)) {
        holidaysInRange += 1;
      } else {
        weekdays += 1;
      }
    }

    let leapYears = 0;
    for (let y = early.getUTCFullYear(); y <= late.getUTCFullYear(); y += 1) {
      if (!isLeapYear(y)) continue;
      const feb29 = new Date(Date.UTC(y, 1, 29));
      if (feb29 > early && feb29 <= late) leapYears += 1;
    }

    return {
      early,
      late,
      reversed,
      totalDays,
      span,
      weekdays,
      weekendDays,
      holidaysInRange,
      leapYears,
      startWeek: isoWeek(early),
      endWeek: isoWeek(late),
    };
  }, [start, end, holidayInput]);

  function reset() {
    setStart('');
    setEnd('');
    setHolidayInput('');
  }

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <DateField label="Start date" value={start} onChange={setStart} />
        <DateField label="End date" value={end} onChange={setEnd} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStart(todayIso())}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
        >
          Start today
        </button>
        <button
          type="button"
          onClick={() => setEnd(todayIso())}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
        >
          End today
        </button>
      </div>

      <div className="mt-5">
        <label htmlFor="holidays" className="block text-sm font-semibold text-ink-800">
          Public holidays to exclude (optional)
        </label>
        <textarea
          id="holidays"
          value={holidayInput}
          onChange={(event) => setHolidayInput(event.target.value)}
          rows={2}
          placeholder="2026-12-25, 2026-12-26, 2027-01-01"
          className={FIELD}
        />
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          One ISO date per entry, separated by commas, spaces or line breaks. Holidays
          falling on a weekend are ignored, since they were never working days.
        </p>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label={result.reversed ? 'Days between (end date is earlier)' : 'Days between'}
            value={formatNumber(result.totalDays)}
            unit={result.totalDays === 1 ? 'day' : 'days'}
            verdict={
              result.span.years === 0 && result.span.months === 0
                ? `${result.span.days} days`
                : `${result.span.years} year${result.span.years === 1 ? '' : 's'}, ${
                    result.span.months
                  } month${result.span.months === 1 ? '' : 's'}, ${result.span.days} day${
                    result.span.days === 1 ? '' : 's'
                  }`
            }
          />

          <ResultRows
            rows={[
              {
                label: 'Counting both end dates (inclusive)',
                value: `${formatNumber(result.totalDays + 1)} days`,
                emphasis: true,
              },
              { label: 'Working days, Monday to Friday', value: formatNumber(result.weekdays) },
              { label: 'Weekend days', value: formatNumber(result.weekendDays) },
              ...(result.holidaysInRange > 0
                ? [
                    {
                      label: 'Holidays excluded',
                      value: formatNumber(result.holidaysInRange),
                    },
                  ]
                : []),
              { label: 'Full weeks', value: `${formatNumber(Math.floor(result.totalDays / 7))} weeks and ${result.totalDays % 7} days` },
              { label: 'Whole calendar months', value: formatNumber(result.span.totalMonths) },
              { label: 'Hours', value: formatNumber(result.totalDays * 24) },
              { label: 'Minutes', value: formatNumber(result.totalDays * 1440) },
              { label: '29 Februaries in the range', value: formatNumber(result.leapYears) },
            ]}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">The two dates</p>
            <ResultRows
              rows={[
                {
                  label: formatDate(result.early),
                  value: `${WEEKDAY_NAMES[result.early.getUTCDay()]} · ISO week ${
                    result.startWeek.week
                  } of ${result.startWeek.year}`,
                },
                {
                  label: formatDate(result.late),
                  value: `${WEEKDAY_NAMES[result.late.getUTCDay()]} · ISO week ${
                    result.endWeek.week
                  } of ${result.endWeek.year}`,
                },
              ]}
            />
          </div>

          <p className="text-sm leading-relaxed text-ink-500">
            The headline figure counts elapsed days — nights passed between the two
            dates. The inclusive figure counts the days themselves, which is what a
            booking, a notice period or a statutory deadline usually means. Check which
            one your situation calls for.
          </p>
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
