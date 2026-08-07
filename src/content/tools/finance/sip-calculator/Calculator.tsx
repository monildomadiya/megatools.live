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
import {
  CURRENCIES,
  formatCurrency,
  formatNumber,
  parseNumber,
  type CurrencyCode,
} from '@/lib/format';

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.value, label: c.label }));

const STEP_UP_OPTIONS = [
  { value: '0', label: 'No step-up — same amount every year' },
  { value: '5', label: 'Step up 5% a year' },
  { value: '10', label: 'Step up 10% a year' },
  { value: '15', label: 'Step up 15% a year' },
];

/**
 * Month-by-month simulation rather than the closed-form annuity-due formula.
 *
 * The closed form only covers a constant instalment. A step-up changes the
 * contribution every twelfth month, which turns the sum into a series of
 * annuities each with its own start date — expressible in closed form, but as
 * an expression nobody can check by eye. The loop runs 600 iterations at most
 * for a 50-year term, so the cost is irrelevant and the logic stays readable.
 *
 * Contributions land at the start of the month and then earn that month's
 * growth, which is how a SIP debit actually behaves.
 */
function simulate(monthly: number, annualRatePercent: number, years: number, stepUpPercent: number) {
  const i = annualRatePercent / 100 / 12;
  const months = Math.round(years * 12);
  const stepUp = stepUpPercent / 100;

  let balance = 0;
  let invested = 0;

  for (let month = 0; month < months; month += 1) {
    const yearIndex = Math.floor(month / 12);
    const contribution = monthly * Math.pow(1 + stepUp, yearIndex);
    invested += contribution;
    balance = (balance + contribution) * (1 + i);
  }

  return { balance, invested, months };
}

