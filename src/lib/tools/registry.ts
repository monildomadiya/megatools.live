import type { CategorySlug, ToolMeta, ToolWithHref } from './types';

// --- Tool metadata imports -------------------------------------------------
// Adding a tool means: (1) create src/content/tools/<category>/<slug>/ with
// meta.ts, Calculator.tsx and content.mdx, (2) import the meta here and add it
// to `toolMetas`, (3) register the components in src/content/tools/modules.ts.
// Everything else — routing, sitemap, nav, breadcrumbs, JSON-LD, related links
// — is derived from this list.
//
// This module must stay free of React components: it is imported by client
// components (nav, search), and pulling calculator code in here would drag
// every tool into the first-load bundle.

import areaConverter from '@/content/tools/conversion/area-converter/meta';
import dataStorageConverter from '@/content/tools/conversion/data-storage-converter/meta';
import lengthConverter from '@/content/tools/conversion/length-converter/meta';
import pressureConverter from '@/content/tools/conversion/pressure-converter/meta';
import speedConverter from '@/content/tools/conversion/speed-converter/meta';
import temperatureConverter from '@/content/tools/conversion/temperature-converter/meta';
import timeConverter from '@/content/tools/conversion/time-converter/meta';
import volumeConverter from '@/content/tools/conversion/volume-converter/meta';
import weightConverter from '@/content/tools/conversion/weight-converter/meta';
import ageCalculator from '@/content/tools/date-time/age-calculator/meta';
import businessDaysCalculator from '@/content/tools/date-time/business-days-calculator/meta';
import dateDifferenceCalculator from '@/content/tools/date-time/date-difference-calculator/meta';
import timeZoneConverter from '@/content/tools/date-time/time-zone-converter/meta';
import workHoursCalculator from '@/content/tools/date-time/work-hours-calculator/meta';
import base64Encoder from '@/content/tools/developer/base64-encoder/meta';
import caseConverter from '@/content/tools/developer/case-converter/meta';
import cronExpressionTranslator from '@/content/tools/developer/cron-expression-translator/meta';
import colorConverter from '@/content/tools/developer/color-converter/meta';
import hashGenerator from '@/content/tools/developer/hash-generator/meta';
import jsonFormatter from '@/content/tools/developer/json-formatter/meta';
import passwordGenerator from '@/content/tools/developer/password-generator/meta';
import unixTimestampConverter from '@/content/tools/developer/unix-timestamp-converter/meta';
import uuidGenerator from '@/content/tools/developer/uuid-generator/meta';
import compoundInterestCalculator from '@/content/tools/finance/compound-interest-calculator/meta';
import loanEmiCalculator from '@/content/tools/finance/loan-emi-calculator/meta';
import mortgageCalculator from '@/content/tools/finance/mortgage-calculator/meta';
import salaryCalculator from '@/content/tools/finance/salary-calculator/meta';
import salesTaxCalculator from '@/content/tools/finance/sales-tax-calculator/meta';
import simpleInterestCalculator from '@/content/tools/finance/simple-interest-calculator/meta';
import sipCalculator from '@/content/tools/finance/sip-calculator/meta';
import vatCalculator from '@/content/tools/finance/vat-calculator/meta';
import bmiCalculator from '@/content/tools/health/bmi-calculator/meta';
import bmrCalculator from '@/content/tools/health/bmr-calculator/meta';
import bodyFatCalculator from '@/content/tools/health/body-fat-calculator/meta';
import calorieCalculator from '@/content/tools/health/calorie-calculator/meta';
import idealWeightCalculator from '@/content/tools/health/ideal-weight-calculator/meta';
import tdeeCalculator from '@/content/tools/health/tdee-calculator/meta';
import waistToHeightRatioCalculator from '@/content/tools/health/waist-to-height-ratio-calculator/meta';
import waterIntakeCalculator from '@/content/tools/health/water-intake-calculator/meta';
import averageCalculator from '@/content/tools/math/average-calculator/meta';
import fractionCalculator from '@/content/tools/math/fraction-calculator/meta';
import percentageCalculator from '@/content/tools/math/percentage-calculator/meta';
import ratioCalculator from '@/content/tools/math/ratio-calculator/meta';
import significantFiguresCalculator from '@/content/tools/math/significant-figures-calculator/meta';
import standardDeviationCalculator from '@/content/tools/math/standard-deviation-calculator/meta';
import discountCalculator from '@/content/tools/lifestyle/discount-calculator/meta';
import electricityCostCalculator from '@/content/tools/lifestyle/electricity-cost-calculator/meta';
import fuelCostCalculator from '@/content/tools/lifestyle/fuel-cost-calculator/meta';
import tipCalculator from '@/content/tools/lifestyle/tip-calculator/meta';
import characterCounter from '@/content/tools/seo/character-counter/meta';
import keywordDensityCalculator from '@/content/tools/seo/keyword-density-calculator/meta';
import readabilityCalculator from '@/content/tools/seo/readability-calculator/meta';
import slugGenerator from '@/content/tools/seo/slug-generator/meta';
import wordCounter from '@/content/tools/seo/word-counter/meta';

