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
  amortisingPayment,
  formatCurrency,
  formatPercent,
  monthsFromNow,
  parseNumber,
  type CurrencyCode,
} from '@/lib/format';

const TERM_OPTIONS = [
  { value: '30', label: '30 years' },
  { value: '25', label: '25 years' },
  { value: '20', label: '20 years' },
  { value: '15', label: '15 years' },
  { value: '10', label: '10 years' },
];

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.value, label: c.label }));

/**
 * A representative annual PMI rate as a percentage of the original loan amount.
 * Real rates run roughly 0.3%–1.5% depending on credit score and loan-to-value;
 * this sits in the middle so the estimate is not systematically optimistic. The
 * field is editable because the reader's quote is the number that counts.
 */
const DEFAULT_PMI_RATE = '0.7';

export default function MortgageCalculator() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [price, setPrice] = useState('400000');
  const [downPayment, setDownPayment] = useState('80000');
  const [term, setTerm] = useState('30');
  const [rate, setRate] = useState('6.5');
  const [propertyTax, setPropertyTax] = useState('4800');
  const [insurance, setInsurance] = useState('1800');
  const [hoa, setHoa] = useState('');
  const [pmiRate, setPmiRate] = useState(DEFAULT_PMI_RATE);

  const result = useMemo(() => {
    const priceValue = parseNumber(price);
    const downValue = parseNumber(downPayment) ?? 0;
    const rateValue = parseNumber(rate);
    const years = Number(term);

    if (priceValue === null || priceValue <= 0) return null;
    if (rateValue === null || rateValue < 0) return null;

    const loan = priceValue - downValue;
    if (loan <= 0) return null;

    const months = years * 12;
    const monthlyRate = rateValue / 100 / 12;
    const principalAndInterest = amortisingPayment(loan, monthlyRate, months);

    const downPercent = (downValue / priceValue) * 100;

    // PMI applies below 20% equity on a conventional loan, and it is charged on
    // the original loan amount rather than the current balance.
    const pmiRateValue = parseNumber(pmiRate) ?? 0;
    const monthlyPmi = downPercent < 20 ? (loan * (pmiRateValue / 100)) / 12 : 0;

    const monthlyTax = (parseNumber(propertyTax) ?? 0) / 12;
    const monthlyInsurance = (parseNumber(insurance) ?? 0) / 12;
    const monthlyHoa = parseNumber(hoa) ?? 0;

    const total = principalAndInterest + monthlyTax + monthlyInsurance + monthlyPmi + monthlyHoa;

    const totalPaid = principalAndInterest * months;
    const totalInterest = totalPaid - loan;

    // The first payment's split is the clearest illustration of why an early
    // overpayment is worth so much more than a late one.
    const firstInterest = loan * monthlyRate;
    const firstPrincipal = principalAndInterest - firstInterest;

    return {
      loan,
      downPercent,
      principalAndInterest,
      monthlyTax,
      monthlyInsurance,
      monthlyPmi,
      monthlyHoa,
      total,
      totalInterest,
      totalPaid,
      firstInterest,
      firstPrincipal,
      months,
    };
  }, [price, downPayment, term, rate, propertyTax, insurance, hoa, pmiRate]);

  function reset() {
    setPrice('');
    setDownPayment('');
    setRate('');
    setPropertyTax('');
    setInsurance('');
    setHoa('');
    setPmiRate(DEFAULT_PMI_RATE);
  }

  const money = (value: number, decimals = 0) => formatCurrency(value, currency, { decimals });

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
        <NumberField label="Home price" value={price} onChange={setPrice} placeholder="400000" min={0} />
        <NumberField
          label="Down payment"
          value={downPayment}
          onChange={setDownPayment}
          placeholder="80000"
          min={0}
          hint={
            result ? `${formatPercent(result.downPercent, 1)} of the price` : 'Under 20% usually triggers PMI'
          }
        />
        <SelectField label="Loan term" value={term} onChange={setTerm} options={TERM_OPTIONS} />
        <NumberField
          label="Interest rate"
          value={rate}
          onChange={setRate}
          unit="%"
          placeholder="6.5"
          min={0}
          hint="Annual rate, not APR"
        />
      </div>

      <details className="mt-6 rounded-lg border border-ink-200 bg-ink-50/60 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink-800">
          Taxes, insurance and fees
        </summary>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Property tax (per year)"
            value={propertyTax}
            onChange={setPropertyTax}
            placeholder="4800"
            min={0}
          />
          <NumberField
            label="Home insurance (per year)"
            value={insurance}
            onChange={setInsurance}
            placeholder="1800"
            min={0}
          />
          <NumberField
            label="HOA / service charge (per month)"
            value={hoa}
            onChange={setHoa}
            placeholder="0"
            min={0}
          />
          <NumberField
            label="PMI rate (per year)"
            value={pmiRate}
            onChange={setPmiRate}
            unit="%"
            min={0}
            hint="Only applied when the down payment is under 20%"
          />
        </div>
      </details>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard label="Total monthly payment" value={money(result.total)} />

          <ResultRows
            rows={[
              { label: 'Principal & interest', value: money(result.principalAndInterest), emphasis: true },
              ...(result.monthlyTax > 0
                ? [{ label: 'Property tax', value: money(result.monthlyTax) }]
                : []),
              ...(result.monthlyInsurance > 0
                ? [{ label: 'Home insurance', value: money(result.monthlyInsurance) }]
                : []),
              ...(result.monthlyPmi > 0
                ? [
                    {
                      label: `PMI (down payment is ${formatPercent(result.downPercent, 1)})`,
                      value: money(result.monthlyPmi),
                    },
                  ]
                : []),
              ...(result.monthlyHoa > 0 ? [{ label: 'HOA', value: money(result.monthlyHoa) }] : []),
            ]}
          />

          <ResultRows
            rows={[
              { label: 'Loan amount', value: money(result.loan) },
              { label: 'Total interest over the term', value: money(result.totalInterest), emphasis: true },
              { label: 'Total of all payments (P&I)', value: money(result.totalPaid) },
              { label: 'Paid off in', value: monthsFromNow(result.months) },
            ]}
          />

          <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-5">
            <p className="text-sm font-semibold text-ink-900">Your first payment</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Of the {money(result.principalAndInterest)} principal-and-interest payment,{' '}
              <strong className="text-ink-900">{money(result.firstInterest, 2)}</strong> is
              interest and only{' '}
              <strong className="text-ink-900">{money(result.firstPrincipal, 2)}</strong> reduces
              what you owe. That ratio is why an overpayment made now is worth far more than the
              same amount paid in ten years.
            </p>
          </div>

          <p className="text-sm leading-relaxed text-ink-500">
            Tax, insurance and PMI figures are estimates until you have real quotes. A lender’s
            binding offer is the only number that counts.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
