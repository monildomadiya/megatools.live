'use client';

import { useMemo, useState } from 'react';
import {
  DateField,
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/**
 * Everything runs in UTC.
 *
 * Week numbering is pure calendar arithmetic with no wall-clock component, and
 * doing it in local time means the two days a year when a day is 23 or 25 hours
 * long can push a date into the wrong week. UTC has no such days.
 */
const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

function parseISO(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const stamp = Date.UTC(Number(y), Number(m) - 1, Number(d));
  const check = new Date(stamp);
  if (check.getUTCMonth() !== Number(m) - 1 || check.getUTCDate() !== Number(d)) return null;
  return stamp;
}

function toISO(stamp: number): string {
  return new Date(stamp).toISOString().slice(0, 10);
}

function formatLong(stamp: number): string {
  return new Date(stamp).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Monday of the week containing this date. */
function mondayOf(stamp: number): number {
  const isoDay = (new Date(stamp).getUTCDay() + 6) % 7; // Monday = 0
  return stamp - isoDay * DAY_MS;
}

/**
 * ISO 8601 week number and week-based year.
 *
 * The Thursday of a week decides which year the whole week belongs to, because
 * Thursday is the day that is always in the majority year. Finding it first
 * turns the rule into two lines of arithmetic and removes every edge case at
 * the turn of the year.
 */
function isoWeek(stamp: number): { week: number; year: number } {
  const thursday = mondayOf(stamp) + 3 * DAY_MS;
  const year = new Date(thursday).getUTCFullYear();
  // 4 January is always in week 01, so the Thursday of its week is week 01's.
  const firstThursday = mondayOf(Date.UTC(year, 0, 4)) + 3 * DAY_MS;
  const week = 1 + Math.round((thursday - firstThursday) / WEEK_MS);
  return { week, year };
}

/** Monday of week 01 of a given ISO week-based year. */
function firstMondayOf(year: number): number {
  return mondayOf(Date.UTC(year, 0, 4));
}

/** 52 or 53 — the number of ISO weeks in a week-based year. */
function weeksInYear(year: number): number {
  return isoWeek(Date.UTC(year, 11, 28)).week;
}

/**
 * The common North American numbering: weeks start on Sunday and week 1 is the
 * week containing 1 January, so a two-day fragment at the start of the year is
 * still called week 1. Shown alongside the ISO figure because the two disagree
 * for most of the year and nobody says which one they mean.
 */
function usWeek(stamp: number): number {
  const date = new Date(stamp);
  const year = date.getUTCFullYear();
  const jan1 = Date.UTC(year, 0, 1);
  const dayOfYear = Math.round((stamp - jan1) / DAY_MS) + 1;
  return Math.floor((dayOfYear + new Date(jan1).getUTCDay() - 1) / 7) + 1;
}

function dayOfYear(stamp: number): number {
  return Math.round((stamp - Date.UTC(new Date(stamp).getUTCFullYear(), 0, 1)) / DAY_MS) + 1;
}

type Mode = 'from-date' | 'from-week';

const DEFAULT_DATE = '2026-08-12';

export default function WeekNumberCalculator() {
  const [mode, setMode] = useState<Mode>('from-date');
  const [date, setDate] = useState(DEFAULT_DATE);
  const [year, setYear] = useState('2026');
  const [week, setWeek] = useState('33');

  const stamp = parseISO(date);

  const fromDate = useMemo(() => {
    if (mode !== 'from-date' || stamp === null) return null;

    const iso = isoWeek(stamp);
    const monday = mondayOf(stamp);
    const total = weeksInYear(iso.year);

    return {
      iso,
      monday,
      sunday: monday + 6 * DAY_MS,
      total,
      us: usWeek(stamp),
      dayOfYear: dayOfYear(stamp),
      // A date in early January or late December can belong to the neighbouring
      // week-based year, which is the whole reason this figure is displayed.
      yearsDiffer: iso.year !== new Date(stamp).getUTCFullYear(),
      remaining: total - iso.week,
    };
  }, [mode, stamp]);

  const fromWeek = useMemo(() => {
    if (mode !== 'from-week') return null;

    const y = Number(year);
    const w = Number(week);
    if (!Number.isInteger(y) || y < 1000 || y > 9999) return null;
    if (!Number.isInteger(w) || w < 1) return null;

    const total = weeksInYear(y);
    if (w > total) return { over: true as const, total, y, w, monday: 0, sunday: 0 };

    const monday = firstMondayOf(y) + (w - 1) * WEEK_MS;
    return { over: false as const, total, y, w, monday, sunday: monday + 6 * DAY_MS };
  }, [mode, year, week]);

  function reset() {
    setMode('from-date');
    setDate(DEFAULT_DATE);
    setYear('2026');
    setWeek('33');
  }

  return (
    <CalculatorPanel>
      <div className="mb-5">
        <UnitToggle
          label="What to work out"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'from-date', label: 'Date → week' },
            { value: 'from-week', label: 'Week → dates' },
          ]}
        />
      </div>

      {mode === 'from-date' ? (
        <DateField
          label="Date"
          value={date}
          onChange={setDate}
          hint="Any date. Week numbering is defined the same way in every year."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Week-based year"
            value={year}
            onChange={setYear}
            step={1}
            inputMode="numeric"
          />
          <NumberField
            label="Week number"
            value={week}
            onChange={setWeek}
            step={1}
            min={1}
            max={53}
            inputMode="numeric"
            hint="Week 53 exists only in years that have one."
          />
        </div>
      )}

      {mode === 'from-date' && stamp === null && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a date in the YYYY-MM-DD form.
        </p>
      )}

      {fromDate && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`ISO 8601 week for ${formatLong(stamp!)}`}
            value={`W${String(fromDate.iso.week).padStart(2, '0')}`}
            unit={`of ${fromDate.iso.year}`}
            verdict={`${formatLong(fromDate.monday)} to ${formatLong(fromDate.sunday)}`}
          />

          <ResultRows
            rows={[
              {
                label: 'ISO week date',
                value: `${fromDate.iso.year}-W${String(fromDate.iso.week).padStart(2, '0')}-${
                  ((new Date(stamp!).getUTCDay() + 6) % 7) + 1
                }`,
                emphasis: true,
              },
              { label: 'Week-based year', value: String(fromDate.iso.year) },
              { label: 'Weeks in that year', value: String(fromDate.total) },
              { label: 'Weeks left in the year', value: String(fromDate.remaining) },
              { label: 'Day of the year', value: String(fromDate.dayOfYear) },
              {
                label: 'US convention (weeks start Sunday)',
                value: `Week ${fromDate.us}`,
              },
            ]}
          />

          {fromDate.yearsDiffer && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                This date&rsquo;s week belongs to {fromDate.iso.year}, not{' '}
                {new Date(stamp!).getUTCFullYear()}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                A week is never split between two years, so the whole of this one counts to the
                year holding most of its days. Labelling it with the calendar year would give{' '}
                {new Date(stamp!).getUTCFullYear()}-W
                {String(fromDate.iso.week).padStart(2, '0')}, which is a different week or no
                week at all.
              </p>
            </div>
          )}

          {fromDate.total === 53 && (
            <p className="text-sm leading-relaxed text-ink-500">
              {fromDate.iso.year} is a 53-week year — one of roughly one in six. Weekly payrolls
              and weekly reporting cycles get an extra period in it.
            </p>
          )}
        </div>
      )}

      {fromWeek && !fromWeek.over && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`Week ${String(fromWeek.w).padStart(2, '0')} of ${fromWeek.y}`}
            value={`${toISO(fromWeek.monday)} → ${toISO(fromWeek.sunday)}`}
            verdict={`${formatLong(fromWeek.monday)} to ${formatLong(fromWeek.sunday)}`}
          />
          <ResultRows
            rows={[
              { label: 'Monday', value: toISO(fromWeek.monday), emphasis: true },
              { label: 'Sunday', value: toISO(fromWeek.sunday) },
              { label: 'Weeks in this year', value: String(fromWeek.total) },
              {
                label: 'Spans the year end',
                value:
                  new Date(fromWeek.monday).getUTCFullYear() ===
                  new Date(fromWeek.sunday).getUTCFullYear()
                    ? 'No'
                    : 'Yes',
              },
            ]}
          />
        </div>
      )}

      {fromWeek?.over && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          {fromWeek.y} has only {fromWeek.total} ISO weeks, so week {fromWeek.w} does not exist
          in it. A year has 53 weeks only when 1 January is a Thursday, or a Wednesday in a leap
          year.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
