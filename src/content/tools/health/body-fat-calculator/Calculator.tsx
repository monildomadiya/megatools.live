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

/**
 * American Council on Exercise categories. Ordered low to high and read with a
 * `find` on the upper bound, so the boundaries are unambiguous rather than
 * depending on which comparison happens to run first.
 *
 * Essential fat is deliberately toned as a warning rather than as a good
 * result: it is the physiological floor, not a target, and a reader landing
 * there should be prompted to look into it rather than congratulated.
 */
const ACE_CATEGORIES = {
  male: [
    { max: 6, label: 'Essential fat — below the healthy floor', tone: 'bad' as const },
    { max: 14, label: 'Athletic range', tone: 'good' as const },
    { max: 18, label: 'Fitness range', tone: 'good' as const },
    { max: 25, label: 'Acceptable range', tone: 'warn' as const },
    { max: Infinity, label: 'Obese range', tone: 'bad' as const },
  ],
  female: [
    { max: 14, label: 'Essential fat — below the healthy floor', tone: 'bad' as const },
    { max: 21, label: 'Athletic range', tone: 'good' as const },
    { max: 25, label: 'Fitness range', tone: 'good' as const },
    { max: 32, label: 'Acceptable range', tone: 'warn' as const },
    { max: Infinity, label: 'Obese range', tone: 'bad' as const },
  ],
};

function classify(percent: number, sex: Sex) {
  const bands = ACE_CATEGORIES[sex];
  return bands.find((band) => percent < band.max) ?? bands[bands.length - 1]!;
}

/**
 * Hodgdon & Beckett, Naval Health Research Center reports 84-11 (men) and
 * 84-29 (women).
 *
 * Everything is converted to inches before the equation runs rather than using
 * one of the metric restatements in circulation. The constants are fitted to
 * log10 of a length in inches, and because the waist and height terms carry
 * different coefficients, feeding centimetres in shifts the result by a fixed
 * amount instead of cancelling out. Converting first keeps this the equation
 * the Navy actually published.
 */
function navyBodyFat(
  sex: Sex,
  heightIn: number,
  neckIn: number,
  waistIn: number,
  hipIn: number,
): number | null {
  if (sex === 'male') {
    const girth = waistIn - neckIn;
    if (girth <= 0) return null;
    return (
      495 / (1.0324 - 0.19077 * Math.log10(girth) + 0.15456 * Math.log10(heightIn)) - 450
    );
  }

  const girth = waistIn + hipIn - neckIn;
  if (girth <= 0) return null;
  return (
    495 / (1.29579 - 0.35004 * Math.log10(girth) + 0.221 * Math.log10(heightIn)) - 450
  );
}

/** Deurenberg 1991, adult form: BF% = 1.20·BMI + 0.23·age − 10.8·sex − 5.4. */
function deurenberg(bmi: number, age: number, sex: Sex): number {
  return 1.2 * bmi + 0.23 * age - 10.8 * (sex === 'male' ? 1 : 0) - 5.4;
}

