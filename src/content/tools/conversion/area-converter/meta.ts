import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'area-converter',
  category: 'conversion',
  name: 'Area Converter',
  h1: 'Area Converter',
  metaTitle: 'Area Converter — sq m, sq ft, Acres, Hectares',
  metaDescription:
    'Convert between square metres, square feet, acres, hectares and square miles using exact defined factors, with the squaring trap that catches most people explained.',
  shortDescription:
    'Convert area between metric and imperial units, including acres and hectares, using the exact squared factors rather than a length conversion applied twice.',
  keywords: [
    'area converter',
    'square feet to square metres',
    'acres to hectares',
    'sq m to sq ft',
    'land area converter',
    'square metre calculator',
  ],
  faqs: [
    {
      question: 'How many square feet are in a square metre?',
      answer:
        'Approximately 10.7639. The exact relationship comes from squaring the length factor: a foot is exactly 0.3048 metres, so a square foot is 0.3048² = 0.09290304 square metres, and one square metre is 1 ÷ 0.09290304 = 10.76391041671 square feet. The figure is irrational-looking but exact — it is a definition, not a measurement.',
    },
    {
      question: 'Why can I not just multiply by the length conversion factor?',
      answer:
        'Because area has two dimensions and both of them change. Converting metres to feet multiplies by about 3.28, but converting square metres to square feet multiplies by 3.28² ≈ 10.76. Using the length factor on an area understates the result by a factor of about 3.3, which is the single most common unit error in construction quotes and flooring orders.',
    },
    {
      question: 'How big is an acre?',
      answer:
        'An acre is exactly 43,560 square feet, or 4,046.8564224 square metres — roughly 0.405 hectares. Historically it was the area one ox team could plough in a day, defined as a strip one furlong (660 ft) long by one chain (66 ft) wide. That is why an acre is a specific awkward number rather than a round one, and why it is not square: the traditional shape is a long rectangle.',
    },
    {
      question: 'What is the difference between an acre and a hectare?',
      answer:
        'A hectare is a metric unit equal to 10,000 square metres — a square 100 metres on each side. An acre is an imperial unit of 4,046.8564224 square metres. One hectare is about 2.471 acres, and one acre is about 0.4047 hectares. Land is sold in hectares across most of Europe and in acres in the United States, the United Kingdom and much of the Commonwealth.',
    },
    {
      question: 'How do I calculate the area of a room?',
      answer:
        'For a rectangular room, multiply length by width in the same unit. A room 4.2 m by 3.6 m is 15.12 square metres. For an L-shaped room, split it into rectangles, calculate each, and add them. Measure to the wall face rather than the skirting board if you are ordering flooring, and add a waste allowance on top — typically 5% for straight-laid flooring and 10% or more for diagonal or patterned work.',
    },
    {
      question: 'Is a square metre the same as a metre squared?',
      answer:
        'In everyday use, yes — both mean an area of one square metre. The phrases diverge only when a number is attached: "four square metres" is an area of 4 m², whereas "four metres squared" strictly means a square with four-metre sides, which is 16 m². The ambiguity is common enough that it is worth writing the unit rather than saying it.',
    },
    {
      question: 'What is a square used for in roofing?',
      answer:
        'In North American roofing, a square is 100 square feet — the unit shingles and underlayment are priced and ordered in. A roof described as 24 squares is 2,400 square feet of roof surface, which is not the same as the building footprint because a pitched roof has more surface than the ground it covers. This converter handles the area arithmetic; the pitch multiplier is a separate step.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI Brochure), 9th edition',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title: 'NIST Special Publication 811 — Guide for the Use of the International System of Units',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title: 'NIST Handbook 44 — Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices, Appendix C',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/owm/publications/nist-handbooks/nist-handbook-44',
    },
  ],
  relatedSlugs: ['conversion/length-converter'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
