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
 * Factors are square metres per unit, and each imperial value is the exact
 * square of the exact length factor rather than a rounded area constant:
 * 0.3048² = 0.09290304 for the square foot, 43,560 of those for the acre.
 *
 * Writing them out squared is the whole point of the page — the error this tool
 * exists to prevent is applying a length factor to an area.
 */
const UNITS = [
  { value: 'mm2', label: 'Square millimetres (mm²)', sqm: 0.000001, decimals: 2 },
  { value: 'cm2', label: 'Square centimetres (cm²)', sqm: 0.0001, decimals: 2 },
  { value: 'm2', label: 'Square metres (m²)', sqm: 1, decimals: 4 },
  { value: 'ha', label: 'Hectares (ha)', sqm: 10000, decimals: 6 },
  { value: 'km2', label: 'Square kilometres (km²)', sqm: 1000000, decimals: 8 },
  { value: 'in2', label: 'Square inches (in²)', sqm: 0.00064516, decimals: 2 },
  { value: 'ft2', label: 'Square feet (ft²)', sqm: 0.09290304, decimals: 3 },
  { value: 'yd2', label: 'Square yards (yd²)', sqm: 0.83612736, decimals: 4 },
  { value: 'ac', label: 'Acres (ac)', sqm: 4046.8564224, decimals: 6 },
  { value: 'mi2', label: 'Square miles (mi²)', sqm: 2589988.110336, decimals: 8 },
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

export default function AreaConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState<UnitCode>('m2');
  const [to, setTo] = useState<UnitCode>('ft2');

  // Optional length × width helper. People arrive with two wall measurements
  // far more often than with an area, and making them multiply first is a step
  // where the units quietly get mixed.
  const [side, setSide] = useState<'m' | 'ft'>('m');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null || parsed < 0) return null;

    const sqm = parsed * unitFor(from).sqm;
    const target = unitFor(to);

    return {
      converted: sqm / target.sqm,
      rows: UNITS.map((unit) => ({
        label: unit.label,
        value: present(sqm / unit.sqm, unit.decimals),
        emphasis: unit.value === to,
      })),
    };
  }, [parsed, from, to]);

  const room = useMemo(() => {
    const l = parseNumber(length);
    const w = parseNumber(width);
    if (l === null || w === null || l <= 0 || w <= 0) return null;

    const perSide = side === 'm' ? 1 : 0.3048;
    const sqm = l * perSide * (w * perSide);

    return {
      sqm,
      sqft: sqm / 0.09290304,
      unit: side,
    };
  }, [length, width, side]);

  function reset() {
    setAmount('1');
    setFrom('m2');
    setTo('ft2');
    setLength('');
    setWidth('');
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
          label="Area"
          value={amount}
          onChange={setAmount}
          placeholder="1"
          hint="Negative values are not areas, so they are rejected."
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

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${present(parsed!, fromUnit.decimals)} ${fromUnit.label.toLowerCase()} converted`}
            value={present(result.converted, toUnit.decimals)}
            unit={toUnit.label.replace(/^.*\(|\)$/g, '')}
            verdict={`1 ${fromUnit.label.replace(/^.*\(|\)$/g, '')} = ${present(
              fromUnit.sqm / toUnit.sqm,
              6,
            )} ${toUnit.label.replace(/^.*\(|\)$/g, '')}`}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">The same area in every unit</p>
            <ResultRows rows={result.rows} />
          </div>
        </div>
      )}

      {parsed !== null && parsed < 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a value of zero or more — an area cannot be negative.
        </p>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink-800">
          Work out an area from two measurements
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">
          For a rectangular room or plot. Split an irregular shape into rectangles and add
          the results.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <NumberField
            label="Length"
            value={length}
            onChange={setLength}
            unit={side}
            placeholder={side === 'm' ? '4.2' : '14'}
            min={0}
          />
          <NumberField
            label="Width"
            value={width}
            onChange={setWidth}
            unit={side}
            placeholder={side === 'm' ? '3.6' : '12'}
            min={0}
          />
          <SelectField
            label="Measured in"
            value={side}
            onChange={setSide}
            options={[
              { value: 'm' as const, label: 'Metres' },
              { value: 'ft' as const, label: 'Feet' },
            ]}
          />
        </div>

        {room && (
          <div className="mt-4">
            <ResultRows
              rows={[
                { label: 'Area', value: `${present(room.sqm, 3)} m²`, emphasis: true },
                { label: 'Area', value: `${present(room.sqft, 2)} ft²`, emphasis: true },
                { label: 'Plus 10% waste allowance', value: `${present(room.sqm * 1.1, 3)} m²` },
              ]}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
