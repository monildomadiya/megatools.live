import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'apr-to-apy-calculator',
  category: 'finance',
  name: 'APR to APY Calculator',
  h1: 'APR to APY & Effective Interest Rate Calculator',
  metaTitle: 'APR to APY Calculator — Effective Annual Rate',
  metaDescription:
    'Convert a nominal APR to the APY it really pays, or an APY back to a nominal rate, at any compounding frequency — with what each figure legally includes.',
  shortDescription:
    'Convert a nominal APR to the effective annual rate it actually pays, at any compounding frequency, and back again.',
  leadAnswer:
    'A nominal annual rate states what is charged before compounding is taken into account; the effective annual rate, quoted as APY on savings, states what a full year actually costs or earns once interest is charged on interest. The two differ whenever interest compounds more often than once a year.',
  keywords: [
    'apr to apy calculator',
    'effective annual rate calculator',
    'apy calculator',
    'nominal to effective rate',
    'compounding frequency calculator',
    'ear calculator',
  ],
  faqs: [
    {
      question: 'What is the difference between APR and APY?',
      answer:
        'APR is a nominal annual rate: the periodic rate multiplied by the number of periods in a year, with the compounding within that year ignored. APY is the effective rate: what a full year actually returns once each period’s interest earns interest itself. A 12% APR compounded monthly is a 12.68% APY, and both figures describe the same account.',
    },
    {
      question: 'What is the formula?',
      answer:
        'APY equals (1 + r/n) raised to the power n, minus 1, where r is the nominal annual rate as a decimal and n is the number of compounding periods per year. Going the other way, the nominal rate is n multiplied by the nth root of (1 + APY), minus 1. Continuous compounding is the limit of the same expression: e raised to r, minus 1.',
    },
    {
      question: 'Why does US law require APY on savings and APR on loans?',
      answer:
        'To make each side comparable. Truth in Savings, Regulation DD, defines the annual percentage yield and its formula so that two deposit accounts can be set against one another regardless of how often they compound. Truth in Lending, Regulation Z, defines the annual percentage rate for credit so that the cost of borrowing includes prescribed fees, not just the interest. They are different measures because they answer different questions.',
    },
    {
      question: 'Does a quoted APR include fees?',
      answer:
        'In consumer lending, usually yes. A US APR under Regulation Z includes certain finance charges as well as interest, and the European APRC under the consumer credit directive includes the total cost of credit to the borrower. That is why a mortgage APR is higher than its interest rate. A credit card purchase APR, by contrast, is generally a pure nominal rate with fees stated separately.',
    },
    {
      question: 'How much does compounding frequency actually change things?',
      answer:
        'Less than people expect at low rates, and more than expected at high ones. At 5% nominal, moving from annual to monthly compounding adds about 0.12 percentage points. At 24%, it adds about 2.8. The gap widens with the square of the rate, roughly, so it barely matters on a savings account and matters a great deal on a credit card.',
    },
    {
      question: 'What rate does a credit card actually charge?',
      answer:
        'Most card issuers apply a daily periodic rate: the purchase APR divided by 365, applied to the balance each day. Carry a balance all year at a 22.9% APR and the effective cost is about 25.7%, because each day’s interest joins the balance the next day. The APR on the statement is the nominal figure and the effective rate is never printed.',
    },
    {
      question: 'What does continuous compounding mean in practice?',
      answer:
        'It is the limit as the compounding periods become infinitely short, and it gives the mathematical ceiling for a given nominal rate: e to the power r, minus 1. No retail product uses it, but it is standard in derivative pricing and it is useful as a bound — if daily and continuous compounding give almost the same answer, and they do, then arguing about daily versus hourly is wasted effort.',
    },
  ],
  sources: [
    {
      title: '12 CFR Part 1030 — Truth in Savings (Regulation DD), including the annual percentage yield formula',
      publisher: 'Consumer Financial Protection Bureau (eCFR)',
      url: 'https://www.ecfr.gov/current/title-12/part-1030',
    },
    {
      title: '12 CFR Part 1026 — Truth in Lending (Regulation Z), annual percentage rate and finance charge',
      publisher: 'Consumer Financial Protection Bureau (eCFR)',
      url: 'https://www.ecfr.gov/current/title-12/part-1026',
    },
    {
      title: 'Directive 2008/48/EC on credit agreements for consumers — the annual percentage rate of charge',
      publisher: 'European Union (EUR-Lex)',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32008L0048',
    },
  ],
  relatedSlugs: ['finance/compound-interest-calculator', 'finance/credit-card-payoff-calculator'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
