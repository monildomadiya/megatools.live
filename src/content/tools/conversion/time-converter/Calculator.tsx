'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { parseNumber } from '@/lib/format';

/**
 * Seconds per unit, and every conversion goes value -> seconds -> target.
 *
 * Up to the week these are exact multiples of the SI second and there is
 * nothing to decide. Months and years are the opposite: they have no fixed
 * length, so a converter that offers them is choosing a convention whether it
 * admits it or not. This one uses the mean Gregorian month and year — the
 * 400-year cycle is exactly 146,097 days, so a mean year is 365.2425 days and a
 * mean month is a twelfth of that — and labels them as averages in the UI. The
 * Julian year is offered alongside because astronomy uses it and it is 648
 * seconds longer.
 */
const UNITS = [
  { value: 'ns', label: 'Nanoseconds (ns)', seconds: 1e-9, decimals: 0, exact: true },
  { value: 'µs', label: 'Microseconds (µs)', seconds: 1e-6, decimals: 2, exact: true },
  { value: 'ms', label: 'Milliseconds (ms)', seconds: 0.001, decimals: 3, exact: true },
  { value: 's', label: 'Seconds (s)', seconds: 1, decimals: 4, exact: true },
  { value: 'min', label: 'Minutes (min)', seconds: 60, decimals: 4, exact: true },
  { value: 'h', label: 'Hours (h)', seconds: 3600, decimals: 5, exact: true },
  { value: 'd', label: 'Days (d)', seconds: 86400, decimals: 6, exact: true },
  { value: 'wk', label: 'Weeks (wk)', seconds: 604800, decimals: 6, exact: true },
  { value: 'mo', label: 'Months (mean Gregorian)', seconds: 2629746, decimals: 6, exact: false },
  { value: 'yr', label: 'Years (mean Gregorian)', seconds: 31556952, decimals: 8, exact: false },
  { value: 'yr Julian', label: 'Years (Julian, 365.25 d)', seconds: 31557600, decimals: 8, exact: false },
  { value: 'decade', label: 'Decades (mean Gregorian)', seconds: 315569520, decimals: 8, exact: false },
  { value: 'century', label: 'Centuries (mean Gregorian)', seconds: 3155695200, decimals: 9, exact: false },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

function present(value: number, decimals: number): string {
  if (value !== 0 && (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e12)) {
    return value.toExponential(4);
  }
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

/**
 * The same duration written the way a person would say it. A conversion that
 * reports 5,400 seconds as 1.5 hours is correct; reporting it as "1 h 30 min"
 * is the form the reader can act on, and the two answers cost nothing to show
 * together.
 *
 * Stops at days on purpose. Carrying the breakdown up into months would put a
 * fictional average inside a figure that is otherwise exact.
 */
function breakdown(totalSeconds: number): string {
  if (totalSeconds === 0) return '0 s';

  const parts: string[] = [];
  let remaining = totalSeconds;

  for (const [label, size] of [
    ['d', 86400],
    ['h', 3600],
    ['min', 60],
  ] as const) {
    const count = Math.floor(remaining / size);
    if (count > 0) {
      parts.push(`${count.toLocaleString('en-US')} ${label}`);
      remaining -= count * size;
    }
  }

  // Sub-second remainders keep three decimals; whole seconds stay whole.
  if (remaining > 0) {
    const rounded = Math.round(remaining * 1000) / 1000;
    if (rounded > 0) parts.push(`${rounded} s`);
  }

  return parts.length > 0 ? parts.join(' ') : '0 s';
}

export default function TimeConverter() {
  const [amount, setAmount] = useState('90');
  const [from, setFrom] = useState<UnitCode>('min');
  const [to, setTo] = useState<UnitCode>('h');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null) return null;

    const seconds = parsed * unitFor(from).seconds;
    const target = unitFor(to);

    return {
      seconds,
      converted: seconds / target.seconds,
      rows: UNITS.map((unit) => ({
        label: unit.exact ? unit.label : `${unit.label} — average`,
        value: present(seconds / unit.seconds, unit.decimals),
        emphasis: unit.value === to,
      })),
    };
  }, [parsed, from, to]);

  function reset() {
    setAmount('90');
    setFrom('min');
    setTo('h');
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const fromUnit = unitFor(from);
  const toUnit = unitFor(to);
  const approximate = !fromUnit.exact || !toUnit.exact;

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Value"
          value={amount}
          onChange={setAmount}
          placeholder="90"
          hint="Durations only — negative values are rejected."
        />
        <div className="flex items-end">
          <button
            type="button"
            onClick={swap}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
          >
            ⇄ Swap units
          </button>
        </div>
        <SelectField
          label="From"
          value={from}
          onChange={setFrom}
          options={UNITS.map((u) => ({ value: u.value, label: u.label }))}
        />
        <SelectField
          label="To"
          value={to}
          onChange={setTo}
          options={UNITS.map((u) => ({ value: u.value, label: u.label }))}
        />
      </div>

      {result && parsed !== null && parsed >= 0 && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${present(parsed, fromUnit.decimals)} ${from} in ${toUnit.label.toLowerCase()}`}
            value={present(result.converted, toUnit.decimals)}
            unit={to}
            verdict={breakdown(result.seconds)}
          />

          {approximate && (
            <p className="rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              Months and years have no fixed length. This conversion uses the mean Gregorian
              month of 30.436875 days and the mean Gregorian year of 365.2425 days, so it is
              an average rather than a count of the days in any particular month or year.
            </p>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              The same duration in every unit
            </p>
            <ResultRows rows={result.rows} />
          </div>
        </div>
      )}

      {parsed !== null && parsed < 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a value of zero or more — a duration cannot be negative.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
