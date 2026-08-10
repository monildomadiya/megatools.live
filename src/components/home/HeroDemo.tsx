'use client';

import Link from 'next/link';
import { useState } from 'react';
import { amortisingPayment, formatCurrency, parseNumber } from '@/lib/format';

/**
 * A working calculator in the hero.
 *
 * The homepage used to describe the product and then link to it. On a site whose
 * entire proposition is "the answer plus the working", describing that in prose
 * is strictly worse than showing one — a visitor who can see a result change as
 * they type has already understood the offer, and nothing about a screenshot or
 * an illustration would carry that.
 *
 * Every field is pre-filled so the card is never an empty form on arrival. It
 * runs the same arithmetic the full tools run, at a fraction of the inputs, and
 * each tab links through to the real thing.
 */

type Tab = 'bmi' | 'loan' | 'discount';

const TABS: { value: Tab; label: string }[] = [
  { value: 'bmi', label: 'BMI' },
  { value: 'loan', label: 'Loan payment' },
  { value: 'discount', label: 'Discount' },
];

function MiniField({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ink-800">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`numeric w-full rounded-control border border-line bg-panel-2 px-3.5 py-2.5 text-base text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 ${
            unit ? 'pr-12' : ''
          }`}
        />
        {unit && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-ink-500"
          >
            {unit}
          </span>
        )}
      </span>
    </label>
  );
}

function Readout({
  label,
  value,
  unit,
  verdict,
  tone = 'neutral',
  href,
  cta,
}: {
  label: string;
  value: string;
  unit?: string;
  verdict: string;
  tone?: 'neutral' | 'good' | 'warn';
  href: string;
  cta: string;
}) {
  const verdictClass =
    tone === 'good' ? 'text-emerald-700' : tone === 'warn' ? 'text-amber-700' : 'text-ink-700';

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="eyebrow eyebrow-muted">{label}</p>
        {/* Announced politely: the figure changes on every keystroke, and a
            screen reader user gets no benefit from a silent readout. */}
        <p aria-live="polite" className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span className="numeric text-5xl font-bold leading-none text-ink-900 sm:text-6xl">
            {value}
          </span>
          {unit && <span className="text-base font-semibold text-ink-500">{unit}</span>}
        </p>
        <p className={`mt-3 text-lg font-bold tracking-tight ${verdictClass}`}>{verdict}</p>
      </div>

      <Link
        href={href}
        className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
      >
        {cta}
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}

export function HeroDemo() {
  const [tab, setTab] = useState<Tab>('bmi');

  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');

  const [amount, setAmount] = useState('250000');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');

  const [price, setPrice] = useState('80');
  const [off, setOff] = useState('25');

  function renderBmi() {
    const kg = parseNumber(weight);
    const cm = parseNumber(height);
    const valid = kg !== null && cm !== null && kg > 0 && cm >= 50 && cm <= 260;
    const bmi = valid ? kg / (cm / 100) ** 2 : null;

    const band =
      bmi === null
        ? { label: 'Enter your height and weight', tone: 'neutral' as const }
        : bmi < 18.5
          ? { label: 'Underweight', tone: 'warn' as const }
          : bmi < 25
            ? { label: 'Healthy weight', tone: 'good' as const }
            : bmi < 30
              ? { label: 'Overweight', tone: 'warn' as const }
              : { label: 'Obesity', tone: 'warn' as const };

    return {
      fields: (
        <>
          <MiniField label="Weight" value={weight} onChange={setWeight} unit="kg" />
          <MiniField label="Height" value={height} onChange={setHeight} unit="cm" />
        </>
      ),
      readout: (
        <Readout
          label="Your BMI"
          value={bmi === null ? '—' : bmi.toFixed(1)}
          unit={bmi === null ? undefined : 'kg/m²'}
          verdict={band.label}
          tone={band.tone}
          href="/tools/health/bmi-calculator"
          cta="Full BMI calculator"
        />
      ),
    };
  }

  function renderLoan() {
    const principal = parseNumber(amount);
    const annualRate = parseNumber(rate);
    const term = parseNumber(years);
    const valid =
      principal !== null &&
      annualRate !== null &&
      term !== null &&
      principal > 0 &&
      annualRate >= 0 &&
      term > 0 &&
      term <= 50;

    const payment = valid ? amortisingPayment(principal, annualRate / 100 / 12, term * 12) : null;
    const total = valid && payment !== null ? payment * term * 12 : null;

    return {
      fields: (
        <>
          <MiniField label="Loan amount" value={amount} onChange={setAmount} unit="$" />
          <MiniField label="Interest rate" value={rate} onChange={setRate} unit="%" />
          <MiniField label="Term" value={years} onChange={setYears} unit="yr" />
        </>
      ),
      readout: (
        <Readout
          label="Monthly payment"
          value={payment === null ? '—' : formatCurrency(payment, 'USD', { decimals: 0 })}
          verdict={
            total === null
              ? 'Enter the loan details'
              : `${formatCurrency(total - (parseNumber(amount) ?? 0), 'USD', { decimals: 0 })} of interest over the term`
          }
          href="/tools/finance/loan-emi-calculator"
          cta="Full loan calculator"
        />
      ),
    };
  }

  function renderDiscount() {
    const original = parseNumber(price);
    const percent = parseNumber(off);
    const valid =
      original !== null && percent !== null && original > 0 && percent >= 0 && percent <= 100;

    const sale = valid ? original * (1 - percent / 100) : null;
    const saving = valid && sale !== null ? original - sale : null;

    return {
      fields: (
        <>
          <MiniField label="Original price" value={price} onChange={setPrice} unit="$" />
          <MiniField label="Discount" value={off} onChange={setOff} unit="%" />
        </>
      ),
      readout: (
        <Readout
          label="You pay"
          value={sale === null ? '—' : formatCurrency(sale, 'USD', { decimals: 2 })}
          verdict={
            saving === null
              ? 'Enter a price and a discount'
              : `You save ${formatCurrency(saving, 'USD', { decimals: 2 })}`
          }
          tone={saving === null ? 'neutral' : 'good'}
          href="/tools/lifestyle/discount-calculator"
          cta="Full discount calculator"
        />
      ),
    };
  }

  const view = tab === 'bmi' ? renderBmi() : tab === 'loan' ? renderLoan() : renderDiscount();

  return (
    <div className="overflow-hidden rounded-card-lg border border-line bg-panel shadow-lift">
      <div className="flex items-center gap-1 border-b border-line bg-panel-2 px-2 py-2 sm:px-3">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            aria-pressed={tab === item.value}
            className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors sm:px-4 ${
              tab === item.value
                ? 'bg-panel text-ink-900 shadow-panel'
                : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="eyebrow eyebrow-muted ml-auto hidden pr-2 sm:inline">Live</span>
      </div>

      {/* The same white-inputs / grey-results split every tool page uses, so the
          homepage teaches the layout before the reader reaches a calculator. */}
      <div className="grid sm:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4 border-b border-line p-5 sm:border-b-0 sm:border-r sm:p-7">
          {view.fields}
        </div>
        <div className="bg-surface p-5 sm:p-7">{view.readout}</div>
      </div>
    </div>
  );
}
