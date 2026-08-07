/**
 * Shared number and currency formatting for the finance calculators.
 *
 * All of it goes through Intl so thousands separators and currency symbols
 * follow the reader's expectations rather than a hardcoded US format — a UK
 * visitor reading a mortgage figure should see £1,234.56, not $1234.56.
 */

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', locale: 'en-US' },
  { value: 'GBP', label: 'British Pound (£)', locale: 'en-GB' },
  { value: 'EUR', label: 'Euro (€)', locale: 'en-IE' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', locale: 'en-CA' },
  { value: 'AUD', label: 'Australian Dollar (A$)', locale: 'en-AU' },
  { value: 'INR', label: 'Indian Rupee (₹)', locale: 'en-IN' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['value'];

const localeFor = (code: CurrencyCode) =>
  CURRENCIES.find((c) => c.value === code)?.locale ?? 'en-US';

export function formatCurrency(
  amount: number,
  code: CurrencyCode,
  { decimals = 0 }: { decimals?: number } = {},
): string {
  return new Intl.NumberFormat(localeFor(code), {
    style: 'currency',
    currency: code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${formatNumber(value, decimals)}%`;
}

/** Parses a user-typed number, tolerating commas and stray spaces. */
export function parseNumber(value: string): number | null {
  const cleaned = value.replace(/[,\s]/g, '');
  if (cleaned === '') return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Standard amortising loan payment.
 *
 *   M = P · r(1+r)^n / ((1+r)^n − 1)
 *
 * where r is the periodic rate and n the number of payments. The zero-rate case
 * is handled separately: the general formula divides by zero there, and an
 * interest-free loan is a real thing readers enter (family loans, 0% finance).
 */
export function amortisingPayment(principal: number, periodicRate: number, periods: number): number {
  if (periods <= 0) return 0;
  if (periodicRate === 0) return principal / periods;
  const growth = Math.pow(1 + periodicRate, periods);
  return (principal * periodicRate * growth) / (growth - 1);
}

/** Month offset from today, used to show a payoff date. */
export function monthsFromNow(months: number): string {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
