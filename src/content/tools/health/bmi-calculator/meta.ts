import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'bmi-calculator',
  category: 'health',
  name: 'BMI Calculator',
  h1: 'BMI Calculator',
  metaTitle: 'BMI Calculator — Body Mass Index & Waist Ratio',
  metaDescription:
    'Calculate your BMI in metric or US units, see your WHO weight category and healthy weight range, plus the waist-to-height ratio NICE recommends alongside it.',
  shortDescription:
    'Work out your body mass index, see where it sits against WHO categories, and check your waist-to-height ratio at the same time.',
  leadAnswer:
    'Body mass index is your weight in kilograms divided by your height in metres squared. The World Health Organization classifies 18.5 to 24.9 as healthy weight for adults, 25.0 to 29.9 as overweight, and 30.0 or above as obesity. It screens populations well and individuals poorly.',
  keywords: [
    'bmi calculator',
    'body mass index',
    'bmi chart',
    'healthy weight range',
    'waist to height ratio',
    'bmi calculator metric',
  ],
  faqs: [
    {
      question: 'What is a healthy BMI for adults?',
      answer:
        'The World Health Organization classifies a BMI of 18.5 to 24.9 as healthy weight for adults. Below 18.5 is underweight, 25.0 to 29.9 is overweight, and 30.0 or above is obesity. These bands apply to adults aged 20 and over and are the same for men and women.',
    },
    {
      question: 'How do I calculate BMI by hand?',
      answer:
        'In metric units, divide your weight in kilograms by your height in metres squared. Someone who is 70 kg and 1.75 m tall has a BMI of 70 ÷ (1.75 × 1.75) = 22.9. In US units, multiply your weight in pounds by 703, then divide by your height in inches squared.',
    },
    {
      question: 'Is BMI accurate for athletes and muscular people?',
      answer:
        'No. BMI uses only weight and height, so it cannot tell muscle from fat. Muscle is denser than fat, so a well-trained rugby player or weightlifter can land in the overweight or obese range while carrying very little body fat. If you train heavily with weights, body fat percentage and waist measurement will tell you more than BMI will.',
    },
    {
      question: 'Why do some countries use lower BMI thresholds?',
      answer:
        'A 2004 WHO expert consultation found that people of Asian descent tend to develop type 2 diabetes and cardiovascular disease at lower BMI values than European populations. Rather than redefine overweight, WHO added public health action points at 23.0, 27.5, 32.5 and 37.5 that individual countries can adopt. Singapore, China, Japan and India each use thresholds in this lower range.',
    },
    {
      question: 'Does BMI work for children?',
      answer:
        'Not in this form. Children and teenagers are still growing, so their BMI is compared against age-and-sex percentile charts rather than fixed cut-offs. A BMI of 20 can be entirely healthy for a 16-year-old and high for a 6-year-old. Use a paediatric BMI-for-age percentile chart instead.',
    },
    {
      question: 'What is waist-to-height ratio and why measure it too?',
      answer:
        'Waist-to-height ratio is your waist circumference divided by your height in the same units. It estimates central fat — the fat stored around your organs — which BMI cannot see. NICE guideline NG246 recommends that adults with a BMI below 35 measure it alongside BMI, treating 0.5 or above as an increased health risk. The rule of thumb is to keep your waist under half your height.',
    },
    {
      question: 'Does a healthy BMI change as you get older?',
      answer:
        'The official bands do not change with age, but what they mean does. Adults lose muscle mass from roughly their forties onward, so an older person can hold a steady BMI while their body composition shifts toward more fat and less muscle. In older adults, being at the very bottom of the healthy range is not necessarily better than being in the middle of it.',
    },
    {
      question: 'Is BMI different for men and women?',
      answer:
        'The thresholds are identical. That is one of the measure’s known weaknesses: women typically carry a higher proportion of body fat than men at the same BMI, so the same number does not describe the same body composition in both.',
    },
    {
      question: 'Should I use BMI at all?',
      answer:
        'It is useful as a first, rough screen and for comparing populations, which is what it was designed for. It is a poor tool for judging an individual on its own. Pair it with a waist measurement, and treat any result near a boundary as a prompt to look further rather than a diagnosis.',
    },
  ],
  sources: [
    {
      title: 'Obesity and overweight — fact sheet',
      publisher: 'World Health Organization',
      url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
    },
    {
      title:
        'Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies (Lancet, 2004)',
      publisher: 'WHO Expert Consultation',
      url: 'https://pubmed.ncbi.nlm.nih.gov/14726171/',
    },
    {
      title:
        'Identifying and assessing overweight, obesity and central adiposity — guideline NG246',
      publisher: 'National Institute for Health and Care Excellence (NICE)',
      url: 'https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity',
    },
    {
      title: 'Calculate Your Body Mass Index',
      publisher: 'National Heart, Lung, and Blood Institute (NIH)',
      url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm',
    },
    {
      title: 'Adult Overweight & Obesity — definitions and health risks',
      publisher: 'National Institute of Diabetes and Digestive and Kidney Diseases (NIH)',
      url: 'https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity',
    },
  ],
  relatedSlugs: ['health/bmr-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
  featured: true,
};

export default meta;
