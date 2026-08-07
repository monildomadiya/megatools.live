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
 * Every factor here is exact, expressed in kilograms, and every conversion goes
 * value -> kilograms -> target. Converting through a single base unit means a
 * chain like grains to long tons cannot accumulate the rounding error that a
 * table of direct pair-to-pair factors would introduce.
 *
 * The imperial and US customary values are exact because the 1959 International
 * Yard and Pound Agreement defined the pound as precisely 0.45359237 kg, and
 * every other unit in those systems is a whole-number multiple or division of
 * it: 16 ounces, 14 pounds to the stone, 7000 grains to the pound.
 *
 * `decimals` is the sensible display precision for that unit, not a limit on
 * the arithmetic — the full-precision value is what feeds the other rows.
 */
const UNITS = [
  { value: 'mg', label: 'Milligrams (mg)', kg: 0.000001, decimals: 2 },
  { value: 'g', label: 'Grams (g)', kg: 0.001, decimals: 3 },
  { value: 'kg', label: 'Kilograms (kg)', kg: 1, decimals: 4 },
  { value: 't', label: 'Metric tonnes (t)', kg: 1000, decimals: 6 },
  { value: 'gr', label: 'Grains (gr)', kg: 0.00006479891, decimals: 2 },
  { value: 'oz', label: 'Ounces (oz)', kg: 0.028349523125, decimals: 3 },
  { value: 'lb', label: 'Pounds (lb)', kg: 0.45359237, decimals: 4 },
  { value: 'st', label: 'Stone (st)', kg: 6.35029318, decimals: 5 },
  { value: 'ozt', label: 'Troy ounces (oz t)', kg: 0.0311034768, decimals: 4 },
  { value: 'ton', label: 'US short tons (2,000 lb)', kg: 907.18474, decimals: 6 },
  { value: 'lton', label: 'UK long tons (2,240 lb)', kg: 1016.0469088, decimals: 6 },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/**
 * Trims trailing zeros after formatting so a clean conversion reads "12.7"
 * rather than "12.7000". Very small and very large magnitudes fall back to
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

export default function WeightConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState<UnitCode>('kg');
  const [to, setTo] = useState<UnitCode>('lb');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null) return null;

    const kg = parsed * unitFor(from).kg;
    const target = unitFor(to);

    return {
      kg,
      converted: kg / target.kg,
      rows: UNITS.map((unit) => ({
        label: unit.label,
        value: present(kg / unit.kg, unit.decimals),
        emphasis: unit.value === to,
      })),
      // UK body weight is quoted as stone and pounds together, never as a
      // decimal number of stone. "11.29 st" is not how anyone says it.
      stoneAndPounds:
        kg > 0
          ? (() => {
              const totalPounds = kg / 0.45359237;
              const stone = Math.floor(totalPounds / 14);
              const pounds = totalPounds - stone * 14;
              return { stone, pounds };
            })()
          : null,
    };
  }, [parsed, from, to]);

  function reset() {
    setAmount('1');
    setFrom('kg');
    setTo('lb');
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const fromUnit = unitFor(from);
  const toUnit = unitFor(to);

  return (
    <CalculatorPanel label="Input · value and units">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Value"
          value={amount}
          onChange={setAmount}
          placeholder="1"
          hint="Negative values are not masses, so they are rejected."
        />
        <div className="flex items-end">
          <button type="button" onClick={swap} className="btn btn-outline btn-sm">
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
            verdict={`1 ${from} = ${present(fromUnit.kg / toUnit.kg, 6)} ${to}`}
          />

          {result.stoneAndPounds && result.stoneAndPounds.stone > 0 && (
            <div className="rounded-card border border-line bg-surface p-5">
              <p className="eyebrow eyebrow-muted">As body weight is actually said</p>
              <p className="numeric mt-3 text-xl font-bold text-ink-900">
                {result.stoneAndPounds.stone} st{' '}
                {present(result.stoneAndPounds.pounds, 1)} lb
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Stone is quoted with the remainder in pounds rather than as a decimal — no
                one says &ldquo;11.3 stone&rdquo;.
              </p>
            </div>
          )}

          <div>
            <p className="eyebrow eyebrow-muted mb-3">The same mass in every unit</p>
            <ResultRows rows={result.rows} />
          </div>
        </div>
      )}

      {parsed !== null && parsed < 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a value of zero or more — a mass cannot be negative.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
