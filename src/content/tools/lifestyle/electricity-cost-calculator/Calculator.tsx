'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { CURRENCIES, formatCurrency, parseNumber, type CurrencyCode } from '@/lib/format';

/** A year of 365 days, divided into twelve equal months for the monthly row. */
const DAYS_PER_YEAR = 365;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

type PowerUnit = 'W' | 'kW';

export default function ElectricityCostCalculator() {
  const [power, setPower] = useState('2000');
  const [powerUnit, setPowerUnit] = useState<PowerUnit>('W');
  const [hours, setHours] = useState('5');
  const [daysPerWeek, setDaysPerWeek] = useState('7');
  const [rate, setRate] = useState('0.25');
  const [currency, setCurrency] = useState<CurrencyCode>('GBP');
  const [dutyCycle, setDutyCycle] = useState('100');
  const [standbyWatts, setStandbyWatts] = useState('0');

  const parsedPower = parseNumber(power);
  const parsedHours = parseNumber(hours);
  const parsedDays = parseNumber(daysPerWeek);
  const parsedRate = parseNumber(rate);
  const parsedDuty = parseNumber(dutyCycle);
  const parsedStandby = parseNumber(standbyWatts) ?? 0;

  const result = useMemo(() => {
    if (parsedPower === null || parsedHours === null || parsedRate === null) return null;
    if (parsedPower < 0 || parsedHours < 0 || parsedRate < 0) return null;
    if (parsedHours > 24) return null;

    const kilowatts = powerUnit === 'W' ? parsedPower / 1000 : parsedPower;
    const duty = parsedDuty === null ? 1 : Math.min(Math.max(parsedDuty, 0), 100) / 100;
    const daysUsed = parsedDays === null ? 7 : Math.min(Math.max(parsedDays, 0), 7);

    // Active energy: rated power, derated by the fraction of the running time
    // the appliance is genuinely drawing it.
    const kwhPerRunningDay = kilowatts * parsedHours * duty;

    // Standby covers the rest of the day, every day — not only the days the
    // appliance is used. That is what makes it add up: a 2 W draw is nothing
    // per hour and 17.5 kWh a year.
    const standbyKw = parsedStandby / 1000;
    const standbyKwhPerDay = standbyKw * (24 - parsedHours);

    const activeKwhPerYear = kwhPerRunningDay * ((daysUsed / 7) * DAYS_PER_YEAR);
    const standbyKwhPerYear = standbyKwhPerDay * DAYS_PER_YEAR;
    const totalKwhPerYear = activeKwhPerYear + standbyKwhPerYear;

    return {
      kilowatts,
      kwhPerRunningDay,
      standbyKwhPerDay,
      costPerRunningDay: kwhPerRunningDay * parsedRate,
      costPerHour: kilowatts * duty * parsedRate,
      activeKwhPerYear,
      standbyKwhPerYear,
      totalKwhPerYear,
      costPerYear: totalKwhPerYear * parsedRate,
      costPerMonth: (totalKwhPerYear / DAYS_PER_YEAR) * DAYS_PER_MONTH * parsedRate,
      standbyCostPerYear: standbyKwhPerYear * parsedRate,
      derated: duty < 1,
    };
  }, [parsedPower, powerUnit, parsedHours, parsedDays, parsedRate, parsedDuty, parsedStandby]);

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });

  function reset() {
    setPower('2000');
    setPowerUnit('W');
    setHours('5');
    setDaysPerWeek('7');
    setRate('0.25');
    setCurrency('GBP');
    setDutyCycle('100');
    setStandbyWatts('0');
  }

  return (
    <CalculatorPanel>
      <div className="mb-5">
        <UnitToggle
          label="Power unit"
          value={powerUnit}
          onChange={setPowerUnit}
          options={[
            { value: 'W', label: 'Watts' },
            { value: 'kW', label: 'Kilowatts' },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Rated power"
          value={power}
          onChange={setPower}
          unit={powerUnit}
          min={0}
          hint="From the rating plate on the appliance, or volts × amps."
        />
        <NumberField
          label="Hours used per day"
          value={hours}
          onChange={setHours}
          unit="hours"
          min={0}
          max={24}
        />
        <NumberField
          label="Days used per week"
          value={daysPerWeek}
          onChange={setDaysPerWeek}
          unit="days"
          min={0}
          max={7}
          step={1}
          inputMode="numeric"
        />
        <NumberField
          label="Unit rate"
          value={rate}
          onChange={setRate}
          unit={`per kWh`}
          min={0}
          hint="Take this from a recent bill — not the annual estimate."
        />
        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
        />
        <NumberField
          label="Duty cycle"
          value={dutyCycle}
          onChange={setDutyCycle}
          unit="%"
          min={0}
          max={100}
          hint="How much of that time it actually draws power. 100% for a lamp, nearer 30% for a fridge or a thermostatic heater."
        />
      </div>

      <div className="mt-5">
        <NumberField
          label="Standby draw when not in use"
          value={standbyWatts}
          onChange={setStandbyWatts}
          unit="W"
          min={0}
          hint="Optional. Applied to the remaining hours of every day, which is what makes a 2 W draw add up to real money."
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Cost per year"
            value={money(result.costPerYear)}
            verdict={`${result.totalKwhPerYear.toFixed(0)} kWh a year · ${money(result.costPerMonth)} a month`}
          />

          <ResultRows
            rows={[
              { label: 'Cost per hour of use', value: money(result.costPerHour) },
              {
                label: 'Energy per day used',
                value: `${result.kwhPerRunningDay.toFixed(2)} kWh`,
              },
              {
                label: 'Cost per day used',
                value: money(result.costPerRunningDay),
                emphasis: true,
              },
              { label: 'Cost per month', value: money(result.costPerMonth) },
              { label: 'Cost per year', value: money(result.costPerYear), emphasis: true },
              ...(result.standbyKwhPerYear > 0
                ? [
                    {
                      label: 'Standby energy per year',
                      value: `${result.standbyKwhPerYear.toFixed(1)} kWh`,
                    },
                    {
                      label: 'Standby cost per year',
                      value: money(result.standbyCostPerYear),
                    },
                  ]
                : []),
            ]}
          />

          {result.derated && (
            <p className="rounded-card border border-line bg-panel-2 px-4 py-3 text-sm leading-relaxed text-ink-600">
              Duty cycle applied: the appliance is assumed to draw its rated{' '}
              {result.kilowatts.toFixed(3)} kW for {dutyCycle}% of the hours it is on. Set
              this to 100% to see the worst case.
            </p>
          )}

          <p className="rounded-card border border-line bg-panel-2 px-4 py-3 text-sm leading-relaxed text-ink-600">
            Standing charges are not included. That is a fixed daily fee for being connected
            rather than a cost of running this appliance, so adding it here would make every
            appliance look more expensive than it is.
          </p>
        </div>
      )}

      {parsedHours !== null && parsedHours > 24 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          A day has 24 hours. For something running continuously, enter 24.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
