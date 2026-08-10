'use client';

import { useId, useMemo, useState } from 'react';
import {
  DateField,
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/**
 * All date arithmetic here runs in UTC.
 *
 * A business day count done in local time breaks twice a year: the day a clock
 * goes forward is 23 hours long, and adding 86,400,000 milliseconds to a date
 * across that boundary lands on the same calendar day it started on. UTC has no
 * such days, and since nothing here needs a wall-clock time, working in it
 * removes the entire class of bug rather than guarding against it.
 */
const DAY_MS = 86_400_000;

/** Parses an ISO `YYYY-MM-DD` string to a UTC timestamp, or null. */
function parseISO(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const stamp = Date.UTC(Number(y), Number(m) - 1, Number(d));
  const check = new Date(stamp);
  // Rejects 2026-02-31 and friends, which Date.UTC would silently roll over.
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

/**
 * Weekend patterns. Saturday and Sunday is the assumption almost every tool
 * makes silently; it is wrong across much of the Middle East and for anyone on
 * a six-day week, so it is a choice here instead.
 */
const WEEKENDS = {
  'sat-sun': { label: 'Saturday & Sunday', days: [0, 6] },
  'fri-sat': { label: 'Friday & Saturday', days: [5, 6] },
  'sun-only': { label: 'Sunday only', days: [0] },
  none: { label: 'No weekend (7-day week)', days: [] as number[] },
} as const;

type WeekendKey = keyof typeof WEEKENDS;

type Mode = 'between' | 'add';

export default function BusinessDaysCalculator() {
  const [mode, setMode] = useState<Mode>('between');
  const [start, setStart] = useState('2026-08-10');
  const [end, setEnd] = useState('2026-09-10');
  const [count, setCount] = useState('10');
  const [weekend, setWeekend] = useState<WeekendKey>('sat-sun');
  const [includeStart, setIncludeStart] = useState(true);
  const [holidayText, setHolidayText] = useState('');
  const holidayId = useId();

  const weekendDays = WEEKENDS[weekend].days;
  const isWeekend = (stamp: number) =>
    (weekendDays as readonly number[]).includes(new Date(stamp).getUTCDay());

  /** Parsed, deduplicated holiday dates. Unparseable lines are reported, not ignored. */
  const holidays = useMemo(() => {
    const valid = new Set<number>();
    const invalid: string[] = [];

    for (const line of holidayText.split(/[\n,]/)) {
      const trimmed = line.trim();
      if (trimmed === '') continue;
      const stamp = parseISO(trimmed);
      if (stamp === null) invalid.push(trimmed);
      else valid.add(stamp);
    }

    return { valid, invalid };
  }, [holidayText]);

  const isHoliday = (stamp: number) => holidays.valid.has(stamp);
  const isWorkingDay = (stamp: number) => !isWeekend(stamp) && !isHoliday(stamp);

  const startStamp = parseISO(start);
  const endStamp = parseISO(end);

  const between = useMemo(() => {
    if (mode !== 'between' || startStamp === null || endStamp === null) return null;
    if (endStamp < startStamp) return null;

    let working = 0;
    let weekendCount = 0;
    let holidayCount = 0;
    let total = 0;

    const first = includeStart ? startStamp : startStamp + DAY_MS;

    for (let stamp = first; stamp <= endStamp; stamp += DAY_MS) {
      total += 1;
      if (isWeekend(stamp)) weekendCount += 1;
      else if (isHoliday(stamp)) holidayCount += 1;
      else working += 1;
    }

    return { working, weekendCount, holidayCount, total };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, startStamp, endStamp, includeStart, weekend, holidays.valid]);

  const added = useMemo(() => {
    if (mode !== 'add' || startStamp === null) return null;

    const requested = Number(count);
    if (!Number.isInteger(requested) || requested === 0) return null;
    if (Math.abs(requested) > 5000) return null;

    const step = requested > 0 ? DAY_MS : -DAY_MS;
    let remaining = Math.abs(requested);
    let stamp = startStamp;
    let skipped = 0;

    // Counting always begins the day *after* the start date, which is the
    // convention deadlines are written against — see the FAQ.
    while (remaining > 0) {
      stamp += step;
      if (isWorkingDay(stamp)) remaining -= 1;
      else skipped += 1;
    }

    return { stamp, skipped, requested };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, startStamp, count, weekend, holidays.valid]);

  function reset() {
    setMode('between');
    setStart('2026-08-10');
    setEnd('2026-09-10');
    setCount('10');
    setWeekend('sat-sun');
    setIncludeStart(true);
    setHolidayText('');
  }

  return (
    <CalculatorPanel>
      <div className="mb-5">
        <UnitToggle
          label="What to work out"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'between', label: 'Days between' },
            { value: 'add', label: 'Add business days' },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <DateField
          label={mode === 'between' ? 'From' : 'Starting date'}
          value={start}
          onChange={setStart}
        />

        {mode === 'between' ? (
          <DateField label="To" value={end} onChange={setEnd} />
        ) : (
          <NumberField
            label="Business days to add"
            value={count}
            onChange={setCount}
            unit="days"
            step={1}
            inputMode="numeric"
            hint="Negative counts backwards."
          />
        )}

        <SelectField
          label="Weekend"
          value={weekend}
          onChange={setWeekend}
          options={(Object.keys(WEEKENDS) as WeekendKey[]).map((key) => ({
            value: key,
            label: WEEKENDS[key].label,
          }))}
        />

        {mode === 'between' && (
          <label className="flex cursor-pointer items-start gap-2.5 self-end rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
            <input
              type="checkbox"
              checked={includeStart}
              onChange={(event) => setIncludeStart(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand-solid"
            />
            <span className="text-ink-800">
              Count the start date
              <span className="mt-0.5 block text-ink-500">
                Off matches the usual deadline convention, where the clock starts the next
                day.
              </span>
            </span>
          </label>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor={holidayId} className="block text-sm font-semibold text-ink-800">
          Public holidays to exclude
        </label>
        <textarea
          id={holidayId}
          value={holidayText}
          onChange={(event) => setHolidayText(event.target.value)}
          rows={3}
          spellCheck={false}
          placeholder={'2026-12-25\n2026-12-26\n2027-01-01'}
          className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-4 py-3 text-sm text-ink-900 transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 sm:px-5"
        />
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          One ISO date per line. No holiday list is built in on purpose — they differ by
          country, by region and by year, and a wrong list that looks official is worse than
          no list at all.
        </p>
        {holidays.invalid.length > 0 && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            Not read as dates: {holidays.invalid.slice(0, 4).join(', ')}
            {holidays.invalid.length > 4 ? '…' : ''}. Use the YYYY-MM-DD form.
          </p>
        )}
      </div>

      {between && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Business days"
            value={String(between.working)}
            unit={between.working === 1 ? 'day' : 'days'}
            verdict={`${between.total} calendar ${between.total === 1 ? 'day' : 'days'} in the range`}
          />
          <ResultRows
            rows={[
              { label: 'Working days', value: String(between.working), emphasis: true },
              { label: 'Weekend days', value: String(between.weekendCount) },
              { label: 'Holidays excluded', value: String(between.holidayCount) },
              { label: 'Calendar days', value: String(between.total) },
              {
                label: 'Start date counted',
                value: includeStart ? 'Yes' : 'No',
              },
            ]}
          />
        </div>
      )}

      {added && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${Math.abs(added.requested)} business ${
              Math.abs(added.requested) === 1 ? 'day' : 'days'
            } ${added.requested > 0 ? 'after' : 'before'} ${formatLong(startStamp!)}`}
            value={formatLong(added.stamp)}
            verdict={`${toISO(added.stamp)} · counting begins the day after the start date`}
          />
          <ResultRows
            rows={[
              { label: 'Resulting date', value: toISO(added.stamp), emphasis: true },
              { label: 'Non-working days skipped', value: String(added.skipped) },
              {
                label: 'Calendar days elapsed',
                value: String(Math.abs(added.stamp - startStamp!) / DAY_MS),
              },
            ]}
          />
        </div>
      )}

      {mode === 'between' && startStamp !== null && endStamp !== null && endStamp < startStamp && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          The end date is before the start date. Swap them, or use the add mode with a
          negative count.
        </p>
      )}

      {weekend === 'none' && holidays.valid.size === 0 && (
        <p className="mt-6 rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
          With no weekend and no holidays entered, every calendar day counts as a business
          day. That is a valid setup for a seven-day operation and almost certainly not what
          you meant otherwise.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
