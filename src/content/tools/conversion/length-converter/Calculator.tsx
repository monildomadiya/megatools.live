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
 * Every factor here is the exact defined value, expressed in metres, and every
 * conversion goes value -> metres -> target. Converting through a single base
 * unit means a chain like inches to furlongs cannot accumulate the rounding
 * error that a table of direct pair-to-pair factors would introduce.
 *
 * `decimals` is the sensible display precision for that unit, not a limit on
 * the arithmetic — the full-precision value is what feeds the other rows.
 */
const UNITS = [
  { value: 'mm', label: 'Millimetres (mm)', metres: 0.001, decimals: 2 },
  { value: 'cm', label: 'Centimetres (cm)', metres: 0.01, decimals: 2 },
  { value: 'm', label: 'Metres (m)', metres: 1, decimals: 4 },
  { value: 'km', label: 'Kilometres (km)', metres: 1000, decimals: 6 },
  { value: 'in', label: 'Inches (in)', metres: 0.0254, decimals: 3 },
  { value: 'ft', label: 'Feet (ft)', metres: 0.3048, decimals: 3 },
  { value: 'yd', label: 'Yards (yd)', metres: 0.9144, decimals: 3 },
  { value: 'mi', label: 'Miles (mi)', metres: 1609.344, decimals: 6 },
  { value: 'nmi', label: 'Nautical miles (nmi)', metres: 1852, decimals: 6 },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/**
 * Trims trailing zeros after formatting so a clean conversion reads "12.7"
 * rather than "12.700". Very small and very large magnitudes fall back to
 * exponential notation, where fixed decimals would show either all zeros or an
 * unreadable run of digits.
 */
function present(value: number, decimals: number): string {
  if (value !== 0 && (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e12)) {
    return value.toExponential(4);
  }
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

export default function LengthConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState<UnitCode>('cm');
  const [to, setTo] = useState<UnitCode>('in');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null) return null;

    const metres = parsed * unitFor(from).metres;
    const target = unitFor(to);

    return {
      metres,
      converted: metres / target.metres,
      rows: UNITS.map((unit) => ({
        label: unit.label,
        value: present(metres / unit.metres, unit.decimals),
        emphasis: unit.value === to,
      })),
    };
  }, [parsed, from, to]);

  function reset() {
    setAmount('1');
    setFrom('cm');
    setTo('in');
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const fromUnit = unitFor(from);
  const toUnit = unitFor(to);

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Value"
          value={amount}
          onChange={setAmount}
          placeholder="1"
          hint="Negative values are not lengths, so they are rejected."
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
            verdict={`1 ${from} = ${present(fromUnit.metres / toUnit.metres, 6)} ${to}`}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">The same length in every unit</p>
            <ResultRows rows={result.rows} />
          </div>
        </div>
      )}

      {parsed !== null && parsed < 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a value of zero or more — a length cannot be negative.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
