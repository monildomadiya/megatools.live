'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { parseNumber } from '@/lib/format';

/**
 * The NICE bands for adults, from the overweight and obesity management
 * guideline. Four categories rather than a continuous score, because the whole
 * argument for this measure is that it can be applied with a tape measure and
 * no lookup table.
 *
 * The low band carries a caution rather than praise: a ratio under 0.4 can
 * indicate being underweight, and a tool that returned "excellent" for it would
 * be giving bad advice to the reader who most needs a different message.
 */
const BANDS = [
  {
    max: 0.4,
    label: 'Low central adiposity',
    tone: 'warn' as const,
    note: 'Below the healthy range. This can indicate being underweight, which is worth raising with a clinician rather than treating as a good score.',
  },
  {
    max: 0.5,
    label: 'Healthy central adiposity',
    tone: 'good' as const,
    note: 'Within the range NICE describes as healthy for adults — waist under half of height.',
  },
  {
    max: 0.6,
    label: 'Increased central adiposity',
    tone: 'warn' as const,
    note: 'NICE classes this as increased health risk. The ratio is a screening signal, not a diagnosis.',
  },
  {
    max: Infinity,
    label: 'High central adiposity',
    tone: 'bad' as const,
    note: 'NICE classes this as high health risk and a prompt to seek advice from a healthcare professional.',
  },
];

function bandFor(ratio: number) {
  return BANDS.find((band) => ratio < band.max) ?? BANDS[BANDS.length - 1]!;
}

type Units = 'metric' | 'us';

export default function WaistToHeightRatioCalculator() {
  const [units, setUnits] = useState<Units>('metric');
  const [waist, setWaist] = useState('80');
  const [height, setHeight] = useState('170');

  const parsedWaist = parseNumber(waist);
  const parsedHeight = parseNumber(height);

  const result = useMemo(() => {
    if (parsedWaist === null || parsedHeight === null) return null;
    if (parsedWaist <= 0 || parsedHeight <= 0) return null;

    // No unit conversion anywhere in here. Both inputs are lengths, so the
    // units cancel — which is the practical appeal of this measure and worth
    // preserving in the code rather than converting to a base unit for no
    // reason.
    const ratio = parsedWaist / parsedHeight;
    const band = bandFor(ratio);
    const healthyMax = parsedHeight * 0.5;

    return {
      ratio,
      band,
      healthyMax,
      difference: parsedWaist - healthyMax,
      /** Waist as a percentage of height, which some guidance states instead. */
      percentage: ratio * 100,
    };
  }, [parsedWaist, parsedHeight]);

  const unit = units === 'metric' ? 'cm' : 'in';

  function reset() {
    setUnits('metric');
    setWaist('80');
    setHeight('170');
  }

  function switchUnits(next: Units) {
    if (next === units) return;
    // Convert what is already typed rather than clearing it. Someone switching
    // units mid-entry wants the same body measured differently, not an empty
    // form.
    const factor = next === 'us' ? 1 / 2.54 : 2.54;
    if (parsedWaist !== null) setWaist((parsedWaist * factor).toFixed(1));
    if (parsedHeight !== null) setHeight((parsedHeight * factor).toFixed(1));
    setUnits(next);
  }

  return (
    <CalculatorPanel>
      <div className="mb-5">
        <UnitToggle
          label="Units"
          value={units}
          onChange={switchUnits}
          options={[
            { value: 'metric', label: 'Centimetres' },
            { value: 'us', label: 'Inches' },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Waist circumference"
          value={waist}
          onChange={setWaist}
          unit={unit}
          min={0}
          hint="Midway between your lowest rib and the top of your hip bone, at the end of a normal breath out."
        />
        <NumberField
          label="Height"
          value={height}
          onChange={setHeight}
          unit={unit}
          min={0}
          hint="Without shoes."
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Waist-to-height ratio"
            value={result.ratio.toFixed(2)}
            verdict={result.band.label}
            tone={result.band.tone}
          >
            <p className="text-sm leading-relaxed">{result.band.note}</p>
          </ResultCard>

          <ResultRows
            rows={[
              {
                label: 'Waist as a share of height',
                value: `${result.percentage.toFixed(1)}%`,
              },
              {
                label: 'Half your height',
                value: `${result.healthyMax.toFixed(1)} ${unit}`,
              },
              {
                label:
                  result.difference > 0
                    ? 'Waist above half your height by'
                    : 'Waist below half your height by',
                value: `${Math.abs(result.difference).toFixed(1)} ${unit}`,
                emphasis: true,
              },
            ]}
          />

          <div className="rounded-card border border-line bg-panel-2 p-4 text-sm leading-relaxed text-ink-600">
            <p className="font-bold text-ink-900">The NICE bands</p>
            <ul className="mt-2 space-y-1">
              <li>Below 0.4 — low, and possibly underweight</li>
              <li>0.4 to 0.49 — healthy central adiposity</li>
              <li>0.5 to 0.59 — increased central adiposity, increased risk</li>
              <li>0.6 and above — high central adiposity, high risk</li>
            </ul>
            <p className="mt-3">
              These apply to adults with a BMI under 35, and not during pregnancy. Children
              need age-specific guidance rather than the adult threshold. This is a screening
              measure and not a diagnosis — nothing here is medical advice.
            </p>
          </div>
        </div>
      )}

      {(parsedWaist !== null && parsedWaist <= 0) ||
      (parsedHeight !== null && parsedHeight <= 0) ? (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Both measurements need to be greater than zero.
        </p>
      ) : null}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
