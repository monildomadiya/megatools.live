'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  UnitToggle,
} from '@/components/tool/fields';

type UnitSystem = 'metric' | 'us';

const UNIT_OPTIONS = [
  { value: 'metric' as const, label: 'Metric' },
  { value: 'us' as const, label: 'US units' },
];

/**
 * WHO adult categories. Class I/II/III obesity are split out because the health
 * implications differ substantially across that 10-point span, and lumping
 * everything above 30 into one bucket hides that.
 */
const CATEGORIES = [
  { max: 18.5, label: 'Underweight', tone: 'warn' as const },
  { max: 25, label: 'Healthy weight', tone: 'good' as const },
  { max: 30, label: 'Overweight', tone: 'warn' as const },
  { max: 35, label: 'Obesity — class I', tone: 'bad' as const },
  { max: 40, label: 'Obesity — class II', tone: 'bad' as const },
  { max: Infinity, label: 'Obesity — class III', tone: 'bad' as const },
];

function classify(bmi: number) {
  return CATEGORIES.find((c) => bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1]!;
}

/** NICE NG246 bands for central adiposity in adults. */
function classifyWaistRatio(ratio: number): { label: string; tone: 'good' | 'warn' | 'bad' } {
  if (ratio < 0.5) return { label: 'Healthy central adiposity', tone: 'good' };
  if (ratio < 0.6) return { label: 'Increased central adiposity', tone: 'warn' };
  return { label: 'High central adiposity', tone: 'bad' };
}

function toNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function BmiCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [waist, setWaist] = useState('');

  const result = useMemo(() => {
    const weightValue = toNumber(weight);
    if (weightValue === null || weightValue <= 0) return null;

    // Normalise everything to metres and kilograms, then convert back for
    // display. Doing the arithmetic in one unit system keeps the rounding
    // behaviour identical between the metric and US paths.
    let heightMetres: number | null = null;
    let weightKg: number;

    if (units === 'metric') {
      const cm = toNumber(heightCm);
      if (cm === null || cm <= 0) return null;
      heightMetres = cm / 100;
      weightKg = weightValue;
    } else {
      const ft = toNumber(feet) ?? 0;
      const inch = toNumber(inches) ?? 0;
      const totalInches = ft * 12 + inch;
      if (totalInches <= 0) return null;
      heightMetres = totalInches * 0.0254;
      weightKg = weightValue * 0.45359237;
    }

    // Guard against physically impossible inputs producing a confident-looking
    // number — a 5 cm height would otherwise return a BMI in the thousands.
    if (heightMetres < 0.5 || heightMetres > 2.6) return null;
    if (weightKg < 10 || weightKg > 500) return null;

    const bmi = weightKg / (heightMetres * heightMetres);
    const category = classify(bmi);

    const healthyMinKg = 18.5 * heightMetres * heightMetres;
    const healthyMaxKg = 24.9 * heightMetres * heightMetres;

    const waistValue = toNumber(waist);
    let waistRatio: { ratio: number; label: string; tone: 'good' | 'warn' | 'bad' } | null =
      null;

    if (waistValue !== null && waistValue > 0) {
      // Waist and height are entered in the same unit system, so the ratio is
      // unit-free as long as both come from the same branch.
      const heightInSameUnit = units === 'metric' ? heightMetres * 100 : heightMetres / 0.0254;
      const ratio = waistValue / heightInSameUnit;
      if (ratio > 0.2 && ratio < 1.2) {
        waistRatio = { ratio, ...classifyWaistRatio(ratio) };
      }
    }

    const formatWeight = (kg: number) =>
      units === 'metric'
        ? `${kg.toFixed(1)} kg`
        : `${(kg / 0.45359237).toFixed(1)} lb`;

    return {
      bmi,
      category,
      healthyRange: `${formatWeight(healthyMinKg)} – ${formatWeight(healthyMaxKg)}`,
      waistRatio,
    };
  }, [units, weight, heightCm, feet, inches, waist]);

  function reset() {
    setWeight('');
    setHeightCm('');
    setFeet('');
    setInches('');
    setWaist('');
  }

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle label="Unit system" value={units} onChange={setUnits} options={UNIT_OPTIONS} />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Weight"
          value={weight}
          onChange={setWeight}
          unit={units === 'metric' ? 'kg' : 'lb'}
          placeholder={units === 'metric' ? '70' : '154'}
          min={0}
        />

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
          <NumberField
            label="Waist circumference (optional)"
            value={waist}
            onChange={setWaist}
            unit={units === 'metric' ? 'cm' : 'in'}
            placeholder={units === 'metric' ? '84' : '33'}
            hint="Measured at the midpoint between your lowest rib and the top of your hip bone. Adds a waist-to-height ratio, which BMI alone cannot show."
            min={0}
          />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Your BMI"
            value={result.bmi.toFixed(1)}
            unit="kg/m²"
            verdict={result.category.label}
            tone={result.category.tone}
          />

          <ResultRows
            rows={[
              { label: 'Healthy weight range for your height', value: result.healthyRange },
              ...(result.waistRatio
                ? [
                    {
                      label: 'Waist-to-height ratio',
                      value: `${result.waistRatio.ratio.toFixed(2)} — ${result.waistRatio.label}`,
                      emphasis: true,
                    },
                  ]
                : []),
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            BMI is a screening measure, not a diagnosis. It does not distinguish muscle
            from fat and does not apply to children, pregnancy, or people over about 65
            in the same way. Talk to a clinician before acting on a result near a
            boundary.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
