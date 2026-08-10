import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'discount-calculator',
  category: 'lifestyle',
  name: 'Discount Calculator',
  h1: 'Discount Calculator',
  metaTitle: 'Discount Calculator — Sale Price and Percent Off',
  metaDescription:
    'Work out a sale price, the amount you save, and what stacked discounts really come to. Handles percentage off, money off, a second discount, and tax.',
  shortDescription:
    'Find the sale price and the real saving from one discount or two stacked ones, with or without tax.',
  leadAnswer:
    'A percentage discount is applied by multiplying the original price by one minus the discount as a decimal: 25% off £80 is 80 × 0.75 = £60. Two discounts applied one after the other never add up — 30% off followed by a further 20% off is 44% off in total, not 50%.',
  keywords: [
    'discount calculator',
    'percent off calculator',
    'sale price calculator',
    'stacked discount calculator',
    'how much do i save',
    'reverse discount calculator',
  ],
  faqs: [
    {
      question: 'How do I calculate a percentage discount?',
      answer:
        'Multiply the original price by the discount as a decimal to get the saving, or by one minus that decimal to get the price directly. For 25% off £80: the saving is 80 × 0.25 = £20, and the sale price is 80 × 0.75 = £60. The second form is fewer steps and avoids a subtraction error.',
    },
    {
      question: 'Do two discounts add together?',
      answer:
        'No. A second discount applies to the already-reduced price, not the original one. Take 30% off, then 20% off the remainder: you pay 0.70 × 0.80 = 0.56 of the original, which is 44% off rather than 50%. The shortcut is to multiply the remaining fractions and subtract from one.',
    },
    {
      question: 'Does it matter whether tax is added before or after the discount?',
      answer:
        'Not to the final figure. Multiplication commutes, so discounting then taxing gives the same total as taxing then discounting. It matters to the paperwork rather than the price: a receipt should show tax charged on the amount actually paid, which is why retailers apply the discount first.',
    },
    {
      question: 'What percentage off is this price?',
      answer:
        'Divide the saving by the original price and multiply by 100. A jacket down from £120 to £78 saves £42, and 42 ÷ 120 × 100 = 35% off. Dividing by the sale price instead is the common mistake and would give 53.8%, which is the mark-up needed to go back the other way.',
    },
    {
      question: 'Is “buy one get one free” the same as 50% off?',
      answer:
        'Only if you wanted two. BOGOF is 50% off per item across a pair, but it is a 100% increase in what you spend and what you carry home. Buy one get one half price is 25% off the pair. Three for two is 33.3% off across three items. Each is worth exactly what the extra items are worth to you.',
    },
    {
      question: 'Can a shop compare its sale price against any price it likes?',
      answer:
        'No. In the EU, Article 6a of the Price Indication Directive requires that any announced price reduction states the lowest price applied in at least the previous 30 days. In the US, the FTC’s Guides Against Deceptive Pricing require a former price to have been a genuine, bona fide offering price rather than a fictitious one invented to be marked down.',
    },
    {
      question: 'What does “up to 70% off” usually mean?',
      answer:
        'That at least one item somewhere in the sale is 70% off. It says nothing about the rest, and typically the deepest reductions sit on the least popular sizes and colours. Treat the headline as the maximum of a distribution, not its centre.',
    },
    {
      question: 'How do I compare two offers on different pack sizes?',
      answer:
        'Reduce both to price per unit — per 100 g, per litre, per item — after the discount. A larger pack at a lower headline discount often still wins. Unit pricing on shelf labels is mandatory for most pre-packed goods in the UK and EU precisely because this comparison is otherwise so hard to do in a shop.',
    },
  ],
  sources: [
    {
      title: 'Guides Against Deceptive Pricing, 16 CFR Part 233',
      publisher: 'US Federal Trade Commission (eCFR)',
      url: 'https://www.ecfr.gov/current/title-16/part-233',
    },
    {
      title:
        'Directive 98/6/EC on consumer protection in the indication of the prices of products',
      publisher: 'EUR-Lex, European Union',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A31998L0006',
    },
    {
      title:
        'Directive (EU) 2019/2161 — better enforcement and modernisation of consumer protection rules',
      publisher: 'EUR-Lex, European Union',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32019L2161',
    },
    {
      title: 'Digital Markets, Competition and Consumers Act 2024',
      publisher: 'UK Government (legislation.gov.uk)',
      url: 'https://www.legislation.gov.uk/ukpga/2024/13/contents',
    },
  ],
  relatedSlugs: ['math/percentage-calculator', 'finance/sales-tax-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
