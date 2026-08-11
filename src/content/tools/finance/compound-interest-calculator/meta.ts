import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'compound-interest-calculator',
  category: 'finance',
  name: 'Compound Interest Calculator',
  h1: 'Compound Interest Calculator',
  metaTitle: 'Compound Interest Calculator — With Contributions',
  metaDescription:
    'Project savings growth with compound interest and regular contributions. Shows how much you paid in versus what the interest earned, plus the effective annual rate.',
  shortDescription:
    'Project how savings grow with compound interest and regular contributions, and see exactly how much of the final balance you paid in yourself.',
  leadAnswer:
    'Compound interest is interest earned on interest: each period’s interest is added to the balance, so the next period earns on a larger sum. For a lump sum the balance after t years is A = P(1 + r/n)^(nt), where n is how many times a year interest is compounded.',
  keywords: [
    'compound interest calculator',
    'compound interest formula',
    'investment growth calculator',
    'savings calculator with monthly contributions',
    'effective annual rate',
    'rule of 72',
  ],
  faqs: [
    {
      question: 'What is the compound interest formula?',
      answer:
        'For a lump sum, A = P(1 + r/n)^(nt), where P is the starting amount, r is the annual rate as a decimal, n is how many times a year interest is compounded, and t is the number of years. Regular contributions need a second term added: PMT × [((1 + i)^N − 1) ÷ i], where i is the periodic rate and N the total number of periods.',
    },
    {
      question: 'How much difference does compounding frequency make?',
      answer:
        'Much less than people expect. Ten thousand at 7 percent for ten years grows to 19,671.51 compounded annually, 20,096.61 compounded monthly, and 20,137.53 compounded continuously — the entire span from yearly to continuous is about 466, or 2.4 percent. The rate and the number of years matter far more than the frequency.',
    },
    {
      question: 'What is the rule of 72?',
      answer:
        'Divide 72 by the annual percentage rate to approximate how many years it takes for money to double. At 7 percent, 72 ÷ 7 gives 10.29 years against an actual 10.24 — close enough for mental arithmetic. It is most accurate near 8 percent and drifts at the extremes: at 2 percent it says 36 years when the answer is 35, and at 15 percent it says 4.8 when the answer is 4.96.',
    },
    {
      question: 'What is the difference between interest rate and APY?',
      answer:
        'The nominal rate is the headline annual figure. The annual percentage yield, or effective annual rate, is what you actually earn once compounding within the year is accounted for. A 7 percent nominal rate compounded monthly gives an APY of 7.23 percent. When comparing savings accounts, compare APY — it is the only figure that puts different compounding schedules on the same footing.',
    },
    {
      question: 'Does this account for inflation?',
      answer:
        'No. Every figure is in nominal terms, meaning the currency of the day rather than purchasing power. If your projection returns 7 percent and inflation runs at 3 percent, the real growth in what the money can buy is closer to 3.9 percent — not 4, because the adjustment is a ratio rather than a subtraction. A large nominal balance thirty years out will buy considerably less than the same number today.',
    },
    {
      question: 'Does this account for tax?',
      answer:
        'No. Interest and investment gains are taxable in most places, and the treatment depends on the account type, your income, and where you live. A tax-sheltered retirement account will compound closer to these figures than a standard savings account will. Treat the result as a pre-tax ceiling.',
    },
    {
      question: 'Why does the calculator assume a constant rate?',
      answer:
        'Because the formula requires one. Real investment returns are not constant — they arrive as a sequence of good and bad years, and the order matters when you are also contributing or withdrawing. A fixed-rate projection is a reasonable way to compare scenarios against each other, and a poor way to predict any single outcome.',
    },
    {
      question: 'When should contributions be counted, at the start or end of the period?',
      answer:
        'It changes the answer by roughly one period of interest. A contribution made at the start of each month earns interest for that month; one made at the end does not. Over long horizons the difference compounds into a few percent of the final balance. This calculator lets you choose, and defaults to end-of-period because that is when most salary-linked transfers actually land.',
    },
  ],
  sources: [
    {
      title: 'Compound interest — definition and worked explanation',
      publisher: 'U.S. Securities and Exchange Commission (Investor.gov)',
      url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest',
    },
    {
      title: 'Compound Interest Calculator — official SEC investor tool',
      publisher: 'U.S. Securities and Exchange Commission (Investor.gov)',
      url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
    },
    {
      title: 'Selected Interest Rates (H.15)',
      publisher: 'Board of Governors of the Federal Reserve System',
      url: 'https://www.federalreserve.gov/releases/h15/',
    },
  ],
  relatedSlugs: ['math/percentage-calculator', 'date-time/date-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
  featured: true,
};

export default meta;
