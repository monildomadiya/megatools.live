import type { ComponentType } from 'react';

import CompoundInterestCalculator from './finance/compound-interest-calculator/Calculator';
import CompoundInterestContent from './finance/compound-interest-calculator/content.mdx';
import LoanEmiCalculator from './finance/loan-emi-calculator/Calculator';
import LoanEmiContent from './finance/loan-emi-calculator/content.mdx';
import MortgageCalculator from './finance/mortgage-calculator/Calculator';
import MortgageContent from './finance/mortgage-calculator/content.mdx';
import BmiCalculator from './health/bmi-calculator/Calculator';
import BmiContent from './health/bmi-calculator/content.mdx';
import BmrCalculator from './health/bmr-calculator/Calculator';
import BmrContent from './health/bmr-calculator/content.mdx';
import TdeeCalculator from './health/tdee-calculator/Calculator';
import TdeeContent from './health/tdee-calculator/content.mdx';
import PercentageCalculator from './math/percentage-calculator/Calculator';
import PercentageContent from './math/percentage-calculator/content.mdx';

interface ToolModule {
  /** Client island: the interactive calculator. */
  Calculator: ComponentType;
  /** Server-rendered MDX body. */
  Content: ComponentType;
}

/**
 * Maps `category/slug` to the components for that tool.
 *
 * Kept separate from `@/lib/tools/registry` on purpose: the registry holds only
 * plain data and is safe to import from client components such as the nav,
 * whereas this map pulls in every calculator and MDX body. It is imported by the
 * tool route and nowhere else.
 */
export const toolModules: Record<string, ToolModule> = {
  'finance/compound-interest-calculator': {
    Calculator: CompoundInterestCalculator,
    Content: CompoundInterestContent,
  },
  'finance/loan-emi-calculator': { Calculator: LoanEmiCalculator, Content: LoanEmiContent },
  'finance/mortgage-calculator': { Calculator: MortgageCalculator, Content: MortgageContent },
  'health/bmi-calculator': { Calculator: BmiCalculator, Content: BmiContent },
  'health/bmr-calculator': { Calculator: BmrCalculator, Content: BmrContent },
  'health/tdee-calculator': { Calculator: TdeeCalculator, Content: TdeeContent },
  'math/percentage-calculator': {
    Calculator: PercentageCalculator,
    Content: PercentageContent,
  },
};

export function getToolModule(category: string, slug: string): ToolModule | undefined {
  return toolModules[`${category}/${slug}`];
}
