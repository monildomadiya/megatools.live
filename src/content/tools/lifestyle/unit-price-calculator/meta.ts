import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'unit-price-calculator',
  category: 'lifestyle',
  name: 'Unit Price Calculator',
  h1: 'Unit Price Comparison Calculator',
  metaTitle: 'Unit Price Calculator — Compare Cost Per Unit',
  metaDescription:
    'Compare up to four products on price per unit, across mixed sizes and units, and see which is genuinely cheaper — including when the bigger pack is not.',
  shortDescription:
    'Compare up to four products on price per unit across mixed sizes, and see which is genuinely cheaper rather than which looks it.',
  leadAnswer:
    'A unit price is the total price divided by the quantity, expressed against a common measure such as one kilogram or one litre. It is the only figure that lets two differently sized packs be compared, because pack price alone says nothing about value and pack size alone says nothing about cost.',
  keywords: [
    'unit price calculator',
    'cost per unit calculator',
    'price per kg calculator',
    'compare prices by weight',
    'price comparison calculator',
    'best value calculator',
  ],
  faqs: [
    {
      question: 'Is the bigger pack always cheaper per unit?',
      answer:
        'No, and assuming so is what the assumption costs. Studies of supermarket shelves have repeatedly found a meaningful minority of larger packs priced higher per unit than the smaller ones beside them, particularly on promoted lines and premium ranges. Nothing prevents it — the larger size simply looks like it should be better value, and often is not. Checking takes seconds and this is the tool for it.',
    },
    {
      question: 'Why are shelf unit prices sometimes hard to compare?',
      answer:
        'Because the same shelf can show per 100g for one product and per kilogram for another, or per item for one and per litre for its neighbour. Regulations require a unit price to be displayed but do not always force the same unit across a category, which makes an eye comparison unreliable. Entering both here converts them to one basis, which is the whole point.',
    },
    {
      question: 'Does the law require shops to show a unit price?',
      answer:
        'In most of Europe and the UK, yes. The EU price indication directive and the UK Price Marking Order both require a selling price and a unit price to be shown for goods sold by weight, volume, length or area. The United States has no federal requirement — unit pricing is mandated by some states and voluntary elsewhere, which is why shelf labels there vary so much.',
    },
    {
      question: 'What is shrinkflation and how does this catch it?',
      answer:
        'Shrinkflation is a pack getting smaller while its price stays the same, which is a price rise that does not look like one. The shelf price is unchanged, so nothing draws attention to it, but the unit price has risen. If you note the unit price of things you buy regularly, a jump with no change in shelf price is exactly this — and it is invisible any other way.',
    },
    {
      question: 'Should I always buy the lowest unit price?',
      answer:
        'No. Unit price is one input and not the decision. A larger pack is worse value if part of it spoils before you use it, if you have nowhere to store it, or if having more of something makes you consume more of it. Unit price answers "which is cheaper per gram", and the useful question is usually "which costs me less overall", which includes waste.',
    },
    {
      question: 'How do I compare a multibuy against a single item?',
      answer:
        'Enter the multibuy as one line: the total price you would pay and the total quantity you would receive. Three for the price of two on 400g tins is a price of two tins against a quantity of 1200g. Setting it up that way is what makes the offer comparable to a single larger tin, and it is where a lot of promotions turn out to be worse than the plain shelf price of a bigger size.',
    },
    {
      question: 'Can I compare items sold by count against items sold by weight?',
      answer:
        'Only if you supply the missing link. Twelve bread rolls and a 800g loaf are not comparable until you know what a roll weighs. Choose one basis, convert everything to it, and enter that. Where the products genuinely differ in kind — a concentrate against a ready-to-drink version, for instance — compare the made-up quantity rather than the packaged one.',
    },
  ],
  sources: [
    {
      title: 'Directive 98/6/EC on consumer protection in the indication of the prices of products offered to consumers',
      publisher: 'European Union (EUR-Lex)',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A31998L0006',
    },
    {
      title: 'The Price Marking Order 2004 — selling price and unit price requirements',
      publisher: 'UK Government (legislation.gov.uk)',
      url: 'https://www.legislation.gov.uk/uksi/2004/102/contents/made',
    },
    {
      title: 'NIST Handbook 130 — Uniform Unit Pricing Regulation',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/owm/nist-handbook-130',
    },
  ],
  relatedSlugs: ['lifestyle/discount-calculator', 'conversion/weight-converter'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
