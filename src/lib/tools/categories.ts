import type { Category, CategorySlug } from './types';

/**
 * Category hub pages are the pillar pages of the site — each one is a real
 * landing page with its own intro copy, not a bare grid of links.
 */
export const categories: Category[] = [
  {
    slug: 'finance',
    name: 'Finance',
    h1: 'Finance Calculators',
    metaTitle: 'Free Finance Calculators — Loans, Mortgage, Interest',
    metaDescription:
      'Free finance calculators for mortgages, loans, compound interest, salary, and tax. Each one shows the formula, a worked example, and what it leaves out.',
    intro:
      'Money questions rarely have one number as an answer — a mortgage payment depends on how the lender compounds interest, and a take-home figure depends on which deductions apply to you. These calculators show the arithmetic they run so you can check it against a lender quote or a payslip, and each page is explicit about the assumptions baked in.',
    order: 1,
  },
  {
    slug: 'health',
    name: 'Health',
    h1: 'Health & Fitness Calculators',
    metaTitle: 'Free Health Calculators — BMI, BMR, TDEE, Body Fat',
    metaDescription:
      'Free health calculators for BMI, BMR, TDEE, body fat, and calorie needs. Formulas cited to WHO, NIH and peer-reviewed sources, with limitations stated.',
    intro:
      'Every health formula here was built from population data, which means it describes averages rather than individuals. The calculators run the published equations exactly as their authors defined them, and each page states plainly where the equation was validated and which groups it is known to misclassify. Nothing on this site is medical advice.',
    order: 2,
  },
  {
    slug: 'math',
    name: 'Math',
    h1: 'Math Calculators',
    metaTitle: 'Free Math Calculators — Percentage, Fractions, Statistics',
    metaDescription:
      'Free math calculators for percentages, fractions, averages, ratios, and standard deviation. Step-by-step working shown for every result.',
    intro:
      'These calculators show their working rather than just the answer, because a percentage change or a standard deviation is usually something you need to explain to someone else. Each page walks through the steps with real numbers and covers the cases people most often get wrong.',
    order: 3,
  },
  {
    slug: 'conversion',
    name: 'Conversion',
    h1: 'Unit Converters',
    metaTitle: 'Free Unit Converters — Length, Weight, Temperature',
    metaDescription:
      'Free unit converters for length, weight, temperature, area, speed, and data. Exact conversion factors, not rounded approximations.',
    intro:
      'Conversions look trivial until precision matters. These converters use the exact internationally defined factors — an inch is exactly 25.4 millimetres, a pound is exactly 0.45359237 kilograms — and each page lists the definitions it relies on so you can trace any result.',
    order: 4,
  },
  {
    slug: 'date-time',
    name: 'Date & Time',
    h1: 'Date & Time Calculators',
    metaTitle: 'Free Date & Time Calculators — Age, Duration, Time Zones',
    metaDescription:
      'Free date and time calculators for age, date differences, and time zone conversion. Handles leap years and daylight saving correctly.',
    intro:
      'Date arithmetic is full of traps: leap years, month lengths that vary, and daylight saving shifts that add or remove an hour without warning. These calculators handle those cases explicitly, and each page explains the rule it applies when a date is ambiguous.',
    order: 5,
  },
  {
    slug: 'developer',
    name: 'Developer',
    h1: 'Developer Tools',
    metaTitle: 'Free Developer Tools — Passwords, JSON, Encoding',
    metaDescription:
      'Free developer utilities for password generation, JSON formatting, case conversion, and encoding. Everything runs in your browser, nothing is uploaded.',
    intro:
      'These utilities run entirely in your browser. Nothing you paste in is sent to a server, which matters when the thing you are formatting is a config file or the thing you are generating is a credential. Each page states exactly what happens to your input.',
    order: 6,
  },
  {
    slug: 'seo',
    name: 'Writing & SEO',
    h1: 'Writing & SEO Tools',
    metaTitle: 'Free Writing & SEO Tools — Word Count, Readability',
    metaDescription:
      'Free tools for writers and SEOs: word counter, character counter, readability scoring, and slug generation. Runs locally in your browser.',
    intro:
      'Word counts, character limits, and readability scores all have specific definitions that differ between tools — which is why the same paragraph can score differently in two places. Each page here states the exact counting rule or formula it applies.',
    order: 7,
  },
  {
    slug: 'lifestyle',
    name: 'Lifestyle',
    h1: 'Everyday Calculators',
    metaTitle: 'Free Everyday Calculators — Tips, Fuel Costs, Splits',
    metaDescription:
      'Free everyday calculators for tipping, splitting bills, and fuel costs. Quick answers with the arithmetic shown.',
    intro:
      'Small calculations that come up at a restaurant table or a petrol pump. Nothing complicated, but the pages cover the variations people actually run into — splitting unevenly, tipping on the pre-tax total, comparing fuel prices across units.',
    order: 8,
  },
];

const bySlug = new Map<CategorySlug, Category>(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug as CategorySlug);
}

export function categoryHref(slug: CategorySlug): string {
  return `/tools/${slug}`;
}

export const categorySlugs: CategorySlug[] = categories.map((c) => c.slug);
