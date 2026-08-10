import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'waist-to-height-ratio-calculator',
  category: 'health',
  name: 'Waist-to-Height Ratio Calculator',
  h1: 'Waist-to-Height Ratio Calculator',
  metaTitle: 'Waist-to-Height Ratio Calculator — NICE Thresholds',
  metaDescription:
    'Work out your waist-to-height ratio and read it against the NICE thresholds, with the measurement protocol and the groups the ratio is not validated for.',
  shortDescription:
    'Divide waist by height to estimate central adiposity, read against the NICE categories, with the measurement protocol that makes the number comparable.',
  leadAnswer:
    'Waist-to-height ratio divides waist circumference by height in the same units. It estimates central adiposity — fat carried around the abdomen — which tracks cardiometabolic risk more closely than overall weight does. NICE advises adults to keep the ratio below 0.5, which is the origin of the guidance to keep your waist under half your height.',
  keywords: [
    'waist to height ratio calculator',
    'waist height ratio',
    'whtr calculator',
    'central obesity calculator',
    'waist to height ratio chart',
    'is my waist half my height',
  ],
  faqs: [
    {
      question: 'Why use waist-to-height ratio instead of BMI?',
      answer:
        'Because BMI cannot see where weight sits, and location matters. Two people of identical height and weight have identical BMI whether the weight is muscle on the shoulders or fat around the abdomen, and only the second pattern is strongly associated with cardiometabolic risk. A 2012 systematic review and meta-analysis by Ashwell and colleagues found waist-to-height ratio outperformed both BMI and waist circumference alone as a screening tool for those risk factors. It is a complement to BMI rather than a replacement — NICE recommends using both.',
    },
    {
      question: 'Where exactly do I measure my waist?',
      answer:
        'At the midpoint between the bottom of your lowest rib and the top of your hip bone, which is roughly level with the navel for most people but should be found by feel rather than assumed. Measure directly against the skin or over light clothing, stand relaxed with feet together, and take the reading at the end of a normal breath out without pulling the tape tight. Measuring over a waistband, or at the narrowest point, or while holding your stomach in, are the three things that make the number incomparable to anyone else’s.',
    },
    {
      question: 'What do the categories mean?',
      answer:
        'NICE sets four bands for adults. Below 0.4 indicates low central adiposity, though it can also flag being underweight and is worth discussing with a clinician. From 0.4 to 0.49 is the healthy range. From 0.5 to 0.59 indicates increased central adiposity and increased health risk. At 0.6 and above the risk is classed as high. The thresholds are deliberately simple because the point of the measure is that anyone can apply it with a tape measure and no chart.',
    },
    {
      question: 'Does the ratio work for everyone?',
      answer:
        'No, and this is the important limitation. NICE advises using it for adults with a BMI under 35 — above that, central adiposity can be assumed and the ratio adds nothing. It is not validated for pregnancy, where waist measurement no longer means what it usually means. Children need age-specific and sex-specific guidance rather than the adult 0.5 threshold. And people with substantial muscle mass around the trunk, or certain medical conditions affecting abdominal size, will get a reading that does not describe their fat distribution.',
    },
    {
      question: 'Does ethnicity change the thresholds?',
      answer:
        'For waist circumference measured on its own, yes — lower cut-offs are recommended for people of South Asian, Chinese and other Asian family backgrounds, because cardiometabolic risk appears at a smaller absolute waist size. One of the arguments for the waist-to-height ratio is that scaling to height absorbs much of that difference, which is why NICE applies a single 0.5 threshold across groups. It absorbs much of it rather than all of it, so the ratio remains a screening step rather than a diagnosis.',
    },
    {
      question: 'Do I need to convert units first?',
      answer:
        'No, and that is the practical appeal of the measure. Because both numbers are lengths, the units cancel — a waist of 80 cm against a height of 170 cm gives the same 0.47 as 31.5 inches against 66.9 inches. The only rule is that both measurements use the same unit. This calculator handles the pairing for you, but the arithmetic is simple enough to do on a phone with a tape measure in the other hand.',
    },
    {
      question: 'How much does the ratio need to change to matter?',
      answer:
        'For an adult of average height, one point of ratio — going from 0.52 to 0.51 — is roughly one to two centimetres of waist. Day-to-day variation from meals, hydration and the time of day is of a similar size, which means a single reading is a rough position rather than a precise value. Measure at the same time of day under the same conditions and compare over weeks rather than days, and treat a move across a category boundary as a signal to look again rather than as an event in itself.',
    },
  ],
  sources: [
    {
      title: 'Overweight and obesity management (NG246) — measuring central adiposity',
      publisher: 'National Institute for Health and Care Excellence (NICE)',
      url: 'https://www.nice.org.uk/guidance/ng246',
    },
    {
      title: 'Obesity and overweight — fact sheet',
      publisher: 'World Health Organization (WHO)',
      url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
    },
    {
      title:
        'Waist-to-height ratio is a better screening tool than waist circumference and BMI for adult cardiometabolic risk factors: systematic review and meta-analysis (Obesity Reviews, 2012)',
      publisher: 'Ashwell M, Gunn P, Gibson S — Obesity Reviews',
      url: 'https://doi.org/10.1111/j.1467-789X.2011.00952.x',
    },
  ],
  relatedSlugs: ['health/bmi-calculator', 'health/body-fat-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
