import type { ComponentType } from 'react';

import AreaConverter from './conversion/area-converter/Calculator';
import AreaConverterContent from './conversion/area-converter/content.mdx';
import DataStorageConverter from './conversion/data-storage-converter/Calculator';
import DataStorageConverterContent from './conversion/data-storage-converter/content.mdx';
import LengthConverter from './conversion/length-converter/Calculator';
import LengthConverterContent from './conversion/length-converter/content.mdx';
import PressureConverter from './conversion/pressure-converter/Calculator';
import PressureConverterContent from './conversion/pressure-converter/content.mdx';
import SpeedConverter from './conversion/speed-converter/Calculator';
import SpeedConverterContent from './conversion/speed-converter/content.mdx';
import TemperatureConverter from './conversion/temperature-converter/Calculator';
import TemperatureConverterContent from './conversion/temperature-converter/content.mdx';
import TimeConverter from './conversion/time-converter/Calculator';
import TimeConverterContent from './conversion/time-converter/content.mdx';
import VolumeConverter from './conversion/volume-converter/Calculator';
import VolumeConverterContent from './conversion/volume-converter/content.mdx';
import WeightConverter from './conversion/weight-converter/Calculator';
import WeightConverterContent from './conversion/weight-converter/content.mdx';
import AgeCalculator from './date-time/age-calculator/Calculator';
import AgeCalculatorContent from './date-time/age-calculator/content.mdx';
import BusinessDaysCalculator from './date-time/business-days-calculator/Calculator';
import BusinessDaysContent from './date-time/business-days-calculator/content.mdx';
import DateDifferenceCalculator from './date-time/date-difference-calculator/Calculator';
import DateDifferenceContent from './date-time/date-difference-calculator/content.mdx';
import TimeZoneConverter from './date-time/time-zone-converter/Calculator';
import TimeZoneConverterContent from './date-time/time-zone-converter/content.mdx';
import WorkHoursCalculator from './date-time/work-hours-calculator/Calculator';
import WorkHoursContent from './date-time/work-hours-calculator/content.mdx';
import Base64Encoder from './developer/base64-encoder/Calculator';
import Base64EncoderContent from './developer/base64-encoder/content.mdx';
import CaseConverter from './developer/case-converter/Calculator';
import CaseConverterContent from './developer/case-converter/content.mdx';
import ColorConverter from './developer/color-converter/Calculator';
import ColorConverterContent from './developer/color-converter/content.mdx';
import CronExpressionTranslator from './developer/cron-expression-translator/Calculator';
import CronExpressionContent from './developer/cron-expression-translator/content.mdx';
import HashGenerator from './developer/hash-generator/Calculator';
import HashGeneratorContent from './developer/hash-generator/content.mdx';
import JsonFormatter from './developer/json-formatter/Calculator';
import JsonFormatterContent from './developer/json-formatter/content.mdx';
import PasswordGenerator from './developer/password-generator/Calculator';
import PasswordGeneratorContent from './developer/password-generator/content.mdx';
import UnixTimestampConverter from './developer/unix-timestamp-converter/Calculator';
import UnixTimestampContent from './developer/unix-timestamp-converter/content.mdx';
import UuidGenerator from './developer/uuid-generator/Calculator';
import UuidGeneratorContent from './developer/uuid-generator/content.mdx';
import CompoundInterestCalculator from './finance/compound-interest-calculator/Calculator';
import CompoundInterestContent from './finance/compound-interest-calculator/content.mdx';
import LoanEmiCalculator from './finance/loan-emi-calculator/Calculator';
import LoanEmiContent from './finance/loan-emi-calculator/content.mdx';
import MortgageCalculator from './finance/mortgage-calculator/Calculator';
import MortgageContent from './finance/mortgage-calculator/content.mdx';
import SalaryCalculator from './finance/salary-calculator/Calculator';
import SalaryContent from './finance/salary-calculator/content.mdx';
import SalesTaxCalculator from './finance/sales-tax-calculator/Calculator';
import SalesTaxContent from './finance/sales-tax-calculator/content.mdx';
import SimpleInterestCalculator from './finance/simple-interest-calculator/Calculator';
import SimpleInterestContent from './finance/simple-interest-calculator/content.mdx';
import SipCalculator from './finance/sip-calculator/Calculator';
import SipContent from './finance/sip-calculator/content.mdx';
import VatCalculator from './finance/vat-calculator/Calculator';
import VatContent from './finance/vat-calculator/content.mdx';
import BmiCalculator from './health/bmi-calculator/Calculator';
import BmiContent from './health/bmi-calculator/content.mdx';
import BmrCalculator from './health/bmr-calculator/Calculator';
import BmrContent from './health/bmr-calculator/content.mdx';
import BodyFatCalculator from './health/body-fat-calculator/Calculator';
import BodyFatContent from './health/body-fat-calculator/content.mdx';
import CalorieCalculator from './health/calorie-calculator/Calculator';
import CalorieContent from './health/calorie-calculator/content.mdx';
import IdealWeightCalculator from './health/ideal-weight-calculator/Calculator';
import IdealWeightContent from './health/ideal-weight-calculator/content.mdx';
import TdeeCalculator from './health/tdee-calculator/Calculator';
import TdeeContent from './health/tdee-calculator/content.mdx';
import WaistToHeightRatioCalculator from './health/waist-to-height-ratio-calculator/Calculator';
import WaistToHeightRatioContent from './health/waist-to-height-ratio-calculator/content.mdx';
import WaterIntakeCalculator from './health/water-intake-calculator/Calculator';
import WaterIntakeContent from './health/water-intake-calculator/content.mdx';
import AverageCalculator from './math/average-calculator/Calculator';
import AverageContent from './math/average-calculator/content.mdx';
import FractionCalculator from './math/fraction-calculator/Calculator';
import FractionContent from './math/fraction-calculator/content.mdx';
import PercentageCalculator from './math/percentage-calculator/Calculator';
import PercentageContent from './math/percentage-calculator/content.mdx';
import RatioCalculator from './math/ratio-calculator/Calculator';
import RatioContent from './math/ratio-calculator/content.mdx';
import SignificantFiguresCalculator from './math/significant-figures-calculator/Calculator';
import SignificantFiguresContent from './math/significant-figures-calculator/content.mdx';
import StandardDeviationCalculator from './math/standard-deviation-calculator/Calculator';
import StandardDeviationContent from './math/standard-deviation-calculator/content.mdx';
import DiscountCalculator from './lifestyle/discount-calculator/Calculator';
import DiscountContent from './lifestyle/discount-calculator/content.mdx';
import ElectricityCostCalculator from './lifestyle/electricity-cost-calculator/Calculator';
import ElectricityCostContent from './lifestyle/electricity-cost-calculator/content.mdx';
import FuelCostCalculator from './lifestyle/fuel-cost-calculator/Calculator';
import FuelCostContent from './lifestyle/fuel-cost-calculator/content.mdx';
import TipCalculator from './lifestyle/tip-calculator/Calculator';
import TipCalculatorContent from './lifestyle/tip-calculator/content.mdx';
import CharacterCounter from './seo/character-counter/Calculator';
import CharacterCounterContent from './seo/character-counter/content.mdx';
import KeywordDensityCalculator from './seo/keyword-density-calculator/Calculator';
import KeywordDensityContent from './seo/keyword-density-calculator/content.mdx';
import ReadabilityCalculator from './seo/readability-calculator/Calculator';
import ReadabilityContent from './seo/readability-calculator/content.mdx';
import SlugGenerator from './seo/slug-generator/Calculator';
import SlugGeneratorContent from './seo/slug-generator/content.mdx';
import WordCounter from './seo/word-counter/Calculator';
import WordCounterContent from './seo/word-counter/content.mdx';

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
  'finance/salary-calculator': { Calculator: SalaryCalculator, Content: SalaryContent },
  'finance/sales-tax-calculator': { Calculator: SalesTaxCalculator, Content: SalesTaxContent },
  'finance/simple-interest-calculator': {
    Calculator: SimpleInterestCalculator,
    Content: SimpleInterestContent,
  },
  'finance/sip-calculator': { Calculator: SipCalculator, Content: SipContent },
  'finance/vat-calculator': { Calculator: VatCalculator, Content: VatContent },
  'health/bmi-calculator': { Calculator: BmiCalculator, Content: BmiContent },
  'health/bmr-calculator': { Calculator: BmrCalculator, Content: BmrContent },
  'health/body-fat-calculator': { Calculator: BodyFatCalculator, Content: BodyFatContent },
  'health/calorie-calculator': { Calculator: CalorieCalculator, Content: CalorieContent },
  'health/ideal-weight-calculator': {
    Calculator: IdealWeightCalculator,
    Content: IdealWeightContent,
  },
  'health/tdee-calculator': { Calculator: TdeeCalculator, Content: TdeeContent },
  'health/water-intake-calculator': {
    Calculator: WaterIntakeCalculator,
    Content: WaterIntakeContent,
  },
  'math/average-calculator': { Calculator: AverageCalculator, Content: AverageContent },
  'math/percentage-calculator': {
    Calculator: PercentageCalculator,
    Content: PercentageContent,
  },
  'math/ratio-calculator': { Calculator: RatioCalculator, Content: RatioContent },
  'math/fraction-calculator': { Calculator: FractionCalculator, Content: FractionContent },
  'math/standard-deviation-calculator': {
    Calculator: StandardDeviationCalculator,
    Content: StandardDeviationContent,
  },
  'conversion/area-converter': { Calculator: AreaConverter, Content: AreaConverterContent },
  'conversion/data-storage-converter': {
    Calculator: DataStorageConverter,
    Content: DataStorageConverterContent,
  },
  'conversion/speed-converter': {
    Calculator: SpeedConverter,
    Content: SpeedConverterContent,
  },
  'conversion/length-converter': {
    Calculator: LengthConverter,
    Content: LengthConverterContent,
  },
  'conversion/temperature-converter': {
    Calculator: TemperatureConverter,
    Content: TemperatureConverterContent,
  },
  'conversion/weight-converter': {
    Calculator: WeightConverter,
    Content: WeightConverterContent,
  },
  'conversion/volume-converter': {
    Calculator: VolumeConverter,
    Content: VolumeConverterContent,
  },
  'conversion/time-converter': {
    Calculator: TimeConverter,
    Content: TimeConverterContent,
  },
  'conversion/pressure-converter': {
    Calculator: PressureConverter,
    Content: PressureConverterContent,
  },
  'math/significant-figures-calculator': {
    Calculator: SignificantFiguresCalculator,
    Content: SignificantFiguresContent,
  },
  'health/waist-to-height-ratio-calculator': {
    Calculator: WaistToHeightRatioCalculator,
    Content: WaistToHeightRatioContent,
  },
  'date-time/business-days-calculator': {
    Calculator: BusinessDaysCalculator,
    Content: BusinessDaysContent,
  },
  'developer/cron-expression-translator': {
    Calculator: CronExpressionTranslator,
    Content: CronExpressionContent,
  },
  'lifestyle/electricity-cost-calculator': {
    Calculator: ElectricityCostCalculator,
    Content: ElectricityCostContent,
  },
  'date-time/age-calculator': { Calculator: AgeCalculator, Content: AgeCalculatorContent },
  'date-time/date-difference-calculator': {
    Calculator: DateDifferenceCalculator,
    Content: DateDifferenceContent,
  },
  'date-time/time-zone-converter': {
    Calculator: TimeZoneConverter,
    Content: TimeZoneConverterContent,
  },
  'date-time/work-hours-calculator': {
    Calculator: WorkHoursCalculator,
    Content: WorkHoursContent,
  },
  'developer/base64-encoder': { Calculator: Base64Encoder, Content: Base64EncoderContent },
  'developer/case-converter': { Calculator: CaseConverter, Content: CaseConverterContent },
  'developer/color-converter': { Calculator: ColorConverter, Content: ColorConverterContent },
  'developer/hash-generator': { Calculator: HashGenerator, Content: HashGeneratorContent },
  'developer/json-formatter': { Calculator: JsonFormatter, Content: JsonFormatterContent },
  'developer/password-generator': {
    Calculator: PasswordGenerator,
    Content: PasswordGeneratorContent,
  },
  'developer/unix-timestamp-converter': {
    Calculator: UnixTimestampConverter,
    Content: UnixTimestampContent,
  },
  'developer/uuid-generator': { Calculator: UuidGenerator, Content: UuidGeneratorContent },
  'lifestyle/discount-calculator': { Calculator: DiscountCalculator, Content: DiscountContent },
  'lifestyle/fuel-cost-calculator': { Calculator: FuelCostCalculator, Content: FuelCostContent },
  'lifestyle/tip-calculator': { Calculator: TipCalculator, Content: TipCalculatorContent },
  'seo/character-counter': {
    Calculator: CharacterCounter,
    Content: CharacterCounterContent,
  },
  'seo/keyword-density-calculator': {
    Calculator: KeywordDensityCalculator,
    Content: KeywordDensityContent,
  },
  'seo/readability-calculator': {
    Calculator: ReadabilityCalculator,
    Content: ReadabilityContent,
  },
  'seo/slug-generator': { Calculator: SlugGenerator, Content: SlugGeneratorContent },
  'seo/word-counter': { Calculator: WordCounter, Content: WordCounterContent },
};

export function getToolModule(category: string, slug: string): ToolModule | undefined {
  return toolModules[`${category}/${slug}`];
}