export default function BodyFatCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('80');
  const [height, setHeight] = useState('180');
  const [neck, setNeck] = useState('38');
  const [waist, setWaist] = useState('88');
  const [hip, setHip] = useState('98');

  const result = useMemo(() => {
    const ageValue = parseNumber(age);
    const weightValue = parseNumber(weight);
    const heightValue = parseNumber(height);
    const neckValue = parseNumber(neck);
    const waistValue = parseNumber(waist);
    const hipValue = parseNumber(hip);

    if (ageValue === null || ageValue < 15 || ageValue > 100) return null;
    if (weightValue === null || weightValue <= 0) return null;
    if (heightValue === null || heightValue <= 0) return null;
    if (neckValue === null || neckValue <= 0) return null;
    if (waistValue === null || waistValue <= 0) return null;
    if (sex === 'female' && (hipValue === null || hipValue <= 0)) return null;

    // One internal unit system for the arithmetic, converted back only for
    // display. Doing it the other way means two code paths that can round
    // differently and quietly disagree.
    const toIn = units === 'metric' ? 1 / 2.54 : 1;
    const heightIn = heightValue * toIn;
    const neckIn = neckValue * toIn;
    const waistIn = waistValue * toIn;
    const hipIn = (hipValue ?? 0) * toIn;

    const kg = units === 'metric' ? weightValue : weightValue * 0.45359237;
    const metres = heightIn * 0.0254;

    if (metres < 1.2 || metres > 2.3) return null;
    if (kg < 25 || kg > 300) return null;

    const navy = navyBodyFat(sex, heightIn, neckIn, waistIn, hipIn);

    // The equation is a log regression, so implausible tape readings do not
    // fail loudly — they return a confident-looking 3 percent or 90 percent.
    // Rejecting the range is the only way to tell the reader they mismeasured.
    if (navy === null || navy < 3 || navy > 70) return null;

    const bmi = kg / (metres * metres);
    const bmiEstimate = deurenberg(bmi, ageValue, sex);

    const fatKg = (kg * navy) / 100;
    const leanKg = kg - fatKg;
    const displayMass = (value: number) =>
      units === 'metric'
        ? `${formatNumber(value, 1)} kg`
        : `${formatNumber(value / 0.45359237, 1)} lb`;

    return {
      navy,
      bmi,
      bmiEstimate: Math.max(bmiEstimate, 0),
      gap: Math.abs(navy - bmiEstimate),
      category: classify(navy, sex),
      fatMass: displayMass(fatKg),
      leanMass: displayMass(leanKg),
    };
  }, [units, sex, age, weight, height, neck, waist, hip]);

  function reset() {
    setAge('');
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setHip('');
  }

  const unit = units === 'metric' ? 'cm' : 'in';

  return (
    <CalculatorPanel label="Input · measurements">
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
        <NumberField
          label="Age"
          value={age}
          onChange={setAge}
          unit="yrs"
          placeholder="30"
          min={15}
          max={100}
          inputMode="numeric"
        />
        <NumberField
          label="Weight"
          value={weight}
          onChange={setWeight}
          unit={units === 'metric' ? 'kg' : 'lb'}
          placeholder={units === 'metric' ? '80' : '176'}
          min={0}
          hint="Used for fat and lean mass, not for the Navy percentage itself."
        />
        <NumberField
          label="Height"
          value={height}
          onChange={setHeight}
          unit={unit}
          placeholder={units === 'metric' ? '180' : '71'}
          min={0}
        />
        <NumberField
          label="Neck circumference"
          value={neck}
          onChange={setNeck}
          unit={unit}
          placeholder={units === 'metric' ? '38' : '15'}
          min={0}
          hint="Just below the larynx, tape sloping slightly down at the front."
        />
        <NumberField
          label="Waist circumference"
          value={waist}
          onChange={setWaist}
          unit={unit}
          placeholder={units === 'metric' ? '88' : '35'}
          min={0}
          hint={
            sex === 'male'
              ? 'At the navel, at the end of a normal exhale.'
              : 'At the narrowest point of the torso.'
          }
        />
        {sex === 'female' && (
          <div className="sm:col-span-2">
            <NumberField
              label="Hip circumference"
              value={hip}
              onChange={setHip}
              unit={unit}
              placeholder={units === 'metric' ? '98' : '39'}
              min={0}
              hint="At the widest point of the buttocks, feet together."
            />
          </div>
        )}
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Body fat — US Navy method"
            value={formatNumber(result.navy, 1)}
            unit="%"
            verdict={result.category.label}
            tone={result.category.tone}
          />

          <ResultRows
            rows={[
              { label: 'Fat mass', value: result.fatMass, emphasis: true },
              { label: 'Lean body mass', value: result.leanMass, emphasis: true },
              { label: 'Body mass index', value: formatNumber(result.bmi, 1) },
              {
                label: 'BMI-based estimate (Deurenberg)',
                value: `${formatNumber(result.bmiEstimate, 1)} %`,
              },
            ]}
          />

          {/* The disagreement between the two methods is the most informative
              thing on the page, so it gets called out rather than left for the
              reader to spot in a table. */}
          {result.gap >= 5 && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                The two methods disagree by {formatNumber(result.gap, 1)} points
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                The Deurenberg formula only sees your BMI, age and sex, so it assumes an
                average build. A tape reading{' '}
                {result.navy < result.bmiEstimate ? 'well below' : 'well above'} it means
                your body carries{' '}
                {result.navy < result.bmiEstimate
                  ? 'more lean mass than is typical at your BMI — common if you train with weights'
                  : 'more fat than is typical at your BMI, often concentrated around the abdomen'}
                . Where they disagree, trust the tape: it measured you, the formula
                measured a population.
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-ink-500">
            Both figures are estimates from regression equations, each carrying a standard
            error of roughly four percentage points against hydrostatic weighing. Treat
            the result as a band rather than a number, and judge progress from the trend
            across several measurements taken weeks apart — not from a single reading.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
