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
  formatPercent,
  parseNumber,
  type CurrencyCode,
} from '@/lib/format';

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.value, label: c.label }));

const COMPOUND_OPTIONS = [
  { value: '12', label: 'Monthly' },
  { value: '365', label: 'Daily' },
  { value: '4', label: 'Quarterly' },
  { value: '2', label: 'Twice a year' },
  { value: '1', label: 'Annually' },
];

const CONTRIBUTION_FREQUENCY = [
  { value: '12', label: 'Monthly' },
  { value: '52', label: 'Weekly' },
  { value: '26', label: 'Every two weeks' },
  { value: '4', label: 'Quarterly' },
  { value: '1', label: 'Annually' },
  { value: '0', label: 'No regular contribution' },
];

const TIMING_OPTIONS = [
  { value: 'end', label: 'End of each period' },
  { value: 'start', label: 'Start of each period' },
];

export default function CompoundInterestCalculator() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [compoundsPerYear, setCompoundsPerYear] = useState('12');
  const [contribution, setContribution] = useState('200');
  const [contributionFrequency, setContributionFrequency] = useState('12');
  const [timing, setTiming] = useState('end');

  const result = useMemo(() => {
    const p = parseNumber(principal) ?? 0;
    const annualRate = parseNumber(rate);
    const t = parseNumber(years);

    if (annualRate === null || annualRate < 0) return null;
    if (t === null || t <= 0 || t > 100) return null;
    if (p < 0) return null;

    const n = Number(compoundsPerYear);
    const contributionsPerYear = Number(contributionFrequency);
    const pmt = contributionsPerYear > 0 ? (parseNumber(contribution) ?? 0) : 0;

    const r = annualRate / 100;

    // Run the balance period by period rather than closing the form. The
    // contribution schedule and the compounding schedule are chosen
    // independently by the reader — weekly deposits into a monthly-compounding
    // account is a perfectly ordinary case — and a closed-form annuity formula
    // silently assumes those two line up.
    const stepsPerYear = Math.max(n, contributionsPerYear, 1);
    const totalSteps = Math.round(stepsPerYear * t);
    const ratePerStep = r / stepsPerYear;

    // Interest is only credited on compounding boundaries; between them the
    // balance simply accrues. The two cadences rarely divide into each other —
    // weekly contributions against monthly compounding, for instance — so
    // boundaries are detected by asking whether this step crossed one, rather
    // than by a modulo that would drift whenever the ratio is not a whole
    // number.
    const crossed = (step: number, perYear: number) =>
      Math.floor((step * perYear) / stepsPerYear) >
      Math.floor(((step - 1) * perYear) / stepsPerYear);

    let balance = p;
    let contributed = p;
    let accrued = 0;

    for (let step = 1; step <= totalSteps; step++) {
      const isContribution = contributionsPerYear > 0 && crossed(step, contributionsPerYear);

      if (isContribution && timing === 'start') {
        balance += pmt;
        contributed += pmt;
      }

      accrued += balance * ratePerStep;

      if (crossed(step, n)) {
        balance += accrued;
        accrued = 0;
      }

      if (isContribution && timing === 'end') {
        balance += pmt;
        contributed += pmt;
      }
    }

    balance += accrued;

    const interest = balance - contributed;
    const effectiveAnnualRate = (Math.pow(1 + r / n, n) - 1) * 100;
    const doublingYears = r > 0 ? Math.log(2) / (n * Math.log(1 + r / n)) : null;

    return { balance, contributed, interest, effectiveAnnualRate, doublingYears };
  }, [principal, rate, years, compoundsPerYear, contribution, contributionFrequency, timing]);

  function reset() {
    setPrincipal('');
    setRate('');
    setYears('');
    setContribution('');
  }

  const money = (value: number) => formatCurrency(value, currency);

  return (
    <CalculatorPanel>
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
          label="Starting amount"
          value={principal}
          onChange={setPrincipal}
          placeholder="10000"
          min={0}
        />
        <NumberField
          label="Annual interest rate"
          value={rate}
          onChange={setRate}
          unit="%"
          placeholder="7"
          min={0}
          hint="Nominal rate, before inflation and tax"
        />
        <NumberField
          label="Number of years"
          value={years}
          onChange={setYears}
          unit="yr"
          placeholder="20"
          min={0}
        />
        <SelectField
          label="Compounding frequency"
          value={compoundsPerYear}
          onChange={setCompoundsPerYear}
          options={COMPOUND_OPTIONS}
        />
        <NumberField
          label="Regular contribution"
          value={contribution}
          onChange={setContribution}
          placeholder="200"
          min={0}
        />
        <SelectField
          label="Contribution frequency"
          value={contributionFrequency}
          onChange={setContributionFrequency}
          options={CONTRIBUTION_FREQUENCY}
        />
        {contributionFrequency !== '0' && (
          <div className="sm:col-span-2">
            <SelectField
              label="Contributions are made at the"
              value={timing}
              onChange={setTiming}
              options={TIMING_OPTIONS}
              hint="A contribution at the start of a period earns one extra period of interest."
            />
          </div>
        )}
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard label="Final balance" value={money(result.balance)} />

          <ResultRows
            rows={[
              { label: 'Total you put in', value: money(result.contributed) },
              { label: 'Interest earned', value: money(result.interest), emphasis: true },
              {
                label: 'Interest as a share of the final balance',
                value: formatPercent((result.interest / result.balance) * 100, 1),
              },
              {
                label: 'Effective annual rate (APY)',
                value: formatPercent(result.effectiveAnnualRate, 2),
              },
              ...(result.doublingYears
                ? [
                    {
                      label: 'Time for a lump sum to double at this rate',
                      value: `${result.doublingYears.toFixed(1)} years`,
                    },
                  ]
                : []),
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Figures are nominal and before tax. A constant rate is an assumption the formula
            requires, not a description of how real returns arrive.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
