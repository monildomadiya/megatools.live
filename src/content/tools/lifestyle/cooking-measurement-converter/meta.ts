import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'cooking-measurement-converter',
  category: 'lifestyle',
  name: 'Cooking Measurement Converter',
  h1: 'Cooking Measurement Converter',
  metaTitle: 'Cooking Measurement Converter — Cups to Grams',
  metaDescription:
    'Convert cups, tablespoons, millilitres, grams and ounces for real ingredients, with the four different cup sizes and the density each conversion needs.',
  shortDescription:
    'Convert cups, spoons, millilitres, grams and ounces per ingredient — including the four cup sizes recipes actually use.',
  leadAnswer:
    'Cups measure volume and grams measure mass, so converting between them is only possible for a named ingredient: a cup of flour and a cup of honey weigh very different amounts. There are also four cup sizes in circulation, from the 236.6 ml US customary cup to the 284.1 ml imperial one.',
  keywords: [
    'cups to grams converter',
    'cooking measurement converter',
    'grams to cups',
    'tablespoon to ml',
    'baking conversion calculator',
    'recipe measurement converter',
  ],
  faqs: [
    {
      question: 'How many grams are in a cup?',
      answer:
        'It depends entirely on what is in the cup. A US customary cup holds 236.6 ml, and that volume weighs about 125 g of plain flour, 200 g of granulated sugar, 237 g of water or 339 g of honey. Any answer given without naming the ingredient is answering a different question, which is why this converter asks for one.',
    },
    {
      question: 'Why do American and Australian cups differ?',
      answer:
        'They were standardised separately. The US customary cup is half a US pint, or 236.5882365 ml exactly. The metric cup used in Australia and New Zealand is a round 250 ml. US nutrition labelling uses a third value, a legal cup of 240 ml, and older British recipes may use a 284 ml imperial cup. The spread between the smallest and largest is about 20%.',
    },
    {
      question: 'Is an Australian tablespoon really different?',
      answer:
        'Yes, and it is the conversion error that bites hardest. An Australian tablespoon is 20 ml — four teaspoons rather than three. A US tablespoon is 14.8 ml and the metric one used in the UK and Europe is 15 ml. Following an Australian recipe with a US spoon under-measures by a third, which matters most for raising agents and salt, where a third is the difference between right and inedible.',
    },
    {
      question: 'Why do flour weights vary between sources?',
      answer:
        'Because a cup of flour is not a fixed amount. Scooping the cup through the bag compacts the flour and can put 145 g or more into it; spooning flour in and levelling it off gives about 120 to 125 g. That is a 20% range for the same written instruction, which is exactly why bakers weigh. Published charts differ because they assume different filling methods, not because one of them is wrong.',
    },
    {
      question: 'Can I convert grams to cups the same way?',
      answer:
        'Yes, the arithmetic runs in both directions, and it carries the same dependence on the ingredient. Where it becomes unreliable is with anything whose packing varies — chopped vegetables, grated cheese, brown sugar, leafy herbs. For those the volume depends on how finely it was cut and how firmly it was pressed in, and no conversion factor can recover that.',
    },
    {
      question: 'Is a stick of butter a useful measure?',
      answer:
        'Only in North America, where a stick is a quarter pound: 113 g, or half a cup, or 8 tablespoons. The wrappers are printed with tablespoon markings, which makes butter one of the few ingredients where volume measuring is genuinely accurate. Elsewhere butter is sold in blocks of 250 g or 500 g and recipes give it by weight.',
    },
    {
      question: 'Does salt need special care?',
      answer:
        'More than any other ingredient. Table salt is dense and fine, and a cup of it weighs about 292 g; coarse kosher and flaked salts have much more air between the crystals and can weigh half that for the same volume. A teaspoon of one is not a teaspoon of the other, and salt is not an ingredient with room for a 50% error. Weigh it, or use the salt the recipe was written for.',
    },
  ],
  sources: [
    {
      title: '21 CFR 101.9(b)(5)(viii) — cup, tablespoon and teaspoon defined as 240, 15 and 5 millilitres for labelling',
      publisher: 'US Food and Drug Administration (eCFR)',
      url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9',
    },
    {
      title: 'FoodData Central — gram weights for household measures of individual foods',
      publisher: 'US Department of Agriculture, Agricultural Research Service',
      url: 'https://fdc.nal.usda.gov/',
    },
    {
      title: 'NIST Special Publication 811 — Guide for the Use of the International System of Units, Appendix B',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
  ],
  relatedSlugs: ['conversion/volume-converter', 'conversion/weight-converter'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
