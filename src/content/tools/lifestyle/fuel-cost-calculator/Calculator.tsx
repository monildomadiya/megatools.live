'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
} from '@/components/tool/fields';
import { CURRENCIES, formatCurrency, parseNumber, type CurrencyCode } from '@/lib/format';

/**
 * Economy units, normalised to litres per kilometre.
 *
 * The two gallons are the trap this tool exists to catch: a US gallon is
 * 3.785411784 L and an imperial gallon 4.54609 L, so the same car reads about
 * 20% better in UK mpg than in US mpg. Offering "mpg" without asking which one
 * would quietly produce a fifth-of-a-tank error.
 */
const US_GALLON_L = 3.785411784;
const UK_GALLON_L = 4.54609;
const MILE_KM = 1.609344;

const ECONOMY_UNITS = [
  {
    value: 'mpg-uk',
    label: 'Miles per gallon (UK imperial)',
    toLitresPerKm: (value: number) => UK_GALLON_L / (value * MILE_KM),
    placeholder: '45',
  },
  {
    value: 'mpg-us',
    label: 'Miles per gallon (US)',
    toLitresPerKm: (value: number) => US_GALLON_L / (value * MILE_KM),
    placeholder: '32',
  },
  {
    value: 'l100km',
    label: 'Litres per 100 km',
    toLitresPerKm: (value: number) => value / 100,
    placeholder: '6.5',
  },
  {
    value: 'kml',
    label: 'Kilometres per litre',
    toLitresPerKm: (value: number) => 1 / value,
    placeholder: '15',
  },
] as const;

type EconomyUnit = (typeof ECONOMY_UNITS)[number]['value'];

const DISTANCE_UNITS = [
  { value: 'mi', label: 'Miles', km: MILE_KM },
  { value: 'km', label: 'Kilometres', km: 1 },
] as const;

