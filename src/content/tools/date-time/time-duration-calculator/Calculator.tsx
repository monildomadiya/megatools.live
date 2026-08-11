'use client';

import { useMemo, useState } from 'react';
import { NumberField, ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { formatNumber, parseNumber } from '@/lib/format';

/** Minutes since midnight from a `HH:MM` value, or null if incomplete. */
function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** `PT8H30M`, the ISO 8601 duration form. */
function isoDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0 && minutes === 0) return 'PT0M';
  return `PT${hours > 0 ? `${hours}H` : ''}${minutes > 0 ? `${minutes}M` : ''}`;
}

function TimeField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink-800">
        {label}
        <input
          type="time"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-4 py-3 text-base font-bold text-ink-900 outline-none transition-colors focus:border-brand-500 sm:px-5"
        />
      </label>
      {hint && <p className="mt-2 text-sm leading-relaxed text-ink-500">{hint}</p>}
    </div>
  );
}

export default function TimeDurationCalculator() {
  const [start, setStart] = useState('09:15');
  const [end, setEnd] = useState('17:45');
  const [breakMinutes, setBreakMinutes] = useState('30');

  function reset() {
    setStart('09:15');
    setEnd('17:45');
    setBreakMinutes('30');
  }

  const result = useMemo(() => {
    const from = toMinutes(start);
    const to = toMinutes(end);
    if (from === null || to === null) return null;

    // An end earlier than the start is an overnight shift, not a negative
    // duration. Adding a day is the only reading that makes sense on a
    // timesheet, and it is what every payroll system does.
    const crossesMidnight = to <= from;
    const gross = crossesMidnight ? to + 24 * 60 - from : to - from;

    const deduction = Math.max(parseNumber(breakMinutes) ?? 0, 0);
    const net = Math.max(gross - deduction, 0);

    return {
      crossesMidnight,
      gross,
      deduction,
      net,
      hours: Math.floor(net / 60),
      minutes: net % 60,
      decimal: net / 60,
    };
  }, [breakMinutes, end, start]);

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Clock times within one day. An end before the start is read as overnight.
        </p>
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <TimeField label="Start" value={start} onChange={setStart} />
        <TimeField label="End" value={end} onChange={setEnd} />
        <NumberField
          label="Unpaid break"
          value={breakMinutes}
          onChange={setBreakMinutes}
          unit="min"
          inputMode="numeric"
          min={0}
          hint="Set to 0 if none."
        />
      </div>

      {result && (
        <div className="mt-7">
          <ResultCard
            label="Time worked"
            value={`${result.hours}h ${String(result.minutes).padStart(2, '0')}m`}
            verdict={`${formatNumber(result.decimal, 2)} decimal hours`}
          >
            <ResultRows
              rows={[
                {
                  label: 'For payroll — decimal hours',
                  value: formatNumber(result.decimal, 2),
                  emphasis: true,
                },
                { label: 'Total minutes', value: String(result.net) },
                {
                  label: 'Before the break',
                  value: `${Math.floor(result.gross / 60)}h ${String(result.gross % 60).padStart(2, '0')}m`,
                },
                {
                  label: 'Break deducted',
                  value: result.deduction > 0 ? `${result.deduction} min` : 'None',
                },
                { label: 'ISO 8601 duration', value: isoDuration(result.net) },
              ]}
            />

            {result.crossesMidnight && (
              <p className="mt-4 rounded-control border border-brand-200 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-800">
                The end time is earlier than the start, so this has been read as an
                overnight shift finishing the next day.
              </p>
            )}

            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Note the two figures are the same duration.{' '}
              <span className="numeric">{result.hours}h {String(result.minutes).padStart(2, '0')}m</span>{' '}
              is <span className="numeric">{formatNumber(result.decimal, 2)}</span> hours, not{' '}
              <span className="numeric">
                {result.hours}.{String(result.minutes).padStart(2, '0')}
              </span>
              . Writing the minutes after the point is the most common timesheet error
              there is — the reason is below.
            </p>
          </ResultCard>
        </div>
      )}
    </CalculatorPanel>
  );
}
