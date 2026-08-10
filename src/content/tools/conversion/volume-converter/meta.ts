import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'volume-converter',
  category: 'conversion',
  name: 'Volume Converter',
  h1: 'Volume Converter',
  metaTitle: 'Volume Converter — Litres, Gallons, Cups, Fluid Ounces',
  metaDescription:
    'Convert litres, millilitres, US and imperial gallons, cups, pints and fluid ounces using exact defined factors, including where the US and UK units differ.',
  shortDescription:
    'Convert between metric, US customary and imperial volume units using exact factors, with the US and imperial gallon shown side by side rather than merged.',
  leadAnswer:
    'Volume is the amount of three-dimensional space something occupies, measured in litres and cubic metres in the metric system and in gallons, quarts, pints and fluid ounces in the US and imperial systems. The two customary systems share unit names but not sizes: a US gallon is 3.785 litres, an imperial gallon 4.546.',
  keywords: [
    'volume converter',
    'litres to gallons',
    'ml to cups',
    'cups to ml',
    'fluid ounces to ml',
    'gallons to litres',
    'cc to ml',
    'pint to litres',
  ],
  faqs: [
    {
      question: 'Is a US gallon the same as an imperial gallon?',
      answer:
        'No, and the gap is large enough to matter. A US liquid gallon is exactly 3.785411784 litres, defined as 231 cubic inches. An imperial gallon is exactly 4.54609 litres, defined by the UK Weights and Measures Act. The imperial gallon is about 20% bigger, so a car quoted at 40 miles per imperial gallon does roughly 33 miles per US gallon for identical fuel consumption. Every unit built on the gallon inherits the difference: US and imperial quarts, pints and fluid ounces are all different sizes from each other.',
    },
    {
      question: 'How many millilitres are in a cup?',
      answer:
        'It depends which cup, which is why this converter names the system rather than offering a bare "cup". The US customary cup used in most American recipes is a sixteenth of a US gallon, or 236.5882365 mL. The US legal cup, which the FDA requires for nutrition labelling, is exactly 240 mL. The metric cup used in Australia and New Zealand is exactly 250 mL. A recipe written against one and measured with another is out by up to 6%, which matters for baking and rarely matters for soup.',
    },
    {
      question: 'Is one cubic centimetre the same as one millilitre?',
      answer:
        'Yes, exactly, and it has been since 1964. That year the General Conference on Weights and Measures redefined the litre as exactly one cubic decimetre, which makes 1 mL exactly 1 cm³. Between 1901 and 1964 the litre was instead defined as the volume of one kilogram of water at maximum density, which made it 1.000028 dm³ — so a millilitre and a cubic centimetre differed in the seventh significant figure. Engine displacement quoted in cc and medicine doses quoted in mL are using the same unit under two names.',
    },
    {
      question: 'What is the difference between a US and an imperial fluid ounce?',
      answer:
        'A US fluid ounce is 29.5735295625 mL; an imperial fluid ounce is 28.4130625 mL. The imperial one is about 4% smaller, which is the opposite direction to the gallon difference and catches people out. It happens because the imperial gallon is divided into 160 fluid ounces while the US gallon is divided into 128. Neither fluid ounce has any fixed relationship to the ounce of weight, despite the shared name.',
    },
    {
      question: 'What is a dry pint and why is it different?',
      answer:
        'The United States maintains a separate set of dry measures for produce, distinct from its liquid measures. A US dry pint is about 550.6 mL against the 473.2 mL of a US liquid pint — roughly 16% larger. Dry units appear on berry punnets and in agricultural trading, and a bushel is the same system scaled up. This converter handles liquid measure only; converting a dry pint with a liquid factor understates the volume by about a sixth.',
    },
    {
      question: 'Can I convert litres to kilograms?',
      answer:
        'Not with a volume converter alone, because that conversion needs a density. Mass equals volume times density, so a litre of fresh water at 4°C is very close to one kilogram, a litre of petrol is about 0.75 kg, and a litre of honey is about 1.42 kg. The water case is near enough to one that people generalise it, which is where the error comes from. If you need mass, find the density of the specific substance first.',
    },
    {
      question: 'Why do tablespoon measurements differ between countries?',
      answer:
        'Because the tablespoon was standardised nationally rather than internationally. The US tablespoon is half a US fluid ounce, or 14.7868 mL. The UK metric tablespoon is 15 mL, close enough that the difference never shows in cooking. The Australian tablespoon is 20 mL, a third larger, which is enough to matter for raising agents, salt and strong spices. When a recipe crosses borders, the volume spoons are the measurements most likely to be silently wrong.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI), 9th edition — non-SI units accepted for use',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title: 'NIST Handbook 44 — Specifications, Tolerances and Technical Requirements for Weighing and Measuring Devices',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/owm/nist-handbook-44',
    },
    {
      title: 'Weights and Measures Act 1985, Schedule 1 — definitions of units of measurement',
      publisher: 'UK Government (legislation.gov.uk)',
      url: 'https://www.legislation.gov.uk/ukpga/1985/72/schedule/1',
    },
  ],
  relatedSlugs: ['health/water-intake-calculator', 'lifestyle/fuel-cost-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
