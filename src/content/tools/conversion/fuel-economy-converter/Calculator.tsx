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
 * Every factor here is exact by definition rather than rounded: the US liquid
 * gallon is 231 cubic inches, which is 3.785411784 litres; the imperial gallon
 * is 4.54609 litres by the Weights and Measures Act; the international mile is
 * 1609.344 metres. The familiar 235.2 and 282.5 constants are derived from
 * these below rather than typed in, so the definition is the thing on the page.
 */
const L_PER_US_GAL = 3.785411784;
const L_PER_IMP_GAL = 4.54609;
const KM_PER_MILE = 1.609344;

/**
 * Litres per 100 km is the canonical form.
 *
 * It has to be a fuel-per-distance measure rather than a distance-per-fuel one,
 * because that is the direction that stays linear: two consumption figures can
 * be averaged or subtracted, two mpg figures cannot.
 */
const UNITS = [
  {
    value: 'mpgUS',
    label: 'Miles per US gallon (US mpg)',
    short: 'US mpg',
    reciprocal: true,
    /** Multiply the reciprocal by this to reach litres per 100 km. */
    constant: (100 * L_PER_US_GAL) / KM_PER_MILE,
    decimals: 2,
  },
  {
    value: 'mpgUK',
    label: 'Miles per imperial gallon (UK mpg)',
    short: 'UK mpg',
    reciprocal: true,
    constant: (100 * L_PER_IMP_GAL) / KM_PER_MILE,
    decimals: 2,
  },
  {
    value: 'kmL',
    label: 'Kilometres per litre (km/L)',
    short: 'km/L',
    reciprocal: true,
    constant: 100,
    decimals: 3,
  },
  {
    value: 'l100km',
    label: 'Litres per 100 km (L/100 km)',
    short: 'L/100 km',
    reciprocal: false,
    constant: 1,
    decimals: 3,
  },
  {
    value: 'gal100mi',
    label: 'US gallons per 100 miles (gal/100 mi)',
    short: 'gal/100 mi',
    reciprocal: false,
    constant: L_PER_US_GAL / KM_PER_MILE,
    decimals: 3,
  },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/** Value in the given unit → litres per 100 km. */
function toL100(value: number, code: UnitCode): number {
  const unit = unitFor(code);
  return unit.reciprocal ? unit.constant / value : value * unit.constant;
}

/** Litres per 100 km → value in the given unit. */
function fromL100(l100: number, code: UnitCode): number {
  const unit = unitFor(code);
  return unit.reciprocal ? unit.constant / l100 : l100 / unit.constant;
}

function present(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value !== 0 && (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e9)) {
    return value.toExponential(3);
  }
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

export default function FuelEconomyConverter() {
  const [amount, setAmount] = useState('40');
  const [unit, setUnit] = useState<UnitCode>('mpgUS');

  // The comparison is the point of the page rather than a bolt-on: mpg is
  // readable on its own and misleading the moment two of them are set side by
  // side, and that is where every purchase decision happens.
  const [rival, setRival] = useState('50');
  const [distance, setDistance] = useState('12000');
  const [distanceUnit, setDistanceUnit] = useState<'mi' | 'km'>('mi');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null || parsed <= 0) return null;
    const l100 = toL100(parsed, unit);

    return {
      l100,
      rows: UNITS.filter((u) => u.value !== unit).map((u) => ({
        label: u.label,
        value: present(fromL100(l100, u.value), u.decimals),
      })),
    };
  }, [parsed, unit]);

  const comparison = useMemo(() => {
    const rivalValue = parseNumber(rival);
    const distanceValue = parseNumber(distance);
    if (parsed === null || parsed <= 0) return null;
    if (rivalValue === null || rivalValue <= 0) return null;
    if (distanceValue === null || distanceValue <= 0) return null;

    const km = distanceUnit === 'mi' ? distanceValue * KM_PER_MILE : distanceValue;
    const mineL = (toL100(parsed, unit) * km) / 100;
    const rivalL = (toL100(rivalValue, unit) * km) / 100;

    return {
      rivalValue,
      km,
      mineL,
      rivalL,
      savedL: mineL - rivalL,
      savedPct: mineL === 0 ? 0 : ((mineL - rivalL) / mineL) * 100,
    };
  }, [rival, distance, distanceUnit, parsed, unit]);

  function reset() {
    setAmount('40');
    setUnit('mpgUS');
    setRival('50');
    setDistance('12000');
    setDistanceUnit('mi');
  }

  const current = unitFor(unit);

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Fuel economy"
          value={amount}
          onChange={setAmount}
          placeholder="40"
          min={0}
          hint="Zero and negative figures are rejected — the conversion divides by this."
        />
        <SelectField
          label="Measured in"
          value={unit}
          onChange={setUnit}
          options={UNITS.map((u) => ({ value: u.value, label: u.label }))}
        />
      </div>

      {parsed !== null && parsed <= 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a figure above zero. Distance per fuel and fuel per distance are reciprocals,
          so zero has no counterpart in the other direction.
        </p>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${present(parsed!, current.decimals)} ${current.short} is`}
            value={present(result.l100, 2)}
            unit="L/100 km"
            verdict={`${present(fromL100(result.l100, 'mpgUS'), 1)} US mpg · ${present(
              fromL100(result.l100, 'mpgUK'),
              1,
            )} UK mpg · ${present(fromL100(result.l100, 'kmL'), 2)} km/L`}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">The same economy, every measure</p>
            <ResultRows rows={result.rows} />
          </div>

          <ResultRows
            rows={[
              {
                label: 'Fuel used over 10,000 km',
                value: `${present(result.l100 * 100, 0)} litres`,
                emphasis: true,
              },
              {
                label: 'Fuel used over 10,000 miles',
                value: `${present(result.l100 * 100 * KM_PER_MILE, 0)} litres (${present(
                  (result.l100 * 100 * KM_PER_MILE) / L_PER_US_GAL,
                  0,
                )} US gal)`,
              },
              {
                label: 'Distance on 50 litres',
                value: `${present(5000 / result.l100, 0)} km · ${present(
                  5000 / result.l100 / KM_PER_MILE,
                  0,
                )} mi`,
              },
            ]}
          />
        </div>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink-800">Compare it against another vehicle</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">
          Same unit as above. The fuel figures are what the difference is actually worth — the
          gap in {current.short} on its own is not proportional to it.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <NumberField
            label={`Second vehicle (${current.short})`}
            value={rival}
            onChange={setRival}
            min={0}
          />
          <NumberField
            label="Distance per year"
            value={distance}
            onChange={setDistance}
            min={0}
            inputMode="numeric"
          />
          <SelectField
            label="Distance in"
            value={distanceUnit}
            onChange={setDistanceUnit}
            options={[
              { value: 'mi' as const, label: 'Miles' },
              { value: 'km' as const, label: 'Kilometres' },
            ]}
          />
        </div>

        {comparison && (
          <div className="mt-4 space-y-3">
            <ResultRows
              rows={[
                {
                  label: `At ${present(parsed!, current.decimals)} ${current.short}`,
                  value: `${present(comparison.mineL, 0)} litres a year`,
                },
                {
                  label: `At ${present(comparison.rivalValue, current.decimals)} ${current.short}`,
                  value: `${present(comparison.rivalL, 0)} litres a year`,
                },
                {
                  label: 'Difference',
                  value: `${present(Math.abs(comparison.savedL), 0)} litres (${present(
                    Math.abs(comparison.savedPct),
                    1,
                  )}%)`,
                  emphasis: true,
                },
              ]}
            />
            {current.reciprocal && (
              <p className="text-sm leading-relaxed text-ink-500">
                Both figures are quoted as distance per unit of fuel, so the same gap is worth
                very different amounts depending on where it sits. Ten mpg gained at the low
                end of the scale saves several times what ten mpg gained at the high end does,
                over the same distance — which is why the litres are shown rather than left to
                be inferred.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
