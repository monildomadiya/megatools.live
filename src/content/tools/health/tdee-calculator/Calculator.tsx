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
 * The multiplier set in general circulation, inherited from the Harris-Benedict
 * tradition. `pal` is the corresponding band from the 2001 FAO/WHO/UNU expert
 * consultation, which measured physical activity level directly — the two
 * disagree, and showing both is the point of this tool.
 */
const ACTIVITY_LEVELS = [
  {
    value: '1.2',
    label: 'Sedentary — desk job, little or no exercise',
    pal: [1.4, 1.69] as const,
    palName: 'Sedentary or light activity',
  },
  {
    value: '1.375',
    label: 'Lightly active — light exercise 1–3 days a week',
    pal: [1.4, 1.69] as const,
    palName: 'Sedentary or light activity',
  },
  {
    value: '1.55',
    label: 'Moderately active — moderate exercise 3–5 days a week',
    pal: [1.7, 1.99] as const,
    palName: 'Active or moderately active',
  },
  {
    value: '1.725',
    label: 'Very active — hard exercise 6–7 days a week',
    pal: [1.7, 1.99] as const,
    palName: 'Active or moderately active',
  },
  {
    value: '1.9',
    label: 'Extra active — physical job plus daily training',
    pal: [2.0, 2.4] as const,
    palName: 'Vigorously active',
  },
];

function mifflinStJeor(kg: number, cm: number, age: number, sex: Sex): number {
  return 10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161);
}

export default function TdeeCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('80');
  const [heightCm, setHeightCm] = useState('180');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('11');
  const [activity, setActivity] = useState('1.55');

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
      const totalInches = (parseNumber(feet) ?? 0) * 12 + (parseNumber(inches) ?? 0);
      if (totalInches <= 0) return null;
      kg = weightValue * 0.45359237;
      cm = totalInches * 2.54;
    }

    if (cm < 100 || cm > 250) return null;
    if (kg < 25 || kg > 300) return null;

    const bmr = mifflinStJeor(kg, cm, ageValue, sex);
    const level = ACTIVITY_LEVELS.find((l) => l.value === activity) ?? ACTIVITY_LEVELS[2]!;
    const tdee = bmr * Number(level.value);

    return {
      bmr,
      tdee,
      level,
      palLow: bmr * level.pal[0],
      palHigh: bmr * level.pal[1],
      // Deficits are shown as absolute calorie changes rather than as promised
      // weekly weight loss. The 3,500-calories-per-pound rule holds early and
      // then breaks down, so quoting a weekly figure would be overclaiming.
      mildDeficit: tdee - 250,
      moderateDeficit: tdee - 500,
      mildSurplus: tdee + 250,
    };
  }, [units, sex, age, weight, heightCm, feet, inches, activity]);

  function reset() {
    setAge('');
    setWeight('');
    setHeightCm('');
    setFeet('');
    setInches('');
  }

  const kcal = (value: number) => `${formatNumber(Math.round(value))} kcal`;

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle label="Unit system" value={units} onChange={setUnits} options={UNIT_OPTIONS} />
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
        <div className="sm:col-span-2">
          <SelectField
            label="Activity level"
            value={activity}
            onChange={setActivity}
            options={ACTIVITY_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
            hint="Most people pick one bracket too high. A one-hour workout is a small share of a 24-hour day."
          />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Total daily energy expenditure"
            value={formatNumber(Math.round(result.tdee))}
            unit="kcal/day"
            verdict={`BMR ${formatNumber(Math.round(result.bmr))} × ${result.level.value}`}
          />

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">
              What the official activity ranges give
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-900">
              The 2001 FAO/WHO/UNU consultation classes this as{' '}
              <strong>{result.level.palName}</strong>, a physical activity level of{' '}
              {result.level.pal[0]}–{result.level.pal[1]}. That puts your daily requirement at{' '}
              <strong>
                {kcal(result.palLow)} – {kcal(result.palHigh)}
              </strong>
              , against the {kcal(result.tdee)} from the multiplier above. The gap between the two
              is a fair measure of how much confidence this number deserves.
            </p>
          </div>

          <ResultRows
            rows={[
              { label: 'Maintenance', value: kcal(result.tdee), emphasis: true },
              { label: 'Mild deficit (−250/day)', value: kcal(result.mildDeficit) },
              { label: 'Moderate deficit (−500/day)', value: kcal(result.moderateDeficit) },
              { label: 'Mild surplus (+250/day)', value: kcal(result.mildSurplus) },
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Deficits are shown as calorie changes, not as promised weekly weight loss. The
            familiar &ldquo;500 a day is a pound a week&rdquo; rule holds for the first few weeks
            and then overstates, because a lighter body burns less and sustained restriction
            lowers metabolic rate further. Recalculate as your weight changes, and treat this as
            a starting point rather than a prescription.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
