import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'fuel-economy-converter',
  category: 'conversion',
  name: 'Fuel Economy Converter',
  h1: 'Fuel Economy Converter',
  metaTitle: 'Fuel Economy Converter — MPG, L/100km, km/L',
  metaDescription:
    'Convert between US MPG, imperial MPG, litres per 100 km and km per litre using exact factors — and see the fuel actually used, which MPG hides.',
  shortDescription:
    'Convert between US MPG, imperial MPG, litres per 100 km and km/L, with the fuel actually consumed shown alongside.',
  leadAnswer:
    'Fuel economy is quoted two opposite ways. Distance per unit of fuel — miles per gallon, kilometres per litre — rises as a car improves. Fuel per unit of distance, such as litres per 100 kilometres, falls as it improves. The two are reciprocals, so converting between them means dividing rather than multiplying by a factor.',
  keywords: [
    'fuel economy converter',
    'mpg to l/100km',
    'l/100km to mpg',
    'us mpg to imperial mpg',
    'km per litre converter',
    'fuel consumption converter',
  ],
  faqs: [
    {
      question: 'Why is a UK mpg figure higher than a US one for the same car?',
      answer:
        'Because the gallons are different sizes. The imperial gallon is 4.54609 litres and the US liquid gallon is 3.785411784 litres, about 20% smaller. A car doing 40 mpg in the United States does 48 mpg by the imperial measure without anything changing. Comparing a US road test against a UK brochure figure without converting overstates the difference by roughly a fifth every time.',
    },
    {
      question: 'How do I convert mpg to litres per 100 km?',
      answer:
        'Divide, do not multiply. For US mpg the constant is 235.214583, so litres per 100 km equals 235.214583 divided by the mpg figure. For imperial mpg the constant is 282.480936. Both come from the exact definitions of the gallon and the mile, and the division is what preserves the reciprocal relationship between the two ways of measuring.',
    },
    {
      question: 'What is the MPG illusion?',
      answer:
        'It is the finding that people read miles per gallon as if fuel saved were proportional to the mpg gain, when it is not. Going from 15 to 20 mpg saves far more fuel over the same distance than going from 40 to 50 mpg, though the second improvement looks larger. Larrick and Soll demonstrated the misjudgement experimentally in 2008, and it is the reason US window stickers now also carry gallons per 100 miles.',
    },
    {
      question: 'Which measure should I use?',
      answer:
        'Fuel per distance — litres per 100 km, or gallons per 100 miles — if you are comparing options or budgeting. It is linear in what you actually pay for, so differences can be subtracted and totals added. Distance per fuel is fine as a familiar headline figure but misleads whenever two vehicles are being compared, which is most of the time it gets used.',
    },
    {
      question: 'Why does my car never match its official figure?',
      answer:
        'Official figures come from a standardised laboratory cycle, not from your commute. WLTP replaced the older NEDC test in Europe precisely because the gap had grown large, and the EPA applies adjustment factors to its own test results for the same reason. Cold starts, short trips, speed, load, tyre pressure and climate control all move real consumption, and none of them are represented in a test that has to be repeatable.',
    },
    {
      question: 'How do electric cars fit into this?',
      answer:
        'They do not, directly — there is no fuel volume to divide by. Electric consumption is quoted in kWh per 100 km, or in miles per kWh, which is the same reciprocal pair in different units. The US MPGe figure converts electricity to a petrol-equivalent energy content, so it can be compared with an mpg number, but it says nothing about running cost because a kWh and a gallon are not priced alike.',
    },
    {
      question: 'Is km/L used anywhere in particular?',
      answer:
        'Yes — it is the standard measure in Japan, India, and much of South America and the Middle East, while most of Europe uses litres per 100 km. Both are metric and they are reciprocals of one another, so a figure quoted in one is meaningless in the other without converting. All four measures on this page are shown at once for that reason.',
    },
  ],
  sources: [
    {
      title: 'NIST Special Publication 811 — Guide for the Use of the International System of Units, Appendix B (conversion factors)',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title: 'The MPG Illusion — Larrick & Soll, Science 320:5883 (2008)',
      publisher: 'American Association for the Advancement of Science',
      url: 'https://www.science.org/doi/10.1126/science.1154983',
    },
    {
      title: 'Fuel Economy Label — gallons per 100 miles and how the figures are produced',
      publisher: 'US Environmental Protection Agency / Department of Energy (fueleconomy.gov)',
      url: 'https://www.fueleconomy.gov/feg/label/learn-more-gasoline-label.shtml',
    },
    {
      title: 'Weights and Measures Act 1985, Schedule 1 — the gallon defined as 4.54609 cubic decimetres',
      publisher: 'UK Government (legislation.gov.uk)',
      url: 'https://www.legislation.gov.uk/ukpga/1985/72/schedule/1',
    },
  ],
  relatedSlugs: ['lifestyle/fuel-cost-calculator', 'conversion/volume-converter'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