const PRICE_UNITS = [
  { value: 'litre', label: 'Per litre', litres: 1 },
  { value: 'gal-us', label: 'Per US gallon', litres: US_GALLON_L },
  { value: 'gal-uk', label: 'Per imperial gallon', litres: UK_GALLON_L },
] as const;

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState<(typeof DISTANCE_UNITS)[number]['value']>('mi');
  const [economy, setEconomy] = useState('');
  const [economyUnit, setEconomyUnit] = useState<EconomyUnit>('mpg-uk');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState<(typeof PRICE_UNITS)[number]['value']>('litre');
  const [currency, setCurrency] = useState<CurrencyCode>('GBP');
  const [people, setPeople] = useState('1');
  const [returnTrip, setReturnTrip] = useState(false);

  const result = useMemo(() => {
    const distanceValue = parseNumber(distance);
    const economyValue = parseNumber(economy);
    const priceValue = parseNumber(price);

    if (distanceValue === null || economyValue === null || priceValue === null) return null;
    if (distanceValue <= 0 || economyValue <= 0 || priceValue < 0) return null;

    const km =
      distanceValue *
      DISTANCE_UNITS.find((unit) => unit.value === distanceUnit)!.km *
      (returnTrip ? 2 : 1);

    const litresPerKm = ECONOMY_UNITS.find((unit) => unit.value === economyUnit)!.toLitresPerKm(
      economyValue,
    );
    if (!Number.isFinite(litresPerKm) || litresPerKm <= 0) return null;

    const pricePerLitre =
      priceValue / PRICE_UNITS.find((unit) => unit.value === priceUnit)!.litres;

    const litres = km * litresPerKm;
    const cost = litres * pricePerLitre;

    const passengers = Math.max(Math.round(parseNumber(people) ?? 1), 1);

    // The same economy expressed every way, since car, filling station and
    // handbook rarely agree on which unit to use.
    const l100km = litresPerKm * 100;

    return {
      km,
      litres,
      cost,
      passengers,
      perPerson: cost / passengers,
      pricePerLitre,
      costPerMile: cost / (km / MILE_KM),
      costPerKm: cost / km,
      l100km,
      mpgUk: UK_GALLON_L / (litresPerKm * MILE_KM),
      mpgUs: US_GALLON_L / (litresPerKm * MILE_KM),
      kmPerLitre: 1 / litresPerKm,
    };
  }, [distance, distanceUnit, economy, economyUnit, price, priceUnit, people, returnTrip]);

  function reset() {
    setDistance('');
    setEconomy('');
    setPrice('');
    setPeople('1');
    setReturnTrip(false);
  }

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });
  const economyPlaceholder = ECONOMY_UNITS.find((unit) => unit.value === economyUnit)!.placeholder;

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Distance"
          value={distance}
          onChange={setDistance}
          placeholder="250"
          min={0}
        />
        <SelectField
          label="Measured in"
          value={distanceUnit}
          onChange={setDistanceUnit}
          options={DISTANCE_UNITS.map((unit) => ({ value: unit.value, label: unit.label }))}
        />

        <NumberField
          label="Fuel economy"
          value={economy}
          onChange={setEconomy}
          placeholder={economyPlaceholder}
          min={0}
          hint="Use your car's real average, not the official figure — they differ by 10–20%."
        />
        <SelectField
          label="Economy unit"
          value={economyUnit}
          onChange={setEconomyUnit}
          options={ECONOMY_UNITS.map((unit) => ({ value: unit.value, label: unit.label }))}
        />

        <NumberField
          label="Fuel price"
          value={price}
          onChange={setPrice}
          placeholder="1.45"
          min={0}
        />
        <SelectField
          label="Priced"
          value={priceUnit}
          onChange={setPriceUnit}
          options={PRICE_UNITS.map((unit) => ({ value: unit.value, label: unit.label }))}
        />

        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((option) => ({ value: option.value, label: option.label }))}
        />
        <NumberField
          label="People sharing the cost"
          value={people}
          onChange={setPeople}
          placeholder="1"
          min={1}
          inputMode="numeric"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={returnTrip}
            onChange={(event) => setReturnTrip(event.target.checked)}
            className="h-4 w-4 rounded border-line"
          />
          Return journey — double the distance
        </label>
        <ResetButton onClick={reset} />
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label={returnTrip ? 'Fuel cost, there and back' : 'Fuel cost for this journey'}
            value={money(result.cost)}
            verdict={`${result.litres.toFixed(1)} litres over ${result.km.toFixed(0)} km`}
          />

          <ResultRows
            rows={[
              ...(result.passengers > 1
                ? [
                    {
                      label: `Split ${result.passengers} ways`,
                      value: money(result.perPerson),
                      emphasis: true,
                    },
                  ]
                : []),
              { label: 'Fuel used', value: `${result.litres.toFixed(2)} litres` },
              {
                label: 'In gallons',
                value: `${(result.litres / UK_GALLON_L).toFixed(2)} imperial · ${(
                  result.litres / US_GALLON_L
                ).toFixed(2)} US`,
              },
              { label: 'Cost per mile', value: money(result.costPerMile) },
              { label: 'Cost per kilometre', value: money(result.costPerKm) },
            ]}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              Your economy figure in every unit
            </p>
            <ResultRows
              rows={[
                { label: 'Miles per gallon (UK imperial)', value: result.mpgUk.toFixed(1) },
                { label: 'Miles per gallon (US)', value: result.mpgUs.toFixed(1) },
                { label: 'Litres per 100 km', value: result.l100km.toFixed(2) },
                { label: 'Kilometres per litre', value: result.kmPerLitre.toFixed(2) },
              ]}
            />
          </div>

          <p className="text-sm leading-relaxed text-ink-500">
            This is fuel only. Depreciation, tyres, servicing and insurance typically cost
            more per mile than the fuel does — which is why reimbursement rates such as the
            UK&rsquo;s 45p per mile are several times the figure above.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
