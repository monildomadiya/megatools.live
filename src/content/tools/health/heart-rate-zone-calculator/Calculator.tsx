'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { parseNumber } from '@/lib/format';

/**
 * Ways of arriving at a maximum heart rate.
 *
 * `220 − age` is included because it is what people arrive looking for, not
 * because it is the best of these. It has no published derivation; Tanaka's
 * 2001 meta-analysis of the literature is the better estimate and is the
 * default here. Both are estimates with a standard deviation around 10 bpm,
 * which the panel says out loud — a measured maximum beats either.
 */
const METHODS = [
  {
    value: 'tanaka',
    label: 'Tanaka (2001) — 208 − 0.7 × age',
    max: (age: number) => 208 - 0.7 * age,
  },
  {
    value: 'traditional',
    label: 'Traditional — 220 − age',
    max: (age: number) => 220 - age,
  },
  {
    value: 'measured',
    label: 'A maximum I have measured',
    // Takes an age it ignores, so all three share one call signature. The
    // measured value is read from its own field instead.
    max: (_age: number) => Number.NaN,
  },
] as const;

type MethodCode = (typeof METHODS)[number]['value'];

const methodFor = (code: MethodCode) => METHODS.find((m) => m.value === code)!;

/**
 * The conventional five-zone model. The boundaries are a convention rather than
 * a physiological fact — different coaching systems draw them in different
 * places, and the training effects blend into one another either way.
 */
const ZONES = [
  {
    name: 'Zone 1 — recovery',
    low: 0.5,
    high: 0.6,
    note: 'Easy enough to hold a conversation without effort. Warm-ups, cool-downs, active recovery.',
  },
  {
    name: 'Zone 2 — aerobic base',
    low: 0.6,
    high: 0.7,
    note: 'Comfortable, sustainable for hours. Where most endurance volume belongs.',
  },
  {
    name: 'Zone 3 — tempo',
    low: 0.7,
    high: 0.8,
    note: 'Moderately hard. Feels productive, accumulates fatigue faster than it builds fitness.',
  },
  {
    name: 'Zone 4 — threshold',
    low: 0.8,
    high: 0.9,
    note: 'Hard, sustainable for perhaps an hour at the top end. Raises the pace you can hold.',
  },
  {
    name: 'Zone 5 — maximal',
    low: 0.9,
    high: 1.0,
    note: 'Very hard, minutes at most. Short intervals with full recovery between them.',
  },
] as const;

type Basis = 'max' | 'reserve';

