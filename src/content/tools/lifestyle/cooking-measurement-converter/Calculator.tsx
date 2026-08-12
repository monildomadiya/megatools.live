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
 * Volume units in millilitres, mass units in grams.
 *
 * The cup sizes are the interesting part: four of them are in active use and
 * they differ by up to 20%, so "1 cup" is not a quantity until you know whose
 * cup. The US customary cup is half a US pint — 236.5882365 ml exactly — while
 * the 240 ml legal cup exists because nutrition labelling needed a round
 * number, and the 250 ml metric cup is standard in Australia and New Zealand.
 */
const UNITS = [
  { value: 'cupUS', label: 'Cup — US customary (236.6 ml)', kind: 'volume', size: 236.5882365 },
  { value: 'cupLegal', label: 'Cup — US legal / labelling (240 ml)', kind: 'volume', size: 240 },
  { value: 'cupMetric', label: 'Cup — metric, AU & NZ (250 ml)', kind: 'volume', size: 250 },
  { value: 'cupImperial', label: 'Cup — imperial, old UK (284.1 ml)', kind: 'volume', size: 284.130625 },
  { value: 'tbspUS', label: 'Tablespoon — US (14.8 ml)', kind: 'volume', size: 14.78676478125 },
  { value: 'tbspMetric', label: 'Tablespoon — metric / UK (15 ml)', kind: 'volume', size: 15 },
  { value: 'tbspAU', label: 'Tablespoon — Australian (20 ml)', kind: 'volume', size: 20 },
  { value: 'tspUS', label: 'Teaspoon — US (4.93 ml)', kind: 'volume', size: 4.92892159375 },
  { value: 'tspMetric', label: 'Teaspoon — metric (5 ml)', kind: 'volume', size: 5 },
  { value: 'flozUS', label: 'Fluid ounce — US (29.57 ml)', kind: 'volume', size: 29.5735295625 },
  { value: 'flozImp', label: 'Fluid ounce — imperial (28.41 ml)', kind: 'volume', size: 28.4130625 },
  { value: 'ml', label: 'Millilitres (ml)', kind: 'volume', size: 1 },
  { value: 'l', label: 'Litres (l)', kind: 'volume', size: 1000 },
  { value: 'g', label: 'Grams (g)', kind: 'mass', size: 1 },
  { value: 'kg', label: 'Kilograms (kg)', kind: 'mass', size: 1000 },
  { value: 'oz', label: 'Ounces (oz)', kind: 'mass', size: 28.349523125 },
  { value: 'lb', label: 'Pounds (lb)', kind: 'mass', size: 453.59237 },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/**
 * Grams per US customary cup — the form published charts use — with the density
 * derived from it rather than stored separately.
 *
 * Liquids and hard granular solids follow the USDA household-measure weights
 * and are firm figures. The ones marked `spread` are not: how the cup is filled
 * moves them by up to 20%, published charts disagree for exactly that reason,
 * and the value here is a level, lightly filled cup somewhere in the middle of
 * that range. The panel says so rather than presenting it as a fact.
 */
const INGREDIENTS = [
  { value: 'water', label: 'Water', perCup: 237, spread: false },
  { value: 'flourAP', label: 'Flour — plain / all-purpose', perCup: 125, spread: true },
  { value: 'flourBread', label: 'Flour — bread / strong', perCup: 127, spread: true },
  { value: 'flourWhole', label: 'Flour — wholemeal', perCup: 120, spread: true },
  { value: 'sugar', label: 'Sugar — granulated', perCup: 200, spread: false },
  { value: 'sugarBrown', label: 'Sugar — brown, packed', perCup: 220, spread: true },
  { value: 'sugarIcing', label: 'Sugar — icing / powdered', perCup: 120, spread: false },
  { value: 'butter', label: 'Butter', perCup: 227, spread: false },
  { value: 'oil', label: 'Oil — vegetable', perCup: 218, spread: false },
  { value: 'milk', label: 'Milk', perCup: 245, spread: false },
  { value: 'cream', label: 'Cream — double / heavy', perCup: 238, spread: false },
  { value: 'honey', label: 'Honey', perCup: 339, spread: false },
  { value: 'syrup', label: 'Maple syrup', perCup: 322, spread: false },
  { value: 'oats', label: 'Oats — rolled', perCup: 90, spread: true },
  { value: 'rice', label: 'Rice — long grain, uncooked', perCup: 185, spread: false },
  { value: 'cocoa', label: 'Cocoa powder', perCup: 86, spread: true },
  { value: 'salt', label: 'Salt — fine table salt', perCup: 292, spread: false },
  { value: 'custom', label: 'Something else — enter grams per cup', perCup: 0, spread: false },
] as const;

type IngredientCode = (typeof INGREDIENTS)[number]['value'];

const US_CUP_ML = 236.5882365;

function present(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  const decimals = abs >= 100 ? 0 : abs >= 10 ? 1 : abs >= 1 ? 2 : 3;
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

export default function CookingMeasurementConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState<UnitCode>('cupUS');
  const [ingredient, setIngredient] = useState<IngredientCode>('flourAP');
  const [customPerCup, setCustomPerCup] = useState('150');

  const chosen = INGREDIENTS.find((i) => i.value === ingredient)!;
  const perCup =
    ingredient === 'custom' ? (parseNumber(customPerCup) ?? 0) : chosen.perCup;
  const density = perCup / US_CUP_ML; // grams per millilitre

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null || parsed <= 0 || density <= 0) return null;

    const unit = unitFor(from);
    const ml = unit.kind === 'volume' ? parsed * unit.size : (parsed * unit.size) / density;
    const grams = unit.kind === 'mass' ? parsed * unit.size : ml * density;

    return {
      ml,
      grams,
      rows: [
        { label: 'Grams', value: `${present(grams)} g`, emphasis: true },
        { label: 'Ounces', value: `${present(grams / 28.349523125)} oz` },
        { label: 'Millilitres', value: `${present(ml)} ml` },
        { label: 'US customary cups', value: present(ml / US_CUP_ML) },
        { label: 'Metric cups (250 ml)', value: present(ml / 250) },
        { label: 'US tablespoons', value: present(ml / 14.78676478125) },
        { label: 'Metric tablespoons (15 ml)', value: present(ml / 15) },
        { label: 'Metric teaspoons (5 ml)', value: present(ml / 5) },
      ],
    };
  }, [parsed, from, density]);

  const fromUnit = unitFor(from);

  function reset() {
    setAmount('1');
    setFrom('cupUS');
    setIngredient('flourAP');
    setCustomPerCup('150');
  }

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Amount"
          value={amount}
          onChange={setAmount}
          placeholder="1"
          min={0}
        />
        <SelectField
          label="Measured in"
          value={from}
          onChange={setFrom}
          options={UNITS.map((u) => ({ value: u.value, label: u.label }))}
        />
        <SelectField
          label="Ingredient"
          value={ingredient}
          onChange={setIngredient}
          options={INGREDIENTS.map((i) => ({ value: i.value, label: i.label }))}
          hint="Volume and weight can only be crossed for a named ingredient."
        />
        {ingredient === 'custom' && (
          <NumberField
            label="Grams per US cup"
            value={customPerCup}
            onChange={setCustomPerCup}
            unit="g"
            min={0}
            hint="Weigh one level cup of it once and this works for every recipe after."
          />
        )}
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${present(parsed!)} ${fromUnit.label.split(' —')[0]!.toLowerCase()} of ${chosen.label
              .split(' —')[0]!
              .toLowerCase()}`}
            value={present(fromUnit.kind === 'volume' ? result.grams : result.ml)}
            unit={fromUnit.kind === 'volume' ? 'grams' : 'millilitres'}
            verdict={`Using ${present(perCup)} g per US cup — a density of ${present(
              density,
            )} g/ml`}
          />

          <ResultRows rows={result.rows} />

          {chosen.spread && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                This ingredient does not have one honest cup weight
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                How it is packed changes the answer. Scooping the cup through the bag compacts
                flour and can add 20% over spooning it in and levelling it off; brown sugar
                varies by how hard it is pressed; oats and cocoa settle. The figure above
                assumes a level, lightly filled cup. Where the recipe matters, weigh it.
              </p>
            </div>
          )}

          {fromUnit.value === 'tbspAU' && (
            <p className="text-sm leading-relaxed text-ink-500">
              The Australian tablespoon is 20 ml — four teaspoons, not three. Measuring an
              Australian recipe with a US or European spoon takes about a third off every
              tablespoon in it, which raising agents and salt will not forgive.
            </p>
          )}
        </div>
      )}

      {parsed !== null && parsed <= 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter an amount above zero.
        </p>
      )}

      {ingredient === 'custom' && density <= 0 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter how much one US cup of it weighs in grams. Without a density there is no way
          to cross between volume and weight.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
