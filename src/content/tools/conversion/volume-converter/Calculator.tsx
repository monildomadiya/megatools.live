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
 * Every factor is the exact defined value expressed in litres, and every
 * conversion goes value -> litres -> target. The litre is the right base here
 * even though it is not the SI unit: since 1964 it has been exactly one cubic
 * decimetre, so nothing is lost by using it, and it keeps the metric factors
 * readable as powers of ten.
 *
 * The US and imperial units are listed separately and never merged. They share
 * names — gallon, pint, fluid ounce — while differing by up to 20%, so a single
 * "pint" entry would be the one thing this converter must not offer.
 */
const UNITS = [
  { value: 'mL', label: 'Millilitres (mL)', litres: 0.001, decimals: 3 },
  { value: 'cm³', label: 'Cubic centimetres (cm³, cc)', litres: 0.001, decimals: 3 },
  { value: 'L', label: 'Litres (L)', litres: 1, decimals: 4 },
  { value: 'm³', label: 'Cubic metres (m³)', litres: 1000, decimals: 6 },
  { value: 'tsp', label: 'Teaspoons (US)', litres: 0.00492892159375, decimals: 2 },
  { value: 'tbsp', label: 'Tablespoons (US)', litres: 0.01478676478125, decimals: 2 },
  { value: 'fl oz US', label: 'Fluid ounces (US)', litres: 0.0295735295625, decimals: 3 },
  { value: 'cup', label: 'Cups (US customary)', litres: 0.2365882365, decimals: 3 },
  { value: 'pt US', label: 'Pints (US liquid)', litres: 0.473176473, decimals: 4 },
  { value: 'qt US', label: 'Quarts (US liquid)', litres: 0.946352946, decimals: 4 },
  { value: 'gal US', label: 'Gallons (US liquid)', litres: 3.785411784, decimals: 5 },
  { value: 'fl oz imp', label: 'Fluid ounces (imperial)', litres: 0.0284130625, decimals: 3 },
  { value: 'pt imp', label: 'Pints (imperial)', litres: 0.56826125, decimals: 4 },
  { value: 'gal imp', label: 'Gallons (imperial)', litres: 4.54609, decimals: 5 },
  { value: 'in³', label: 'Cubic inches (in³)', litres: 0.016387064, decimals: 3 },
  { value: 'ft³', label: 'Cubic feet (ft³)', litres: 28.316846592, decimals: 5 },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/**
 * Trims trailing zeros after formatting so a clean conversion reads "236.588"
 * rather than "236.5880". Very small and very large magnitudes fall back to
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

export default function VolumeConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState<UnitCode>('cup');
  const [to, setTo] = useState<UnitCode>('mL');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null) return null;

    const litres = parsed * unitFor(from).litres;
    const target = unitFor(to);

    return {
      litres,
      converted: litres / target.litres,
      rows: UNITS.map((unit) => ({
        label: unit.label,
        value: present(litres / unit.litres, unit.decimals),
        emphasis: unit.value === to,
      })),
    };
  }, [parsed, from, to]);

  function reset() {
    setAmount('1');
    setFrom('cup');
    setTo('mL');
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
          hint="Negative values are not volumes, so they are rejected."
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
            verdict={`1 ${from} = ${present(fromUnit.litres / toUnit.litres, 6)} ${to}`}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">The same volume in every unit</p>
            <ResultRows rows={result.rows} />
          </div>
        </div>
      )}

      {parsed !== null && parsed < 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a value of zero or more — a volume cannot be negative.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
