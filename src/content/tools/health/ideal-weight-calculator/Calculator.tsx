'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
  UnitToggle,
} from '@/components/tool/fields';
import { formatNumber, parseNumber } from '@/lib/format';

type UnitSystem = 'metric' | 'us';
type Sex = 'male' | 'female';

const UNIT_OPTIONS = [
  { value: 'metric' as const, label: 'Metric' },
  { value: 'us' as const, label: 'US units' },
];

const SEX_OPTIONS = [
  { value: 'male' as const, label: 'Male' },
  { value: 'female' as const, label: 'Female' },
];

const TARGET_BMI_OPTIONS = [
  { value: '20', label: 'BMI 20 — lower half of the healthy range' },
  { value: '22', label: 'BMI 22 — middle of the healthy range' },
  { value: '24', label: 'BMI 24 — upper half of the healthy range' },
];

/**
 * The four classic equations, all of the form "base weight at 5 ft, plus a
 * fixed amount per inch above it". Kept as data rather than four functions so
 * the table below is a map over one list and the numbers sit where they can be
 * checked against the source in one glance.
 *
 * Their close agreement is not independent confirmation: Pai & Paloucek traced
 * every one of them back to the same mid-century insurance height-weight
 * tables. Showing all four is the honest way to present that.
 */
interface Formula {
  name: string;
  /** [base kg at 5 ft, kg per inch above 5 ft] */
  male: [number, number];
  female: [number, number];
}

const FORMULAS: Formula[] = [
  { name: 'Hamwi (1964)', male: [48.0, 2.7], female: [45.5, 2.2] },
  { name: 'Devine (1974)', male: [50.0, 2.3], female: [45.5, 2.3] },
  { name: 'Robinson (1983)', male: [52.0, 1.9], female: [49.0, 1.7] },
  { name: 'Miller (1983)', male: [56.2, 1.41], female: [53.1, 1.36] },
];

/** Peterson et al. 2016: weight at any target BMI, valid at any height. */
function universalIbw(targetBmi: number, metres: number): number {
  return 2.2 * targetBmi + 3.5 * targetBmi * (metres - 1.5);
}

export default function IdealWeightCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [heightCm, setHeightCm] = useState('175');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('9');
  const [targetBmi, setTargetBmi] = useState('22');

  const result = useMemo(() => {
    let totalInches: number;

    if (units === 'metric') {
      const cm = parseNumber(heightCm);
      if (cm === null || cm <= 0) return null;
      totalInches = cm / 2.54;
    } else {
      totalInches = (parseNumber(feet) ?? 0) * 12 + (parseNumber(inches) ?? 0);
      if (totalInches <= 0) return null;
    }

    const metres = totalInches * 0.0254;
    if (metres < 1.2 || metres > 2.3) return null;

    const inchesOverFiveFeet = totalInches - 60;

    const rows = FORMULAS.map((formula) => {
      const [base, perInch] = formula[sex];
      return { name: formula.name, kg: base + perInch * inchesOverFiveFeet };
    });

    const values = rows.map((row) => row.kg);
    const spread = Math.max(...values) - Math.min(...values);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
      rows,
      mean,
      spread,
      // The honest headline: a range from health outcomes, not a point from an
      // actuarial table.
      healthyLow: 18.5 * metres * metres,
      healthyHigh: 24.9 * metres * metres,
      universal: universalIbw(Number(targetBmi), metres),
      // Below five feet every classic formula is extrapolating off the end of
      // the data it was fitted to, and it needs saying on the page.
      belowRange: totalInches < 60,
    };
  }, [units, sex, heightCm, feet, inches, targetBmi]);

  function reset() {
    setHeightCm('');
    setFeet('');
    setInches('');
  }

  const mass = (kg: number) =>
    units === 'metric'
      ? `${formatNumber(kg, 1)} kg`
      : `${formatNumber(kg / 0.45359237, 1)} lb`;

  return (
    <CalculatorPanel label="Input · height">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Unit system"
          value={units}
          onChange={setUnits}
          options={UNIT_OPTIONS}
        />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <SelectField label="Sex" value={sex} onChange={setSex} options={SEX_OPTIONS} />

        {units === 'metric' ? (
          <NumberField
            label="Height"
            value={heightCm}
            onChange={setHeightCm}
            unit="cm"
            placeholder="175"
            min={0}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Height (ft)"
              value={feet}
              onChange={setFeet}
              unit="ft"
              placeholder="5"
              min={0}
              inputMode="numeric"
            />
            <NumberField
              label="Height (in)"
              value={inches}
              onChange={setInches}
              unit="in"
              placeholder="9"
              min={0}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <SelectField
            label="Target BMI for the universal equation"
            value={targetBmi}
            onChange={setTargetBmi}
            options={TARGET_BMI_OPTIONS}
            hint="Peterson's 2016 equation lets you pick the target rather than inheriting one from an insurance table."
          />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Healthy weight range for your height"
            value={`${mass(result.healthyLow)} – ${mass(result.healthyHigh)}`}
            verdict="BMI 18.5 to 24.9 — the range, not a point"
          >
            <p className="text-sm leading-relaxed text-ink-600">
              This is the only figure here derived from health outcomes rather than from
              mid-century insurance tables. There is no evidence that any single weight
              inside the range is better than the others.
            </p>
          </ResultCard>

          <ResultRows
            rows={[
              {
                label: `Universal equation at BMI ${targetBmi}`,
                value: mass(result.universal),
                emphasis: true,
              },
              ...result.rows.map((row) => ({ label: row.name, value: mass(row.kg) })),
              { label: 'Average of the four classic formulas', value: mass(result.mean) },
              { label: 'Spread between highest and lowest', value: mass(result.spread) },
            ]}
          />

          {result.belowRange && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                Below five feet, the four classic formulas are extrapolating
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                Each of them is defined as a base weight at five feet plus an amount per
                inch above it. At your height they are running backwards off the end of
                the data they were fitted to, so their answers are not meaningful. Use the
                healthy BMI range or the universal equation instead — both are valid at
                any height.
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-ink-500">
            Height is the only input any of these formulas has. None of them can see
            muscle, frame size, or where fat sits, so a well-trained person will land
            above every number here while carrying very little fat. If your build is
            unusual, a body fat measurement will tell you considerably more than an ideal
            weight will.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
