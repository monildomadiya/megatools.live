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
 * The one converter on this site that cannot be a table of multipliers.
 *
 * Celsius and Fahrenheit are interval scales: their zeros are arbitrary points
 * rather than an absence of the quantity, so converting between them needs a
 * shift as well as a scaling. Each unit therefore carries a pair of functions
 * rather than a factor, and everything routes through kelvin — the only scale
 * here whose zero is physically meaningful.
 */
const UNITS = [
  {
    value: 'c',
    label: 'Celsius (°C)',
    symbol: '°C',
    toKelvin: (v: number) => v + 273.15,
    fromKelvin: (k: number) => k - 273.15,
  },
  {
    value: 'f',
    label: 'Fahrenheit (°F)',
    symbol: '°F',
    toKelvin: (v: number) => (v - 32) / 1.8 + 273.15,
    fromKelvin: (k: number) => (k - 273.15) * 1.8 + 32,
  },
  {
    value: 'k',
    label: 'Kelvin (K)',
    symbol: 'K',
    toKelvin: (v: number) => v,
    fromKelvin: (k: number) => k,
  },
  {
    value: 'r',
    label: 'Rankine (°R)',
    symbol: '°R',
    toKelvin: (v: number) => v / 1.8,
    fromKelvin: (k: number) => k * 1.8,
  },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/** Reference points, in kelvin, for the context strip under the result. */
const LANDMARKS = [
  { label: 'Absolute zero', kelvin: 0 },
  { label: 'Water freezes', kelvin: 273.15 },
  { label: 'Room temperature', kelvin: 293.15 },
  { label: 'Body temperature', kelvin: 310.15 },
  { label: 'Water boils (at 1 atm)', kelvin: 373.15 },
];

function present(value: number, decimals = 2): string {
  if (value !== 0 && (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e12)) {
    return value.toExponential(4);
  }
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

export default function TemperatureConverter() {
  const [amount, setAmount] = useState('20');
  const [from, setFrom] = useState<UnitCode>('c');
  const [to, setTo] = useState<UnitCode>('f');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null) return null;

    const kelvin = unitFor(from).toKelvin(parsed);

    // Below absolute zero is not an unusual temperature, it is a
    // non-existent one. Reporting a converted value for it would be
    // arithmetic dressed up as physics.
    if (kelvin < 0) return { belowAbsoluteZero: true as const, kelvin };

    const target = unitFor(to);

    return {
      // Asserted rather than widened to `boolean`, so the two returns form a
      // discriminated union and the render can narrow on this one field.
      belowAbsoluteZero: false as const,
      kelvin,
      converted: target.fromKelvin(kelvin),
      rows: UNITS.map((unit) => ({
        label: unit.label,
        value: present(unit.fromKelvin(kelvin)),
        emphasis: unit.value === to,
      })),
      // Which landmark this sits closest to, so a raw number gets some physical
      // anchoring rather than standing alone.
      nearest: LANDMARKS.reduce((closest, landmark) =>
        Math.abs(landmark.kelvin - kelvin) < Math.abs(closest.kelvin - kelvin)
          ? landmark
          : closest,
      ),
    };
  }, [parsed, from, to]);

  function reset() {
    setAmount('20');
    setFrom('c');
    setTo('f');
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const fromUnit = unitFor(from);
  const toUnit = unitFor(to);

  return (
    <CalculatorPanel label="Input · value and scales">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Temperature"
          value={amount}
          onChange={setAmount}
          placeholder="20"
          hint="Negative values are fine — unlike length or mass, temperature scales run below zero."
        />
        <div className="flex items-end">
          <button type="button" onClick={swap} className="btn btn-outline btn-sm">
            ⇄ Swap scales
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

      {result && result.belowAbsoluteZero && (
        <div className="mt-8 rounded-card border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-900">
            That is below absolute zero
          </p>
          <p className="mt-2 text-sm leading-relaxed text-red-900">
            {present(parsed ?? 0)} {fromUnit.symbol} is {present(result.kelvin)} K, and
            nothing can be colder than 0 K. Absolute zero is −273.15 °C, −459.67 °F, or
            0 °R. The arithmetic would happily produce a number here; the temperature does
            not exist.
          </p>
        </div>
      )}

      {result && !result.belowAbsoluteZero && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${present(parsed ?? 0)} ${fromUnit.symbol} in ${toUnit.label.toLowerCase()}`}
            value={present(result.converted)}
            unit={toUnit.symbol}
            verdict={`Closest reference point: ${result.nearest.label}`}
          />

          <div>
            <p className="eyebrow eyebrow-muted mb-3">The same temperature on every scale</p>
            <ResultRows rows={result.rows} />
          </div>

          <p className="text-sm leading-relaxed text-ink-500">
            A <strong>temperature</strong> and a <strong>temperature interval</strong> do
            not convert the same way. This page converts temperatures, so it applies the
            offset. For a difference — a rise of 5 degrees — only the scaling applies: 5 °C
            of change is 5 K and 9 °F, not 278.15 K.
          </p>
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
