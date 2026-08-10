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
 * Pascals per unit, with every conversion going value -> pascals -> target.
 *
 * The imperial and legacy factors are exact rather than rounded: psi follows
 * from the pound-force being exactly 4.4482216152605 N over exactly 0.00064516
 * m², and mmHg from a conventional mercury density of 13,595.1 kg/m³ under
 * standard gravity. The torr and the millimetre of mercury are listed
 * separately because they are defined differently — 1/760 atm against that
 * mercury column — even though they agree to one part in seven million.
 */
const UNITS = [
  { value: 'Pa', label: 'Pascals (Pa)', pascals: 1, decimals: 2 },
  { value: 'hPa', label: 'Hectopascals (hPa)', pascals: 100, decimals: 4 },
  { value: 'kPa', label: 'Kilopascals (kPa)', pascals: 1000, decimals: 5 },
  { value: 'MPa', label: 'Megapascals (MPa)', pascals: 1e6, decimals: 8 },
  { value: 'mbar', label: 'Millibars (mbar)', pascals: 100, decimals: 4 },
  { value: 'bar', label: 'Bar', pascals: 100000, decimals: 6 },
  { value: 'atm', label: 'Atmospheres (atm)', pascals: 101325, decimals: 6 },
  { value: 'Torr', label: 'Torr', pascals: 101325 / 760, decimals: 4 },
  { value: 'mmHg', label: 'Millimetres of mercury (mmHg)', pascals: 133.322387415, decimals: 4 },
  { value: 'psi', label: 'Pounds per square inch (psi)', pascals: 6894.757293168361, decimals: 5 },
  { value: 'inHg', label: 'Inches of mercury (inHg)', pascals: 3386.389, decimals: 5 },
  { value: 'kgf/cm²', label: 'Kilograms-force per cm² (kgf/cm²)', pascals: 98066.5, decimals: 6 },
  { value: 'cmH₂O', label: 'Centimetres of water (cmH₂O)', pascals: 98.0665, decimals: 4 },
  { value: 'inH₂O', label: 'Inches of water (inH₂O)', pascals: 249.0889, decimals: 4 },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/** One standard atmosphere, the offset between gauge and absolute pressure. */
const ATMOSPHERE_PA = 101325;

function present(value: number, decimals: number): string {
  if (value !== 0 && (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e12)) {
    return value.toExponential(4);
  }
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

export default function PressureConverter() {
  const [amount, setAmount] = useState('32');
  const [from, setFrom] = useState<UnitCode>('psi');
  const [to, setTo] = useState<UnitCode>('bar');
  // Defaults to gauge because the reading a person has in front of them almost
  // always came off a gauge: a tyre, a pump, a boiler, a cylinder.
  const [gauge, setGauge] = useState(true);

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null) return null;

    const pascals = parsed * unitFor(from).pascals;
    const target = unitFor(to);

    return {
      pascals,
      converted: pascals / target.pascals,
      // A gauge reading is a difference from ambient, so the conversion itself
      // is unaffected — only the absolute equivalent needs the offset.
      absolutePascals: gauge ? pascals + ATMOSPHERE_PA : pascals,
      rows: UNITS.map((unit) => ({
        label: unit.label,
        value: present(pascals / unit.pascals, unit.decimals),
        emphasis: unit.value === to,
      })),
    };
  }, [parsed, from, to, gauge]);

  function reset() {
    setAmount('32');
    setFrom('psi');
    setTo('bar');
    setGauge(true);
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
          placeholder="32"
          hint="Negative values are allowed — a vacuum reads below ambient on a gauge."
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

      <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
        <input
          type="checkbox"
          checked={gauge}
          onChange={(event) => setGauge(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-brand-solid"
        />
        <span className="text-ink-800">
          This is a gauge reading (relative to atmosphere)
          <span className="mt-0.5 block text-ink-500">
            Tyre, pump, boiler and cylinder gauges all read zero in open air. Tick this and
            the absolute equivalent is shown alongside the conversion.
          </span>
        </span>
      </label>

      {result && parsed !== null && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${present(parsed, fromUnit.decimals)} ${from} in ${toUnit.label.toLowerCase()}`}
            value={present(result.converted, toUnit.decimals)}
            unit={to}
            verdict={`1 ${from} = ${present(fromUnit.pascals / toUnit.pascals, 6)} ${to}`}
          />

          {gauge && (
            <ResultRows
              rows={[
                {
                  label: `Gauge pressure (${to})`,
                  value: present(result.converted, toUnit.decimals),
                  emphasis: true,
                },
                {
                  label: `Absolute pressure (${to})`,
                  value: present(result.absolutePascals / toUnit.pascals, toUnit.decimals),
                  emphasis: true,
                },
                {
                  label: 'Atmosphere added',
                  value: `${present(ATMOSPHERE_PA / toUnit.pascals, toUnit.decimals)} ${to}`,
                },
              ]}
            />
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              The same {gauge ? 'gauge ' : ''}pressure in every unit
            </p>
            <ResultRows rows={result.rows} />
          </div>
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
