import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'ideal-weight-calculator',
  category: 'health',
  name: 'Ideal Weight Calculator',
  h1: 'Ideal Weight Calculator',
  metaTitle: 'Ideal Weight Calculator — Devine, Hamwi & BMI',
  metaDescription:
    'Compare the Devine, Hamwi, Robinson and Miller ideal weight formulas side by side, and see the healthy BMI weight range that actually applies to your height.',
  shortDescription:
    'See what four competing ideal weight formulas give for your height, and why the healthy BMI range is a better answer than any of them.',
  leadAnswer:
    'Ideal body weight formulas — Devine, Robinson, Miller and Hamwi — estimate a target weight from height and sex. All four descend from the same mid-century insurance tables, so their close agreement reflects shared ancestry rather than independent confirmation. A healthy BMI range is the better answer.',
  keywords: [
    'ideal weight calculator',
    'ideal body weight',
    'devine formula',
    'hamwi formula',
    'healthy weight for height',
    'ideal weight for height and age',
  ],
  faqs: [
    {
      question: 'Which ideal weight formula is the correct one?',
      answer:
        'None of them is authoritative. Pai and Paloucek traced all four back to the same mid-century insurance height-weight tables, which is why they agree so closely — the similarity is shared ancestry, not independent confirmation. If you want one number, use the midpoint of the healthy BMI range instead; it is the only figure on this page derived from health outcomes rather than from actuarial tables.',
    },
    {
      question: 'Why was the Devine formula invented?',
      answer:
        'To calculate drug doses. Devine published it in 1974 in a paper about gentamicin dosing, because some drugs distribute through lean tissue rather than fat and dosing an obese patient on total body weight would overdose them. It was never validated as a health target, and it is still used in clinical pharmacy for exactly the purpose it was built for.',
    },
    {
      question: 'Why do the four formulas disagree with each other?',
      answer:
        'They apply different slopes per inch of height. Hamwi adds 2.7 kg per inch above five feet for men, Miller only 1.41. At average heights the gap is small, but it widens at the extremes — a 6 ft 4 in man gets answers roughly 10 kg apart, which is the clearest sign that the precision these formulas appear to offer is not real.',
    },
    {
      question: 'Do these formulas work for short people?',
      answer:
        'Poorly. All four are defined as a base weight at five feet plus a fixed amount per inch above it, so below five feet they extrapolate backwards off the end of the data they were fitted to. For anyone under about 5 ft the healthy BMI range is the only figure on this page worth using.',
    },
    {
      question: 'Should ideal weight change with age?',
      answer:
        'None of these formulas has an age term, and the healthy BMI band does not shift either. What changes is body composition: adults lose muscle from roughly their forties onward, so holding a constant weight across decades usually means gradually trading muscle for fat. In older adults, sitting at the very bottom of the healthy range is not obviously better than sitting in the middle of it.',
    },
    {
      question: 'What is the healthy BMI weight range?',
      answer:
        'The World Health Organization classifies a BMI of 18.5 to 24.9 as healthy weight for adults. Multiplying each end by your height in metres squared converts that into a weight range for you specifically. It is a range rather than a point on purpose — there is no evidence that any single weight inside it is better than the others.',
    },
    {
      question: 'What is the universal BMI-based equation?',
      answer:
        'Peterson and colleagues published it in 2016 as a replacement for the older formulas. It computes the weight corresponding to any target BMI at any height using 2.2 × BMI + 3.5 × BMI × (height in metres − 1.5). Unlike the insurance-table formulas it works at every height, applies to both sexes, and lets you choose the target rather than inheriting someone else’s.',
    },
    {
      question: 'Does the calculator account for muscle or frame size?',
      answer:
        'No, and neither does any height-based formula — height is the only input they have. A heavily muscled person will land above every figure here while carrying very little fat. If your build is unusual, a body fat measurement will tell you far more than an ideal weight will.',
    },
  ],
  sources: [
    {
      title: 'The origin of the “ideal” body weight equations (Ann Pharmacother, 2000)',
      publisher: 'Pai & Paloucek — via PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10981254/',
    },
    {
      title:
        'Universal equation for estimating ideal body weight and body weight at any BMI (Am J Clin Nutr, 2016)',
      publisher: 'Peterson et al. — via PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27030535/',
    },
    {
      title: 'Obesity and overweight — fact sheet',
      publisher: 'World Health Organization',
      url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
    },
    {
      title: 'Calculate Your Body Mass Index',
      publisher: 'National Heart, Lung, and Blood Institute (NIH)',
      url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm',
    },
  ],
  relatedSlugs: ['health/bmi-calculator', 'health/body-fat-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
