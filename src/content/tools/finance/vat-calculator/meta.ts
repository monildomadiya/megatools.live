import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'vat-calculator',
  category: 'finance',
  name: 'VAT Calculator',
  h1: 'VAT Calculator',
  metaTitle: 'VAT Calculator — Add or Remove VAT at Any Rate',
  metaDescription:
    'Add VAT to a net price or strip VAT out of a gross one at 20%, 5%, 0% or any custom rate. Shows the net, the VAT, and the gross with the arithmetic explained.',
  shortDescription:
    'Add VAT to a net figure or work backwards from a VAT-inclusive price, at UK, Irish or any custom rate.',
  leadAnswer:
    'Value added tax is a consumption tax charged as a percentage of a net price at each stage of supply, with businesses reclaiming the tax they paid on their own inputs. Adding VAT means multiplying by 1 plus the rate; removing it means dividing by that same figure, never subtracting the percentage.',
  keywords: [
    'vat calculator',
    'add vat',
    'remove vat',
    'reverse vat calculator',
    'vat calculator uk',
    '20 percent vat',
  ],
  faqs: [
    {
      question: 'How do I remove VAT from a price?',
      answer:
        'Divide the gross price by 1 plus the rate expressed as a decimal. At the UK standard rate of 20%, divide by 1.2: a £120 gross price is £100 net plus £20 VAT. Subtracting 20% from the gross instead gives £96, which is wrong by £4, because the 20% was charged on the net figure rather than the gross one.',
    },
    {
      question: 'What is the VAT fraction?',
      answer:
        'The VAT fraction is the shortcut for pulling the tax straight out of a gross amount. At 20% it is 1/6, so £120 × 1/6 = £20 of VAT. At 5% it is 1/21. The general form is rate ÷ (100 + rate), which is where both of those come from.',
    },
    {
      question: 'What is the current UK VAT rate?',
      answer:
        'The UK standard rate has been 20% since 4 January 2011. A reduced rate of 5% applies to things such as domestic fuel and power, children’s car seats, and some energy-saving materials. A zero rate of 0% applies to most food, books, newspapers, and children’s clothing. HMRC publishes the full list, and it changes more often than the headline rate does.',
    },
    {
      question: 'What is the difference between zero-rated and exempt?',
      answer:
        'Zero-rated supplies are taxable at 0%, so a business making them charges no VAT but can still reclaim the VAT on its own purchases. Exempt supplies are outside the tax altogether, so no VAT is charged and none of the related input tax can be reclaimed. For the customer the price looks the same; for the supplier the cash difference is substantial.',
    },
    {
      question: 'When does a business have to register for VAT?',
      answer:
        'In the UK, registration is compulsory once VAT-taxable turnover passes the threshold in any rolling twelve-month period, or when you expect to pass it in the next thirty days alone. The threshold was set at £90,000 from 1 April 2024. Businesses below it can register voluntarily, which is common when most customers are themselves VAT-registered.',
    },
    {
      question: 'Do EU countries all charge the same VAT?',
      answer:
        'No. The EU VAT Directive sets the framework and a minimum standard rate of 15%, but each member state sets its own rates within it. Standard rates currently range from 17% in Luxembourg to 27% in Hungary, and each country has its own list of reduced-rated goods. Always use the rate of the country where the supply is taxed.',
    },
    {
      question: 'Should VAT be rounded up or down?',
      answer:
        'HMRC allows VAT calculated on a total invoice to be rounded down to the nearest penny, a concession that exists because rounding up on every line would systematically overcharge. Retailers using line-by-line calculation may round to the nearest penny instead. This calculator rounds to two decimal places, so a figure may differ from an invoice by a penny.',
    },
    {
      question: 'Does the price on a shop shelf include VAT?',
      answer:
        'In the UK and the EU, prices advertised to consumers must include VAT. Prices quoted business-to-business are usually shown net, with VAT added at invoice. That is why the same item can appear to cost two different amounts on a trade site and a consumer one when nothing has changed but which figure is being displayed.',
    },
  ],
  sources: [
    {
      title: 'VAT rates on different goods and services',
      publisher: 'HM Revenue & Customs (GOV.UK)',
      url: 'https://www.gov.uk/guidance/rate-of-vat-on-different-goods-and-services',
    },
    {
      title: 'VAT Guide (VAT Notice 700)',
      publisher: 'HM Revenue & Customs (GOV.UK)',
      url: 'https://www.gov.uk/guidance/vat-guide-notice-700',
    },
    {
      title: 'Council Directive 2006/112/EC on the common system of value added tax',
      publisher: 'EUR-Lex, European Union',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32006L0112',
    },
    {
      title: 'VAT rates applied in EU member states',
      publisher: 'European Commission — Taxation and Customs Union',
      url: 'https://taxation-customs.ec.europa.eu/taxation/vat/vat-rates_en',
    },
    {
      title: 'Register for VAT — thresholds',
      publisher: 'HM Revenue & Customs (GOV.UK)',
      url: 'https://www.gov.uk/register-for-vat',
    },
  ],
  relatedSlugs: ['finance/sales-tax-calculator', 'math/percentage-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