const toolMetas: ToolMeta[] = [
  compoundInterestCalculator,
  loanEmiCalculator,
  mortgageCalculator,
  salaryCalculator,
  salesTaxCalculator,
  simpleInterestCalculator,
  sipCalculator,
  vatCalculator,
  bmiCalculator,
  bmrCalculator,
  bodyFatCalculator,
  calorieCalculator,
  idealWeightCalculator,
  tdeeCalculator,
  waistToHeightRatioCalculator,
  waterIntakeCalculator,
  averageCalculator,
  fractionCalculator,
  percentageCalculator,
  ratioCalculator,
  significantFiguresCalculator,
  standardDeviationCalculator,
  areaConverter,
  dataStorageConverter,
  lengthConverter,
  pressureConverter,
  speedConverter,
  temperatureConverter,
  timeConverter,
  volumeConverter,
  weightConverter,
  ageCalculator,
  businessDaysCalculator,
  dateDifferenceCalculator,
  timeZoneConverter,
  workHoursCalculator,
  base64Encoder,
  caseConverter,
  colorConverter,
  cronExpressionTranslator,
  hashGenerator,
  jsonFormatter,
  passwordGenerator,
  unixTimestampConverter,
  uuidGenerator,
  discountCalculator,
  electricityCostCalculator,
  fuelCostCalculator,
  tipCalculator,
  characterCounter,
  keywordDensityCalculator,
  readabilityCalculator,
  slugGenerator,
  wordCounter,
];

// --- Derived structures ----------------------------------------------------

export function toolHref(tool: Pick<ToolMeta, 'category' | 'slug'>): string {
  return `/tools/${tool.category}/${tool.slug}`;
}

export const allTools: ToolWithHref[] = toolMetas
  .map((tool) => ({ ...tool, href: toolHref(tool) }))
  .sort((a, b) => a.name.localeCompare(b.name));

const byKey = new Map<string, ToolWithHref>(
  allTools.map((tool) => [`${tool.category}/${tool.slug}`, tool]),
);

export function getTool(category: string, slug: string): ToolWithHref | undefined {
  return byKey.get(`${category}/${slug}`);
}

export function getToolByKey(key: string): ToolWithHref | undefined {
  return byKey.get(key);
}

export function getToolsByCategory(category: CategorySlug): ToolWithHref[] {
  return allTools.filter((tool) => tool.category === category);
}

export function countToolsByCategory(category: CategorySlug): number {
  return getToolsByCategory(category).length;
}

export const featuredTools: ToolWithHref[] = allTools.filter((tool) => tool.featured);

/**
 * Related tools = the editorially chosen cross-category links first (those are
 * the ones a reader is actually likely to want next), topped up with siblings
 * from the same category so a new tool always has somewhere to link to.
 */
export function getRelatedTools(tool: ToolMeta, limit = 4): ToolWithHref[] {
  const seen = new Set<string>([`${tool.category}/${tool.slug}`]);
  const out: ToolWithHref[] = [];

  for (const key of tool.relatedSlugs) {
    const related = byKey.get(key);
    if (related && !seen.has(key)) {
      seen.add(key);
      out.push(related);
    }
  }

  for (const sibling of getToolsByCategory(tool.category)) {
    if (out.length >= limit) break;
    const key = `${sibling.category}/${sibling.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(sibling);
    }
  }

  return out.slice(0, limit);
}

/** Newest first — powers the "recently added" strip on the homepage. */
export const recentTools: ToolWithHref[] = [...allTools].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

/** Most recent content change across the whole site, for the homepage lastModified. */
export function latestUpdate(): string {
  return allTools.reduce(
    (latest, tool) => (tool.updatedAt > latest ? tool.updatedAt : latest),
    '1970-01-01',
  );
}

export { toolMetas };
