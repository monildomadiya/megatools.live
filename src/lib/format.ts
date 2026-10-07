/** Money is represented as integer cents. */
export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
/** Pass a ratio: 0.25 formats as 25%. */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 2 }).format(value);
}
export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}
