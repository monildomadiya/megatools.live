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
 * Factors are metres per second per unit. Every one is exact by definition —
 * km/h is 1000/3600, mph is 1609.344/3600, a knot is 1852/3600 — except Mach,
 * which is not a unit of speed at all but a ratio against the local speed of
 * sound. It is included because people look for it, pinned to the ISA sea-level
 * value, and labelled so the assumption is visible in the dropdown itself.
 */
const UNITS = [
  { value: 'ms', label: 'Metres per second (m/s)', mps: 1, decimals: 4, short: 'm/s' },
  { value: 'kmh', label: 'Kilometres per hour (km/h)', mps: 1000 / 3600, decimals: 3, short: 'km/h' },
  { value: 'mph', label: 'Miles per hour (mph)', mps: 1609.344 / 3600, decimals: 3, short: 'mph' },
  { value: 'fts', label: 'Feet per second (ft/s)', mps: 0.3048, decimals: 3, short: 'ft/s' },
  { value: 'kn', label: 'Knots (kn)', mps: 1852 / 3600, decimals: 3, short: 'kn' },
  {
    value: 'mach',
    label: 'Mach (ISA sea level, 15 °C)',
    mps: 340.29,
    decimals: 4,
    short: 'Mach',
  },
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

/** Seconds per distance unit, rendered as the m:ss athletes actually use. */
function pace(secondsPerUnit: number): string {
  if (!Number.isFinite(secondsPerUnit) || secondsPerUnit <= 0) return '—';
  if (secondsPerUnit >= 36000) return 'over 10:00:00';
  const total = Math.round(secondsPerUnit);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(hours > 0 ? 2 : 1, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function SpeedConverter() {
  const [amount, setAmount] = useState('60');
  const [from, setFrom] = useState<UnitCode>('mph');
  const [to, setTo] = useState<UnitCode>('kmh');

  // Pace entry, for the runners and cyclists who think in minutes per unit
  // rather than in units per hour. Stored as two fields because that is how a
  // watch displays it and how people read it off one.
  const [paceMin, setPaceMin] = useState('');
  const [paceSec, setPaceSec] = useState('');
  const [paceUnit, setPaceUnit] = useState<'km' | 'mi'>('km');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null || parsed < 0) return null;

    const mps = parsed * unitFor(from).mps;
    const target = unitFor(to);

    return {
      mps,
      converted: mps / target.mps,
      rows: UNITS.map((unit) => ({
        label: unit.label,
        value: present(mps / unit.mps, unit.decimals),
        emphasis: unit.value === to,
      })),
      pacePerKm: mps > 0 ? 1000 / mps : Infinity,
      pacePerMile: mps > 0 ? 1609.344 / mps : Infinity,
    };
  }, [parsed, from, to]);

  const fromPace = useMemo(() => {
    const minutes = parseNumber(paceMin);
    const seconds = parseNumber(paceSec) ?? 0;
    if (minutes === null || minutes < 0 || seconds < 0 || seconds >= 60) return null;

    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 0) return null;

    const metres = paceUnit === 'km' ? 1000 : 1609.344;
    const mps = metres / totalSeconds;

    return {
      mps,
      kmh: mps / (1000 / 3600),
      mph: mps / (1609.344 / 3600),
      otherPace: paceUnit === 'km' ? (totalSeconds * 1609.344) / 1000 : (totalSeconds * 1000) / 1609.344,
    };
  }, [paceMin, paceSec, paceUnit]);

  function reset() {
    setAmount('60');
    setFrom('mph');
    setTo('kmh');
    setPaceMin('');
    setPaceSec('');
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
          label="Speed"
          value={amount}
          onChange={setAmount}
          placeholder="60"
          hint="Speed is a magnitude, so negative values are rejected."
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
            label={`${present(parsed!, fromUnit.decimals)} ${fromUnit.short} converted`}
            value={present(result.converted, toUnit.decimals)}
            unit={toUnit.short}
            verdict={`1 ${fromUnit.short} = ${present(fromUnit.mps / toUnit.mps, 6)} ${toUnit.short}`}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">The same speed in every unit</p>
            <ResultRows rows={result.rows} />
          </div>
          <ResultRows
            rows={[
              { label: 'Pace per kilometre', value: `${pace(result.pacePerKm)} min/km` },
              { label: 'Pace per mile', value: `${pace(result.pacePerMile)} min/mi` },
              {
                label: 'Distance covered in one minute',
                value: `${present(result.mps * 60, 1)} m`,
              },
            ]}
          />
        </div>
      )}

      {parsed !== null && parsed < 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a value of zero or more — a speed cannot be negative.
        </p>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink-800">Start from a pace instead</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">
          Enter the minutes and seconds a watch shows for one kilometre or one mile.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <NumberField
            label="Minutes"
            value={paceMin}
            onChange={setPaceMin}
            unit="min"
            placeholder="5"
            min={0}
            inputMode="numeric"
          />
          <NumberField
            label="Seconds"
            value={paceSec}
            onChange={setPaceSec}
            unit="sec"
            placeholder="30"
            min={0}
            max={59}
            inputMode="numeric"
          />
          <SelectField
            label="Per"
            value={paceUnit}
            onChange={setPaceUnit}
            options={[
              { value: 'km' as const, label: 'Kilometre' },
              { value: 'mi' as const, label: 'Mile' },
            ]}
          />
        </div>

        {fromPace && (
          <div className="mt-4">
            <ResultRows
              rows={[
                { label: 'Speed', value: `${present(fromPace.kmh, 2)} km/h`, emphasis: true },
                { label: 'Speed', value: `${present(fromPace.mph, 2)} mph`, emphasis: true },
                { label: 'Speed', value: `${present(fromPace.mps, 2)} m/s` },
                {
                  label: paceUnit === 'km' ? 'Pace per mile' : 'Pace per kilometre',
                  value: pace(fromPace.otherPace),
                },
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
