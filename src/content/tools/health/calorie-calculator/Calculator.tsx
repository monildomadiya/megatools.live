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

const ACTIVITY_LEVELS = [
  { value: '1.2', label: 'Sedentary — desk job, little or no exercise' },
  { value: '1.375', label: 'Lightly active — light exercise 1–3 days a week' },
  { value: '1.55', label: 'Moderately active — moderate exercise 3–5 days a week' },
  { value: '1.725', label: 'Very active — hard exercise 6–7 days a week' },
  { value: '1.9', label: 'Extra active — physical job plus daily training' },
];

/**
 * Goal expressed as weekly weight change in kg, positive for gain.
 *
 * Rates are offered rather than typed. A free-text field invites "2 kg a week",
 * which the page would then have to talk the reader out of; a fixed list only
 * contains rates that are defensible for someone at some body weight, and the
 * proportional check below catches the rest.
 */
const GOALS = [
  { value: '-1', label: 'Lose weight — fast (1 kg / 2.2 lb per week)' },
  { value: '-0.75', label: 'Lose weight — moderate (0.75 kg / 1.7 lb per week)' },
  { value: '-0.5', label: 'Lose weight — steady (0.5 kg / 1.1 lb per week)' },
  { value: '-0.25', label: 'Lose weight — slow (0.25 kg / 0.6 lb per week)' },
  { value: '0', label: 'Maintain current weight' },
  { value: '0.25', label: 'Gain weight — lean (0.25 kg / 0.6 lb per week)' },
  { value: '0.5', label: 'Gain weight — faster (0.5 kg / 1.1 lb per week)' },
];

/**
 * Energy in a kilogram of body tissue, used to turn a weekly rate into a daily
 * calorie figure. The familiar 3,500 kcal per pound.
 *
 * It is a first approximation and nothing more: it assumes expenditure holds
 * still while the body shrinks, which is exactly what does not happen. The page
 * says so rather than quietly presenting the output as a prediction.
 */
const KCAL_PER_KG = 7700;

function mifflinStJeor(kg: number, cm: number, age: number, sex: Sex): number {
  return 10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161);
}

export default function CalorieCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('female');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('70');
  const [heightCm, setHeightCm] = useState('165');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('5');
  const [activity, setActivity] = useState('1.375');
  const [goal, setGoal] = useState('-0.5');

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

    if (cm < 120 || cm > 230) return null;
    if (kg < 25 || kg > 300) return null;

    const bmr = mifflinStJeor(kg, cm, ageValue, sex);
    const maintenance = bmr * Number(activity);

    const weeklyKg = Number(goal);
    const dailyAdjustment = (weeklyKg * KCAL_PER_KG) / 7;
    const target = maintenance + dailyAdjustment;

    // Two independent safety checks, because they catch different readers. The
    // proportional one catches a heavy person picking an aggressive rate that
    // is actually fine for them; the BMR floor catches a light person picking a
    // modest-sounding rate that is not.
    const percentPerWeek = (Math.abs(weeklyKg) / kg) * 100;
    const rateTooFast = weeklyKg < 0 && percentPerWeek > 1;
    const belowBmr = target < bmr;

    return {
      bmr,
      maintenance,
      target,
      dailyAdjustment,
      weeklyKg,
      percentPerWeek,
      rateTooFast,
      belowBmr,
      // What the same deficit produces once expenditure has fallen with the
      // body weight. Not a model — just an honest haircut on the naive figure.
      realisticFirstMonth: (Math.abs(weeklyKg) * 4 * 0.85),
    };
  }, [units, sex, age, weight, heightCm, feet, inches, activity, goal]);

  function reset() {
    setAge('');
    setWeight('');
    setHeightCm('');
    setFeet('');
    setInches('');
  }

  const kcal = (value: number) => `${formatNumber(Math.round(value))} kcal`;
  const mass = (kg: number) =>
    units === 'metric'
      ? `${formatNumber(kg, 2)} kg`
      : `${formatNumber(kg / 0.45359237, 2)} lb`;

  return (
    <CalculatorPanel label="Input · you and your goal">
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
          label="Current weight"
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
            placeholder="165"
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
              placeholder="5"
              min={0}
            />
          </div>
        )}
        <div className="sm:col-span-2">
          <SelectField
            label="Activity level"
            value={activity}
            onChange={setActivity}
            options={ACTIVITY_LEVELS}
            hint="This already includes your exercise. Do not eat back what a watch reports on top of it — that counts the same workout twice."
          />
        </div>
        <div className="sm:col-span-2">
          <SelectField label="Goal" value={goal} onChange={setGoal} options={GOALS} />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Eat this many calories a day"
            value={formatNumber(Math.round(result.target))}
            unit="kcal/day"
            verdict={
              result.weeklyKg === 0
                ? 'Maintenance — no deficit or surplus'
                : `${result.dailyAdjustment < 0 ? 'Deficit' : 'Surplus'} of ${kcal(
                    Math.abs(result.dailyAdjustment),
                  )}/day`
            }
            tone={result.belowBmr || result.rateTooFast ? 'warn' : 'neutral'}
          />

          <ResultRows
            rows={[
              { label: 'Maintenance (TDEE)', value: kcal(result.maintenance), emphasis: true },
              { label: 'Basal metabolic rate', value: kcal(result.bmr) },
              {
                label: 'Target rate of change',
                value:
                  result.weeklyKg === 0
                    ? '—'
                    : `${mass(Math.abs(result.weeklyKg))}/week (${formatNumber(
                        result.percentPerWeek,
                        2,
                      )}% of body weight)`,
              },
              {
                label: 'Realistic change in the first month',
                value:
                  result.weeklyKg === 0 ? '—' : `about ${mass(result.realisticFirstMonth)}`,
              },
            ]}
          />

          {result.belowBmr && (
            <div className="rounded-card border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-900">
                This target is below your basal metabolic rate
              </p>
              <p className="mt-2 text-sm leading-relaxed text-red-900">
                {kcal(result.target)} is less than the {kcal(result.bmr)} your body spends
                at complete rest. Held for more than a short period, a deficit that deep is
                met partly by breaking down lean tissue, and it leaves too small a budget
                to hit protein and micronutrient targets. Pick a slower rate, or talk to a
                clinician before running this one.
              </p>
            </div>
          )}

          {result.rateTooFast && !result.belowBmr && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                That is a fast rate for your body weight
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                You have set {formatNumber(result.percentPerWeek, 2)} percent of your body
                weight per week. Above roughly 1 percent, the extra loss comes
                disproportionately from muscle rather than fat, and the deficit gets harder
                to hold. The CDC puts sustainable loss at 1 to 2 pounds a week and notes
                that people who lose at that pace are more likely to keep it off.
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-ink-500">
            The daily figure comes from the 7,700 kcal per kilogram rule, which holds early
            and then overstates: a lighter body burns less, so the deficit you set today
            narrows as you succeed. Expect the first month to run close to target and later
            months to slow. Recalculate at your new weight every few kilograms rather than
            treating one number as a plan for the year.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
