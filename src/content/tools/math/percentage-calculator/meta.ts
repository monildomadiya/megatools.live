import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'percentage-calculator',
  category: 'math',
  name: 'Percentage Calculator',
  h1: 'Percentage Calculator',
  metaTitle: 'Percentage Calculator — All Four Calculations',
  metaDescription:
    'Work out a percentage of a number, what percent one number is of another, percentage change, and increases or decreases — each with the working shown step by step.',
  shortDescription:
    'Four percentage calculations in one place, each showing the working so you can check it or explain it to someone else.',
  keywords: [
    'percentage calculator',
    'percentage change calculator',
    'percentage increase',
    'what percent of',
    'percentage difference',
    'percentage point',
  ],
  faqs: [
    {
      question: 'How do I calculate a percentage of a number?',
      answer:
        'Divide the percentage by 100 and multiply. Fifteen percent of 240 is (15 ÷ 100) × 240 = 36. A useful shortcut for mental arithmetic: percentages are reversible, so 15 percent of 240 equals 240 percent of 15, and one of those is usually easier to do in your head.',
    },
    {
      question: 'How do I calculate percentage change?',
      answer:
        'Subtract the old value from the new one, divide by the old value, and multiply by 100. Going from 80 to 100 is (100 − 80) ÷ 80 × 100 = 25 percent. The denominator is always the starting value, which is why the same absolute movement gives a different percentage depending on which direction you travel.',
    },
    {
      question: 'Why does a 10 percent rise then a 10 percent fall not return to the start?',
      answer:
        'Because the second percentage is taken from a different base. A price of 100 rising 10 percent becomes 110; falling 10 percent from 110 removes 11, not 10, leaving 99. To exactly undo a rise of X percent you need a fall of X ÷ (100 + X) — so reversing a 10 percent rise takes a 9.09 percent cut, and reversing a 50 percent rise takes a 33.3 percent cut.',
    },
    {
      question: 'What is the difference between percent and percentage point?',
      answer:
        'If an interest rate moves from 5 percent to 6 percent, that is a rise of one percentage point and a rise of 20 percent. Both are correct and they describe different things. The distinction matters most in reporting on rates, shares, and polling, where confusing the two can overstate or understate a change by an order of magnitude.',
    },
    {
      question: 'How do I remove a percentage that has already been added?',
      answer:
        'Divide rather than subtract. If a price of 120 includes 20 percent tax, the pre-tax figure is 120 ÷ 1.20 = 100, not 120 − 24 = 96. Subtracting takes the percentage from the wrong base and is one of the most common arithmetic errors in invoicing.',
    },
    {
      question: 'Do successive percentage discounts add up?',
      answer:
        'No, they multiply. A 20 percent discount followed by a further 10 percent off gives 0.80 × 0.90 = 0.72, a total reduction of 28 percent rather than 30. The order does not matter — the result is identical either way — but the total is always less than the sum of the parts.',
    },
    {
      question: 'What is percentage difference, and how is it different from percentage change?',
      answer:
        'Percentage change has a direction: one value is the starting point and forms the denominator. Percentage difference compares two values with no starting point, dividing by their mean instead, so it gives the same answer whichever order you enter them. Use change for before-and-after, and difference for comparing two measurements of the same thing.',
    },
    {
      question: 'Can a percentage be more than 100?',
      answer:
        'Yes. Percent simply means "per hundred" — the symbol is defined as the number 0.01, so 250 percent is just 2.5. A value that triples has increased by 200 percent and is now 300 percent of its original. Percentages above 100 only look wrong when the underlying quantity is a share of a fixed whole, where they would indeed be a mistake.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI Brochure) — the percent symbol as the number 0.01',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title: 'House style: numbers and measurements — percentages and percentage points',
      publisher: 'UK Office for National Statistics',
      url: 'https://style.ons.gov.uk/category/house-style/numbers-and-measurements/',
    },
  ],
  relatedSlugs: [],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
};

export default meta;
