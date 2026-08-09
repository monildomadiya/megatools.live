import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'sales-tax-calculator',
  category: 'finance',
  name: 'Sales Tax Calculator',
  h1: 'Sales Tax & VAT Calculator',
  metaTitle: 'Sales Tax & VAT Calculator — Add or Remove Tax',
  metaDescription:
    'Add sales tax or VAT to a price, or work backwards from a tax-inclusive total to the net amount, with the reverse calculation most people get wrong explained.',
  shortDescription:
    'Add sales tax or VAT to a net price, or strip it back out of a gross one — including the reverse calculation that catches almost everyone.',
  keywords: [
    'sales tax calculator',
    'vat calculator',
    'reverse vat calculator',
    'add sales tax',
    'remove vat from price',
    'gst calculator',
  ],
  faqs: [
    {
      question: 'How do I work out the tax inside a price that already includes it?',
      answer:
        'Divide by 1 plus the rate, not by the rate. At 20% VAT, a £120 gross price is £120 ÷ 1.20 = £100 net, so the VAT is £20. The mistake people make is taking 20% of £120 and getting £24, which is wrong because the tax was charged on the £100, not on the £120. The shortcut for 20% VAT is to divide the gross by 6 to get the tax.',
    },
    {
      question: 'What is the difference between VAT and sales tax?',
      answer:
        'VAT is charged at every stage of the supply chain, with each business reclaiming the VAT it paid on its inputs, so only the value added at each step is taxed. Sales tax is charged once, at the final retail sale to a consumer. The practical difference for a buyer is where the tax appears: VAT is normally included in the displayed price in Europe, while US sales tax is added at the till, which is why an American price tag and an American receipt show different numbers.',
    },
    {
      question: 'Why is US sales tax not included in the shelf price?',
      answer:
        'Because the rate depends on the exact address of the sale. A US sales tax rate is a stack of state, county, city and special-district rates, and there are over 11,000 taxing jurisdictions. Two shops a mile apart can owe different rates, and online orders are taxed at the delivery address. A national retailer cannot print one tax-inclusive price on packaging, so the tax is added at the point of sale.',
    },
    {
      question: 'What is the standard rate of VAT in the UK?',
      answer:
        '20%. There is also a reduced rate of 5% covering domestic fuel and power, children’s car seats and some energy-saving materials, and a zero rate covering most food, books, newspapers, children’s clothing and public transport. Zero-rated is not the same as exempt: a zero-rated business charges 0% but can still reclaim its input VAT, while an exempt business cannot.',
    },
    {
      question: 'How do I calculate a price before tax from a receipt total?',
      answer:
        'Divide the total by 1 plus the combined rate. If a receipt totals $107.25 with an 8.25% sales tax, the pre-tax subtotal is 107.25 ÷ 1.0825 = $99.08, and the tax is $8.17. Be careful with a receipt that has mixed rates on it — groceries and prepared food are often taxed differently in the same shop, and one division across the whole total will not reproduce either line.',
    },
    {
      question: 'Is VAT rounded up or down?',
      answer:
        'HMRC allows a VAT-registered business to round the total VAT down to the nearest penny on an invoice, or to round each line to the nearest penny using normal arithmetic rounding. Both are acceptable, but they can give different totals on a multi-line invoice, which is why an invoice and a purchase order sometimes differ by a penny or two. This calculator uses ordinary arithmetic rounding on the final figure.',
    },
    {
      question: 'Do I have to charge sales tax on online sales to another state?',
      answer:
        'Often yes. Since the US Supreme Court decision in South Dakota v. Wayfair in 2018, a state can require an out-of-state seller to collect sales tax once it passes an economic nexus threshold — commonly $100,000 in sales or 200 transactions into that state in a year. The thresholds and rules vary by state, and this is a question for an accountant rather than a calculator.',
    },
  ],
  sources: [
    {
      title: 'VAT rates',
      publisher: 'UK Government (GOV.UK) / HM Revenue & Customs',
      url: 'https://www.gov.uk/vat-rates',
    },
    {
      title: 'VAT rules and rates in the EU',
      publisher: 'European Commission — Your Europe',
      url: 'https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm',
    },
    {
      title: 'California Sales and Use Tax Rates',
      publisher: 'California Department of Tax and Fee Administration (CDTFA)',
      url: 'https://www.cdtfa.ca.gov/taxes-and-fees/sales-use-tax-rates.htm',
    },
  ],
  relatedSlugs: ['finance/salary-calculator', 'math/percentage-calculator'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
