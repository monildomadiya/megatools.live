export type DatasetRegistration = { id: string; name: string; publisher: string; sourceUrl: string; updateSchedule: string };
/** Official source directory. Rates and retrieval dates are added with their data tasks. */
export const datasets: DatasetRegistration[] = [
  { id: 'per-diem', name: 'CONUS per diem', publisher: 'GSA', sourceUrl: 'https://www.gsa.gov/travel/plan-book/per-diem-rates/per-diem-files', updateSchedule: 'Fiscal year beginning October 1' },
  { id: 'bah', name: 'Basic Allowance for Housing', publisher: 'Department of Defense', sourceUrl: 'https://militarypay.defense.gov/Pay/Basic-Allowance-for-Housing/BAH-Rate-Lookup', updateSchedule: 'January 1' },
  { id: 'military-pay', name: 'Military basic pay', publisher: 'DFAS', sourceUrl: 'https://www.dfas.mil/militarymembers/payentitlements/Pay-Tables/', updateSchedule: 'January 1' },
  { id: 'bas', name: 'Basic Allowance for Subsistence', publisher: 'Department of Defense', sourceUrl: 'https://militarypay.defense.gov/Pay/Allowances/BAS.aspx', updateSchedule: 'January 1' },
  { id: 'va', name: 'VA disability compensation', publisher: 'Department of Veterans Affairs', sourceUrl: 'https://www.va.gov/disability/compensation-rates/veteran-rates/', updateSchedule: 'December 1' },
  { id: 'combined-rating', name: 'Combined ratings & bilateral factor', publisher: 'eCFR · 38 CFR 4.25 and 4.26', sourceUrl: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A', updateSchedule: 'When the regulation changes' },
  { id: 'pcs', name: 'PCS travel allowances', publisher: 'Defense Travel Management Office', sourceUrl: 'https://www.travel.dod.mil/', updateSchedule: 'January 1; check current JTR' },
  { id: 'tax', name: 'Federal income tax', publisher: 'IRS', sourceUrl: 'https://www.irs.gov/', updateSchedule: 'Annually' },
  { id: 'fica', name: 'Social Security wage base', publisher: 'Social Security Administration', sourceUrl: 'https://www.ssa.gov/', updateSchedule: 'January 1' },
  { id: 'gi-bill', name: 'Post-9/11 GI Bill benefits', publisher: 'Department of Veterans Affairs', sourceUrl: 'https://www.va.gov/education/', updateSchedule: 'August 1' },
];
