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
 * Mifflin-St Jeor (1990). Weight in kg, height in cm, age in years.
 * The only difference between sexes is the constant term.
 */
function mifflinStJeor(kg: number, cm: number, age: number, sex: Sex): number {
  return 10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161);
}

/** Harris-Benedict as revised by Roza and Shizgal (1984). */
function harrisBenedict(kg: number, cm: number, age: number, sex: Sex): number {
  return sex === 'male'
    ? 88.362 + 13.397 * kg + 4.799 * cm - 5.677 * age
    : 447.593 + 9.247 * kg + 3.098 * cm - 4.33 * age;
}

export default function BmrCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('80');
  const [heightCm, setHeightCm] = useState('180');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('11');

  const result = useMemo(() => {
    const ageValue = parseNumber(age);
    const weightValue = parseNumber(weight);

    if (ageValue === null || ageValue < 15 || ageValue > 100) return null;
    if (weightValue === null || weightValue <= 0) return null;

    let kg: number;
    let cm: number;

    if (units === 'metric') {
      const heightValue = parseNumber(heightCm);
      if (heightValue === null || heightValue <= 0) return null;
      kg = weightValue;
      cm = heightValue;
    } else {
      const ft = parseNumber(feet) ?? 0;
      const inch = parseNumber(inches) ?? 0;
      const totalInches = ft * 12 + inch;
      if (totalInches <= 0) return null;
      kg = weightValue * 0.45359237;
      cm = totalInches * 2.54;
    }

    // Outside these bounds the equations are extrapolating well beyond the
    // populations they were fitted to, and a confident-looking number would be
    // misleading.
    if (cm < 100 || cm > 250) return null;
    if (kg < 25 || kg > 300) return null;

    const mifflin = mifflinStJeor(kg, cm, ageValue, sex);
    const harris = harrisBenedict(kg, cm, ageValue, sex);
    const difference = harris - mifflin;

    return {
      mifflin,
      harris,
      difference,
      differencePercent: (difference / mifflin) * 100,
      // The published accuracy band for Mifflin-St Jeor: within 10% of measured
      // RMR in roughly 82% of people. Showing the range is more honest than
      // showing a single number to the calorie.
      lowerBound: mifflin * 0.9,
      upperBound: mifflin * 1.1,
    };
  }, [units, sex, age, weight, heightCm, feet, inches]);

  function reset() {
    setAge('');
    setWeight('');
    setHeightCm('');
    setFeet('');
    setInches('');
  }

  const kcal = (value: number) => formatNumber(Math.round(value));

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle label="Unit system" value={units} onChange={setUnits} options={UNIT_OPTIONS} />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Sex"
          value={sex}
          onChange={setSex}
          options={SEX_OPTIONS}
          hint="The equations were fitted with separate constants by sex."
        />
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
        />
        {units === 'metric' ? (
          <NumberField
            label="Height"
            value={heightCm}
            onChange={setHeightCm}
            unit="cm"
            placeholder="180"
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
              placeholder="11"
              min={0}
            />
          </div>
        )}
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Basal metabolic rate — Mifflin-St Jeor"
            value={kcal(result.mifflin)}
            unit="kcal/day"
            verdict={`Likely range ${kcal(result.lowerBound)} – ${kcal(result.upperBound)} kcal`}
          />

          <ResultRows
            rows={[
              {
                label: 'Harris-Benedict (revised 1984)',
                value: `${kcal(result.harris)} kcal/day`,
              },
              {
                label: 'Difference between the two equations',
                value: `${result.difference > 0 ? '+' : ''}${kcal(result.difference)} kcal (${
                  result.differencePercent > 0 ? '+' : ''
                }${result.differencePercent.toFixed(1)}%)`,
                emphasis: true,
              },
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            This is energy used at complete rest, not a daily calorie target. It does not
            include digestion, movement, or exercise. Individual rates vary by roughly 10 to
            15 percent either side of any prediction, largely because these equations cannot
            see body composition.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