export default function SipCalculator() {
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [monthly, setMonthly] = useState('10000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('15');
  const [stepUp, setStepUp] = useState('0');
  const [inflation, setInflation] = useState('5');

  const result = useMemo(() => {
    const monthlyValue = parseNumber(monthly);
    const rateValue = parseNumber(rate);
    const yearsValue = parseNumber(years);
    const inflationValue = parseNumber(inflation) ?? 0;

    if (monthlyValue === null || monthlyValue <= 0) return null;
    if (rateValue === null || rateValue < 0 || rateValue > 50) return null;
    if (yearsValue === null || yearsValue <= 0 || yearsValue > 50) return null;

    const { balance, invested, months } = simulate(
      monthlyValue,
      rateValue,
      yearsValue,
      Number(stepUp),
    );

    const flat = simulate(monthlyValue, rateValue, yearsValue, 0);

    // Real value: what the maturity amount buys in today's money. The single
    // most useful number on a 15-year projection and the one most calculators
    // leave out.
    const real = balance / Math.pow(1 + inflationValue / 100, yearsValue);

    // Run the same plan at two other rates. A projection quoted to the rupee at
    // one assumed return reads as a forecast; three numbers read as a range,
    // which is what it actually is.
    const lower = simulate(monthlyValue, Math.max(rateValue - 4, 0), yearsValue, Number(stepUp));
    const upper = simulate(monthlyValue, rateValue + 4, yearsValue, Number(stepUp));

    return {
      balance,
      invested,
      gain: balance - invested,
      gainShare: balance > 0 ? ((balance - invested) / balance) * 100 : 0,
      months,
      real,
      stepUpBonus: balance - flat.balance,
      lower: lower.balance,
      upper: upper.balance,
      lowerRate: Math.max(rateValue - 4, 0),
      upperRate: rateValue + 4,
      // Guarded rather than `floor(years) - 1`: a term under one year would give
      // a negative exponent and report a final instalment below the first one.
      finalMonthly:
        monthlyValue *
        Math.pow(1 + Number(stepUp) / 100, Math.max(Math.ceil(yearsValue) - 1, 0)),
    };
  }, [monthly, rate, years, stepUp, inflation]);

  function reset() {
    setMonthly('');
    setRate('');
    setYears('');
  }

  const money = (value: number) => formatCurrency(value, currency);

  return (
    <CalculatorPanel label="Input · your plan">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full sm:w-56">
          <SelectField
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS}
          />
        </div>
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Monthly investment"
          value={monthly}
          onChange={setMonthly}
          placeholder="10000"
          min={0}
        />
        <NumberField
          label="Expected annual return"
          value={rate}
          onChange={setRate}
          unit="%"
          placeholder="12"
          min={0}
          max={50}
          hint="An assumption, not a rate you are offered. Try it at 8 and 10 too."
        />
        <NumberField
          label="Investment period"
          value={years}
          onChange={setYears}
          unit="yr"
          placeholder="15"
          min={0}
          max={50}
        />
        <NumberField
          label="Assumed inflation"
          value={inflation}
          onChange={setInflation}
          unit="%"
          placeholder="5"
          min={0}
          max={25}
          hint="Used only to convert the maturity value back into today's money."
        />
        <div className="sm:col-span-2">
          <SelectField
            label="Annual step-up"
            value={stepUp}
            onChange={setStepUp}
            options={STEP_UP_OPTIONS}
            hint="Raises the instalment each year, usually to track your income."
          />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Estimated maturity value"
            value={money(result.balance)}
            verdict={`${money(result.invested)} invested · ${money(result.gain)} growth`}
          >
            <p className="text-sm leading-relaxed text-ink-600">
              Growth is {formatNumber(result.gainShare, 1)} percent of the final amount —
              the rest is your own money. Over long horizons that share climbs steeply,
              which is the whole argument for starting early rather than investing more.
            </p>
          </ResultCard>

          <ResultRows
            rows={[
              { label: 'Total invested', value: money(result.invested) },
              { label: 'Estimated gain', value: money(result.gain), emphasis: true },
              {
                label: 'Number of instalments',
                value: `${formatNumber(result.months)} months`,
              },
              {
                label: `Worth in today's money (at ${inflation}% inflation)`,
                value: money(result.real),
                emphasis: true,
              },
              ...(Number(stepUp) > 0
                ? [
                    {
                      label: `Final year's monthly instalment`,
                      value: money(result.finalMonthly),
                    },
                    {
                      label: `Extra corpus from the ${stepUp}% step-up`,
                      value: money(result.stepUpBonus),
                      emphasis: true,
                    },
                  ]
                : []),
            ]}
          />

          {/* Same plan, three assumed returns. Shown as a band rather than a
              point because that is what a return assumption is. */}
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="eyebrow eyebrow-muted">The same plan at other returns</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              {/* Keyed by position, not by rate: a low enough input makes the
                  lower scenario clamp to the same rate as the middle one, and
                  two identical keys would silently drop a column. */}
              {[
                { id: 'low', rate: result.lowerRate, value: result.lower },
                { id: 'mid', rate: parseNumber(rate) ?? 0, value: result.balance },
                { id: 'high', rate: result.upperRate, value: result.upper },
              ].map((scenario) => (
                <div key={scenario.id}>
                  <dt className="numeric text-sm text-ink-500">
                    {formatNumber(scenario.rate, 0)}%
                  </dt>
                  <dd className="numeric mt-1 text-base font-bold text-ink-900">
                    {money(scenario.value)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              Four percentage points either way changes the outcome by a large multiple
              over this horizon. If the plan only reaches your goal at the top of this
              range, it is not a plan — it is a hope with a spreadsheet attached.
            </p>
          </div>

          <p className="text-sm leading-relaxed text-ink-500">
            This projects gross growth at a rate you assumed. Fund expense ratios come out
            of returns before you see them, capital gains tax applies on redemption in most
            jurisdictions, and actual returns arrive in an uneven order rather than as a
            smooth annual percentage. Treat the figure as the shape of the plan, not as a
            number you will one day be paid.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
