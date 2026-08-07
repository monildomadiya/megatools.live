'use client';

import { useMemo, useState } from 'react';
import { DateField, ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { formatNumber } from '@/lib/format';

/**
 * All arithmetic runs in UTC.
 *
 * Age is a whole-date question, and local-time Date objects make it a
 * clock-time one: a span crossing a daylight saving boundary is 23 or 25 hours
 * long, which is enough to push a `floor` over a day boundary and report
 * someone as a day younger than they are. Parsing to UTC midnight removes the
 * clock from the problem entirely.
 */
function toUtc(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Rejects impossible dates such as 2025-02-30, which Date.UTC would silently
  // roll forward into March rather than refuse.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

const DAY_MS = 86_400_000;

/**
 * Days in a given month, where `month` is 0-indexed as in Date.
 *
 * Day 0 of the following month is the last day of this one, so this gets the
 * Gregorian leap rule — including the century exception — from the platform
 * rather than reimplementing it.
 */
function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * Adds whole months, clamping the day to the length of the target month.
 *
 * 31 January plus one month has no correct answer — 31 February does not
 * exist — so it resolves to 29 or 28 February depending on the year. Clamping
 * is the convention every mainstream date library uses.
 */
function addMonths(date: Date, months: number): Date {
  const index = date.getUTCMonth() + months;
  const year = date.getUTCFullYear() + Math.floor(index / 12);
  const month = ((index % 12) + 12) % 12;
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), daysInMonth(year, month))));
}

/**
 * Calendar-unit age, not a division of the total day count.
 *
 * Finds the largest whole number of months that still lands on or before the
 * target date, then measures the leftover in real days from that anniversary.
 *
 * The obvious alternative — subtract the day numbers and borrow a month when
 * the result goes negative — is what most implementations do and it breaks on
 * month ends. From 31 January to 1 March it borrows February's 29 days against
 * a shortfall of 30 and still ends up negative, reporting a nonsensical
 * "1 month, −1 days". Anchoring on a clamped anniversary cannot produce a
 * negative remainder, because the anchor is by construction not after the
 * target.
 */
function calendarAge(from: Date, to: Date) {
  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());

  // The month arithmetic above can overshoot by one when the day of month has
  // not yet come round.
  if (addMonths(from, months).getTime() > to.getTime()) months -= 1;

  const anchor = addMonths(from, months);
  const days = Math.round((to.getTime() - anchor.getTime()) / DAY_MS);

  return { years: Math.floor(months / 12), months: months % 12, days };
}

/**
 * Next occurrence of the birth day-and-month on or after `on`.
 *
 * Uses the same clamping rule as `calendarAge`, so a 29 February birthday falls
 * on 28 February in common years. Consistency here is not cosmetic: resolving it
 * to 1 March while the age arithmetic clamps to 28 February would let the tool
 * report someone as having just turned 26 and as having a birthday tomorrow at
 * the same time.
 *
 * It is still a convention rather than a universal rule, which the page says.
 */
function nextBirthday(birth: Date, on: Date): Date {
  const month = birth.getUTCMonth();
  const day = birth.getUTCDate();

  const build = (year: number) =>
    new Date(Date.UTC(year, month, Math.min(day, daysInMonth(year, month))));

  let candidate = build(on.getUTCFullYear());
  if (candidate.getTime() < on.getTime()) {
    candidate = build(on.getUTCFullYear() + 1);
  }
  return candidate;
}

/** "1 month" rather than "1 months" — the readout reads as a sentence. */
function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

export default function AgeCalculator() {
  const initialToday = todayIso();
  const [birth, setBirth] = useState('');
  const [asOf, setAsOf] = useState(initialToday);

  const birthDate = toUtc(birth);
  const asOfDate = toUtc(asOf);

  const result = useMemo(() => {
    if (!birthDate || !asOfDate) return null;
    if (birthDate.getTime() > asOfDate.getTime()) return null;

    const age = calendarAge(birthDate, asOfDate);
    const totalDays = Math.round((asOfDate.getTime() - birthDate.getTime()) / DAY_MS);
    const totalMonths = age.years * 12 + age.months;
    const upcoming = nextBirthday(birthDate, asOfDate);
    const daysToBirthday = Math.round((upcoming.getTime() - asOfDate.getTime()) / DAY_MS);

    return {
      age,
      totalDays,
      totalMonths,
      totalWeeks: Math.floor(totalDays / 7),
      bornOn: WEEKDAYS[birthDate.getUTCDay()]!,
      daysToBirthday,
      turning: age.years + 1,
      upcomingLabel: upcoming.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }),
    };
  }, [birthDate, asOfDate]);

  const reversed =
    birthDate !== null && asOfDate !== null && birthDate.getTime() > asOfDate.getTime();

  function reset() {
    setBirth('');
    setAsOf(initialToday);
  }

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <DateField
          label="Date of birth"
          value={birth}
          onChange={setBirth}
          max={asOf || undefined}
          error={reversed ? 'Date of birth must be on or before the date below.' : undefined}
        />
        <DateField
          label="Age on"
          value={asOf}
          onChange={setAsOf}
          hint="Defaults to today. Change it for a past or future date."
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Age"
            value={`${result.age.years}`}
            unit={result.age.years === 1 ? 'year' : 'years'}
            verdict={`${plural(result.age.years, 'year')}, ${plural(
              result.age.months,
              'month',
            )} and ${plural(result.age.days, 'day')}`}
          />

          <ResultRows
            rows={[
              { label: 'Total months', value: formatNumber(result.totalMonths) },
              { label: 'Total weeks', value: formatNumber(result.totalWeeks) },
              { label: 'Total days', value: formatNumber(result.totalDays), emphasis: true },
              { label: 'Born on a', value: result.bornOn },
              {
                label: `Next birthday (turning ${result.turning})`,
                value: result.upcomingLabel,
              },
              {
                label: 'Days until then',
                value:
                  result.daysToBirthday === 0
                    ? 'Today'
                    : formatNumber(result.daysToBirthday),
                emphasis: true,
              },
            ]}
          />
        </div>
      )}

      {!birth && (
        <p className="mt-6 text-sm text-ink-500">
          Enter a date of birth to see the result.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
