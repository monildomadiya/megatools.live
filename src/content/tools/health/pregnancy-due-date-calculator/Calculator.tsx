'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DateField,
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { parseNumber } from '@/lib/format';

const METHODS = [
  { value: 'lmp', label: 'First day of last period' },
  { value: 'conception', label: 'Known conception or ovulation date' },
  { value: 'ivf3', label: 'IVF — day 3 transfer' },
  { value: 'ivf5', label: 'IVF — day 5 blastocyst transfer' },
] as const;

type Method = (typeof METHODS)[number]['value'];

const DAY = 86_400_000;

/**
 * Days added to the entered date for each method.
 *
 * 280 from the last period is Naegele's rule. 266 from conception is the same
 * figure less the two weeks the convention counts before conception happened.
 * The IVF numbers subtract the days the embryo had already developed at
 * transfer, which is why a day-5 blastocyst is 261 and not 266.
 */
const OFFSETS: Record<Method, number> = {
  lmp: 280,
  conception: 266,
  ivf3: 263,
  ivf5: 261,
};

function parseIso(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

const LONG_DATE = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const SHORT_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * DAY);
}

export default function PregnancyDueDateCalculator() {
  const [method, setMethod] = useState<Method>('lmp');
  const [start, setStart] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  // Set after mount so the server's date never lands in the HTML.
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
  }, []);

  function reset() {
    setMethod('lmp');
    setStart('');
    setCycleLength('28');
  }

  const result = useMemo(() => {
    const from = parseIso(start);
    if (!from) return null;

    // Naegele's rule assumes ovulation on day 14. A longer or shorter cycle
    // moves ovulation, and therefore the due date, by the difference. Only the
    // last-period method needs this — the others already start from a known
    // fertilisation point.
    const cycle = parseNumber(cycleLength) ?? 28;
    const adjustment = method === 'lmp' ? Math.round(cycle) - 28 : 0;

    const due = addDays(from, OFFSETS[method] + adjustment);
    // Gestational age is counted from the notional last period in every method,
    // so the other three are converted back to that reference point first.
    const gestationStart = addDays(due, -280);

    return { due, gestationStart, adjustment };
  }, [cycleLength, method, start]);

  const progress = useMemo(() => {
    if (!result || !today) return null;
    const days = Math.floor((today.getTime() - result.gestationStart.getTime()) / DAY);
    if (days < 0 || days > 320) return null;
    return {
      days,
      weeks: Math.floor(days / 7),
      remainder: days % 7,
      toGo: Math.max(Math.ceil((result.due.getTime() - today.getTime()) / DAY), 0),
    };
  }, [result, today]);

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          An estimate, not a prediction. The spread is wide — see below.
        </p>
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SelectField label="Dating method" value={method} onChange={setMethod} options={METHODS} />
        <DateField
          label={method === 'lmp' ? 'First day of last period' : 'Date of the event above'}
          value={start}
          onChange={setStart}
          hint={
            method === 'lmp'
              ? 'The first day of bleeding, not the last.'
              : 'Transfer date for IVF, ovulation date otherwise.'
          }
        />
      </div>

      {method === 'lmp' && (
        <div className="mt-5 sm:max-w-xs">
          <NumberField
            label="Usual cycle length"
            value={cycleLength}
            onChange={setCycleLength}
            unit="days"
            inputMode="numeric"
            min={20}
            max={45}
            hint="Naegele's rule assumes 28. A longer cycle moves the date later."
          />
        </div>
      )}

      {result && (
        <div className="mt-7">
          <ResultCard
            label="Estimated due date"
            value={LONG_DATE.format(result.due)}
            verdict={
              progress
                ? `${progress.weeks} weeks ${progress.remainder} days today`
                : undefined
            }
          >
            <ResultRows
              rows={[
                ...(progress
                  ? [
                      {
                        label: 'Gestational age today',
                        value: `${progress.weeks}w ${progress.remainder}d`,
                        emphasis: true,
                      },
                      {
                        label: 'Days until the due date',
                        value: progress.toGo === 0 ? 'Today or passed' : String(progress.toGo),
                      },
                      {
                        label: 'Trimester',
                        value:
                          progress.weeks < 13 ? 'First' : progress.weeks < 27 ? 'Second' : 'Third',
                      },
                    ]
                  : []),
                {
                  label: 'Early term begins (37w 0d)',
                  value: SHORT_DATE.format(addDays(result.gestationStart, 259)),
                },
                {
                  label: 'Full term begins (39w 0d)',
                  value: SHORT_DATE.format(addDays(result.gestationStart, 273)),
                },
                {
                  label: 'Post-term begins (42w 0d)',
                  value: SHORT_DATE.format(addDays(result.gestationStart, 294)),
                },
                ...(result.adjustment !== 0
                  ? [
                      {
                        label: 'Cycle length adjustment',
                        value: `${result.adjustment > 0 ? '+' : ''}${result.adjustment} days`,
                      },
                    ]
                  : []),
              ]}
            />

            {/* The single most useful thing this page can say, so it is said on
                the result rather than left to the article. */}
            <p className="mt-4 rounded-control border border-brand-200 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-800">
              About 4% of babies arrive on the due date itself. Roughly two thirds arrive
              within a week either side of it — that is{' '}
              <span className="numeric">{SHORT_DATE.format(addDays(result.due, -7))}</span> to{' '}
              <span className="numeric">{SHORT_DATE.format(addDays(result.due, 7))}</span>{' '}
              here. Treat the date as the middle of a range.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              A first-trimester ultrasound dates a pregnancy more accurately than any
              calculation from a last period, and clinical guidance says the scan date
              should replace this one where they meaningfully differ. This is not medical
              advice and does not replace antenatal care.
            </p>
          </ResultCard>
        </div>
      )}
    </CalculatorPanel>
  );
}
