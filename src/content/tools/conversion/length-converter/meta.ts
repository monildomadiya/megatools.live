import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'length-converter',
  category: 'conversion',
  name: 'Length Converter',
  h1: 'Length & Distance Converter',
  metaTitle: 'Length Converter — Metric and Imperial Units',
  metaDescription:
    'Convert between millimetres, centimetres, metres, kilometres, inches, feet, yards, miles and nautical miles using the exact internationally defined factors.',
  shortDescription:
    'Convert length between metric and imperial units using the exact defined factors, not the rounded approximations most converters use.',
  leadAnswer:
    'Length conversions between metric and imperial units are exact by definition rather than by approximation. The 1959 international yard and pound agreement fixed the yard at exactly 0.9144 metres, which makes an inch exactly 25.4 millimetres and every other imperial length factor a consequence of that one number.',
  keywords: [
    'length converter',
    'distance converter',
    'cm to inches',
    'feet to metres',
    'km to miles',
    'metric imperial converter',
  ],
  faqs: [
    {
      question: 'How many centimetres are in an inch?',
      answer:
        'Exactly 2.54. This is not a measurement or an approximation — it is a definition. The 1959 international yard and pound agreement defined the international inch as exactly 25.4 millimetres, which makes every inch-to-metric conversion exact rather than rounded.',
    },
    {
      question: 'How do I convert kilometres to miles?',
      answer:
        'Divide by 1.609344, or multiply by 0.621371. A mile is defined as exactly 1,609.344 metres, so 5 km is 5 ÷ 1.609344 = 3.107 miles. The rough mental shortcut is to multiply by 0.6, which is accurate to about 3% — fine for a road sign, not for anything measured.',
    },
    {
      question: 'Is a nautical mile the same as a mile?',
      answer:
        'No, and the difference is large. A nautical mile is exactly 1,852 metres, about 15% longer than a statute mile of 1,609.344 metres. The nautical mile was defined to approximate one minute of latitude, which is why it is used in aviation and at sea — it maps directly onto navigational charts.',
    },
    {
      question: 'Why do some converters give slightly different answers?',
      answer:
        'Usually because they use a rounded factor somewhere in the chain. A converter that stores 1 inch as 2.5400051 cm is using the obsolete US survey inch; one that stores it as 2.54 is using the international inch. The two differ by about 2 parts per million, which is invisible on a tape measure and significant across a land survey.',
    },
    {
      question: 'What is the difference between a US survey foot and an international foot?',
      answer:
        'The international foot is exactly 0.3048 metres. The US survey foot was exactly 1200/3937 metres, roughly 0.30480061 metres — longer by about 2 parts per million. Over a mile that is about 3 mm; over 100 km it is around 200 mm, which matters in land surveying. NIST retired the US survey foot at the end of 2022, so all new work uses the international foot.',
    },
    {
      question: 'How accurate are the results from this converter?',
      answer:
        'The conversion factors are exact by definition, so the only error is the rounding applied when the answer is displayed. Results are shown to a sensible number of significant figures for the unit, and the full-precision value is used for any further conversion, so errors do not accumulate across units.',
    },
    {
      question: 'How is the metre itself defined?',
      answer:
        'Since 1983 the metre has been defined as the distance light travels in a vacuum in 1/299,792,458 of a second. Every other length unit in this converter is ultimately defined against that, including the imperial ones — the inch is defined in terms of the millimetre, not the other way round.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI Brochure), 9th edition',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title: 'Guide for the Use of the International System of Units (SI) — NIST Special Publication 811',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title: 'NIST Handbook 44 — Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/owm/publications/nist-handbooks/nist-handbook-44',
    },
    {
      title: 'US Survey Foot: Deprecation and Transition to the International Foot',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/us-surveyfoot',
    },
  ],
  relatedSlugs: ['math/percentage-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
