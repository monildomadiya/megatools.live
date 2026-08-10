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
import { parseNumber } from '@/lib/format';

type UnitSystem = 'metric' | 'us';

const UNIT_OPTIONS = [
  { value: 'metric' as const, label: 'Metric' },
  { value: 'us' as const, label: 'US units' },
];

/**
 * Millilitres of total water per kilogram of body weight. 30-35 is the range in
 * common clinical use for adults; the midpoint is the default because a
 * calculator that silently picks the top of a range reports a target the reader
 * has no reason to trust.
 */
const ML_PER_KG = 33;

/**
 * Sweat rates in litres per hour. Real rates span roughly 0.5-2.0 L/h and vary
 * more between individuals than between intensities, which is why the page
 * pushes the weigh-before-and-after method as the only way to know your own.
 */
const INTENSITIES = [
  { value: 'light', label: 'Light — walking, easy cycling', litresPerHour: 0.4 },
  { value: 'moderate', label: 'Moderate — running, gym, sport', litresPerHour: 0.8 },
  { value: 'vigorous', label: 'Vigorous — hard training, competition', litresPerHour: 1.2 },
] as const;

const CLIMATES = [
  { value: 'temperate', label: 'Temperate — around 20 °C', factor: 1 },
  { value: 'warm', label: 'Warm — around 27 °C', factor: 1.1 },
  { value: 'hot', label: 'Hot or humid — 32 °C and above', factor: 1.2 },
] as const;

/** EFSA adequate intakes for total water, adults, moderate conditions. */
const EFSA_AI = { female: 2.0, male: 2.5 } as const;
/** US National Academies adequate intakes for total water, adults 19+. */
const NAS_AI = { female: 2.7, male: 3.7 } as const;

const LIFE_STAGES = [
  { value: 'none', label: 'Not applicable', extraLitres: 0 },
  { value: 'pregnant', label: 'Pregnant (+0.3 L)', extraLitres: 0.3 },
  { value: 'breastfeeding', label: 'Breastfeeding (+0.7 L)', extraLitres: 0.7 },
] as const;

type Sex = 'female' | 'male';
type Intensity = (typeof INTENSITIES)[number]['value'];
type Climate = (typeof CLIMATES)[number]['value'];
type LifeStage = (typeof LIFE_STAGES)[number]['value'];

/** Share of total water that typically arrives in food rather than drinks. */
const FOOD_SHARE = 0.2;
/** A "glass" for the glasses-per-day row. 250 ml is the usual convention. */
const GLASS_LITRES = 0.25;

export default function WaterIntakeCalculator() {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState<Sex>('female');
  const [minutes, setMinutes] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('moderate');
  const [climate, setClimate] = useState<Climate>('temperate');
  const [lifeStage, setLifeStage] = useState<LifeStage>('none');

  const result = useMemo(() => {
    const entered = parseNumber(weight);
    if (entered === null || entered <= 0) return null;

    const weightKg = units === 'metric' ? entered : entered * 0.45359237;
    if (weightKg < 20 || weightKg > 300) return null;

    const baseline = (weightKg * ML_PER_KG) / 1000;

    const exerciseMinutes = Math.min(Math.max(parseNumber(minutes) ?? 0, 0), 480);
    const perHour = INTENSITIES.find((i) => i.value === intensity)!.litresPerHour;
    const exercise = (exerciseMinutes / 60) * perHour;

    const climateFactor = CLIMATES.find((c) => c.value === climate)!.factor;
    const stageExtra = LIFE_STAGES.find((s) => s.value === lifeStage)!.extraLitres;

    // Heat raises the resting requirement, so the climate factor applies to the
    // baseline only — the exercise term already carries its own sweat rate, and
    // scaling it again would double-count the same heat.
    const total = baseline * climateFactor + exercise + stageExtra;
    const fromDrinks = total * (1 - FOOD_SHARE);

    return {
      total,
      baseline: baseline * climateFactor,
      exercise,
      stageExtra,
      fromDrinks,
      fromFood: total - fromDrinks,
      glasses: fromDrinks / GLASS_LITRES,
      cupsUs: fromDrinks / 0.2365882365,
      efsa: EFSA_AI[sex],
      nas: NAS_AI[sex],
    };
  }, [weight, units, minutes, intensity, climate, lifeStage, sex]);

  function reset() {
    setWeight('');
    setMinutes('');
    setIntensity('moderate');
    setClimate('temperate');
    setLifeStage('none');
  }

  const litres = (value: number) => `${value.toFixed(1)} L`;
  const usable = (value: number) =>
    units === 'metric' ? litres(value) : `${(value * 33.8140226).toFixed(0)} fl oz`;

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle label="Unit system" value={units} onChange={setUnits} options={UNIT_OPTIONS} />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Body weight"
          value={weight}
          onChange={setWeight}
          unit={units === 'metric' ? 'kg' : 'lb'}
          placeholder={units === 'metric' ? '70' : '154'}
          min={0}
        />

        <SelectField
          label="Sex"
          value={sex}
          onChange={setSex}
          options={[
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
          ]}
          hint="Used only to pick the right official reference intake for comparison."
        />

        <NumberField
          label="Exercise today"
          value={minutes}
          onChange={setMinutes}
          unit="min"
          placeholder="45"
          min={0}
          max={480}
        />

        <SelectField
          label="Exercise intensity"
          value={intensity}
          onChange={setIntensity}
          options={INTENSITIES.map((i) => ({ value: i.value, label: i.label }))}
        />

        <SelectField
          label="Climate"
          value={climate}
          onChange={setClimate}
          options={CLIMATES.map((c) => ({ value: c.value, label: c.label }))}
        />

        <SelectField
          label="Pregnancy or breastfeeding"
          value={lifeStage}
          onChange={setLifeStage}
          options={LIFE_STAGES.map((s) => ({ value: s.value, label: s.label }))}
        />
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Total water per day, all sources"
            value={result.total.toFixed(1)}
            unit="litres"
            verdict={`About ${usable(result.fromDrinks)} of it from drinks`}
          />

          <ResultRows
            rows={[
              { label: 'From drinks', value: usable(result.fromDrinks), emphasis: true },
              { label: 'From food (roughly 20%)', value: usable(result.fromFood) },
              {
                label: 'Glasses of 250 ml',
                value: `${result.glasses.toFixed(1)} glasses`,
              },
              ...(units === 'us'
                ? [{ label: 'US cups (8 fl oz)', value: `${result.cupsUs.toFixed(1)} cups` }]
                : []),
              { label: 'Baseline for your weight and climate', value: litres(result.baseline) },
              ...(result.exercise > 0
                ? [{ label: 'Added for exercise', value: litres(result.exercise) }]
                : []),
              ...(result.stageExtra > 0
                ? [{ label: 'Added for life stage', value: litres(result.stageExtra) }]
                : []),
              {
                label: 'EFSA adequate intake, total water',
                value: litres(result.efsa),
              },
              {
                label: 'US National Academies adequate intake',
                value: litres(result.nas),
              },
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            This is an estimate for a healthy adult, not a prescription. Individual sweat
            rates differ by a factor of four, and kidney, heart or liver conditions can
            make a higher intake actively harmful — several of them come with a fluid
            restriction. If you have one of those, or you are on diuretics, follow the
            limit your clinician set rather than this figure.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