export default function HeartRateZoneCalculator() {
  const [age, setAge] = useState('40');
  const [method, setMethod] = useState<MethodCode>('tanaka');
  const [measured, setMeasured] = useState('185');
  const [resting, setResting] = useState('60');
  const [basis, setBasis] = useState<Basis>('max');

  const parsedAge = parseNumber(age);
  const parsedMeasured = parseNumber(measured);
  const parsedResting = parseNumber(resting);

  const result = useMemo(() => {
    const maxHr =
      method === 'measured'
        ? parsedMeasured
        : parsedAge === null || parsedAge < 5 || parsedAge > 120
          ? null
          : methodFor(method).max(parsedAge);

    if (maxHr === null || !Number.isFinite(maxHr) || maxHr < 80 || maxHr > 230) return null;

    const rest = parsedResting !== null && parsedResting >= 25 && parsedResting <= 120 ? parsedResting : null;
    // Heart rate reserve is only available with a resting rate, so the basis
    // silently falls back rather than reporting zones built on a missing input.
    const useReserve = basis === 'reserve' && rest !== null;
    const reserve = rest === null ? null : maxHr - rest;

    const bound = (fraction: number) =>
      useReserve && rest !== null ? rest + (maxHr - rest) * fraction : maxHr * fraction;

    return {
      maxHr,
      rest,
      reserve,
      useReserve,
      zones: ZONES.map((zone) => ({
        ...zone,
        from: Math.round(bound(zone.low)),
        to: Math.round(bound(zone.high)),
      })),
    };
  }, [method, parsedAge, parsedMeasured, parsedResting, basis]);

  function reset() {
    setAge('40');
    setMethod('tanaka');
    setMeasured('185');
    setResting('60');
    setBasis('max');
  }

  return (
    <CalculatorPanel>
      <div className="mb-5">
        <UnitToggle
          label="Zones based on"
          value={basis}
          onChange={setBasis}
          options={[
            { value: 'max', label: '% of maximum' },
            { value: 'reserve', label: '% of reserve (Karvonen)' },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Maximum heart rate from"
          value={method}
          onChange={setMethod}
          options={METHODS.map((m) => ({ value: m.value, label: m.label }))}
        />

        {method === 'measured' ? (
          <NumberField
            label="Measured maximum"
            value={measured}
            onChange={setMeasured}
            unit="bpm"
            min={80}
            max={230}
            inputMode="numeric"
            hint="The highest rate you have actually seen, from a hard effort or a test."
          />
        ) : (
          <NumberField
            label="Age"
            value={age}
            onChange={setAge}
            unit="years"
            min={5}
            max={120}
            inputMode="numeric"
          />
        )}

        <NumberField
          label="Resting heart rate"
          value={resting}
          onChange={setResting}
          unit="bpm"
          min={25}
          max={120}
          inputMode="numeric"
          hint="Measured before getting up, averaged over a few mornings. Needed for Karvonen zones."
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={method === 'measured' ? 'Measured maximum heart rate' : 'Estimated maximum heart rate'}
            value={String(Math.round(result.maxHr))}
            unit="bpm"
            verdict={
              method === 'measured'
                ? result.useReserve
                  ? `Heart rate reserve ${result.reserve} bpm — zones set by the Karvonen method`
                  : 'Zones set as percentages of this maximum'
                : 'An estimate with a standard deviation around 10 bpm — treat the zones as bands, not thresholds'
            }
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              {result.useReserve
                ? 'Zones as percentages of heart rate reserve'
                : 'Zones as percentages of maximum heart rate'}
            </p>
            <ol className="overflow-hidden rounded-card border border-line bg-panel">
              {result.zones.map((zone) => (
                <li
                  key={zone.name}
                  className="border-t border-line-soft px-5 py-4 first:border-t-0"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold text-ink-900">{zone.name}</span>
                    <span className="numeric shrink-0 text-base font-bold text-ink-900">
                      {zone.from}–{zone.to} bpm
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    {Math.round(zone.low * 100)}–{Math.round(zone.high * 100)}% · {zone.note}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <ResultRows
            rows={[
              { label: 'Maximum heart rate', value: `${Math.round(result.maxHr)} bpm`, emphasis: true },
              {
                label: 'Resting heart rate',
                value: result.rest === null ? 'not entered' : `${result.rest} bpm`,
              },
              {
                label: 'Heart rate reserve',
                value: result.reserve === null ? 'needs a resting rate' : `${Math.round(result.reserve)} bpm`,
              },
              {
                label: 'Moderate-intensity band (AHA, 50–70% of max)',
                value: `${Math.round(result.maxHr * 0.5)}–${Math.round(result.maxHr * 0.7)} bpm`,
              },
              {
                label: 'Vigorous band (AHA, 70–85% of max)',
                value: `${Math.round(result.maxHr * 0.7)}–${Math.round(result.maxHr * 0.85)} bpm`,
              },
            ]}
          />

          {basis === 'reserve' && !result.useReserve && (
            <p
              role="alert"
              className="rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800"
            >
              Karvonen zones need a resting heart rate between 25 and 120. Without one the
              zones above are percentages of maximum instead.
            </p>
          )}

          {method === 'traditional' && (
            <p className="text-sm leading-relaxed text-ink-500">
              220 − age has no published derivation and drifts from the data at both ends of
              the age range: it over-estimates in the young and under-estimates in the old.
              Tanaka&rsquo;s 208 − 0.7 × age is the better estimate and is one option up in the
              list.
            </p>
          )}
        </div>
      )}

      {result === null && (
        <p className="mt-6 text-sm leading-relaxed text-ink-500">
          Enter an age between 5 and 120, or a measured maximum between 80 and 230 bpm.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
