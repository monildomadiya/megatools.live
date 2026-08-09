import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'sip-calculator',
  category: 'finance',
  name: 'SIP Calculator',
  h1: 'SIP Calculator',
  metaTitle: 'SIP Calculator — Mutual Fund Returns & Step-Up',
  metaDescription:
    'Project what a monthly SIP grows to, with an optional annual step-up and an inflation-adjusted figure showing what the final amount is actually worth.',
  shortDescription:
    'Project the maturity value of a monthly SIP, including annual step-ups and what the result is worth after inflation.',
  leadAnswer:
    'A systematic investment plan, or SIP, invests a fixed amount at regular intervals rather than as a lump sum. Each instalment compounds for however long remains until maturity, so the earliest contributions do most of the work — which is why starting a year earlier beats contributing slightly more.',
  keywords: [
    'sip calculator',
    'systematic investment plan calculator',
    'mutual fund sip calculator',
    'step up sip calculator',
    'sip returns calculator',
    'monthly investment calculator',
  ],
  faqs: [
    {
      question: 'How is SIP maturity value calculated?',
      answer:
        'Each instalment is a separate investment that compounds for however many months remain until maturity, so the total is the sum of a series. The closed form is FV = P × [((1+i)ⁿ − 1) ÷ i] × (1+i), where P is the monthly amount, i is the annual return divided by 12, and n is the number of instalments. The trailing (1+i) reflects money going in at the start of each month rather than the end.',
    },
    {
      question: 'What return rate should I assume?',
      answer:
        'There is no correct answer, which is the honest response. Equity fund returns are not fixed and past performance does not carry forward. The useful approach is to run the calculation at several rates — say 8, 10 and 12 percent — and look at the spread rather than picking one figure and treating the output as a forecast. If the plan only works at the top of that range, it is not a plan.',
    },
    {
      question: 'What is a step-up SIP?',
      answer:
        'A step-up, or top-up, SIP raises the monthly amount by a fixed percentage each year, usually to track your income. It matters far more than most people expect: increasing a contribution by 10 percent annually over 20 years typically produces a substantially larger corpus than the flat equivalent, because the increases arrive early enough to compound for most of the term.',
    },
    {
      question: 'What is rupee cost averaging?',
      answer:
        'Because the instalment amount is fixed, a falling market buys more units and a rising market buys fewer. Over a long horizon this lowers the average cost per unit relative to buying the same total at a single moment, which is what makes regular investing less sensitive to entry timing. It reduces timing risk; it does not remove market risk.',
    },
    {
      question: 'Is SIP better than a lump sum investment?',
      answer:
        'They answer different questions. If you already hold the full amount, historical evidence generally favours investing it at once, because markets rise more often than they fall and cash waiting to be invested earns less. SIP wins when the money does not exist yet — it is a way of investing income as it arrives, and its real advantage is behavioural: an automated instalment does not require you to decide anything each month.',
    },
    {
      question: 'Why is the inflation-adjusted figure so much lower?',
      answer:
        'Because it answers the question you actually care about. A corpus of ₹1 crore in 20 years buys what roughly ₹37 lakh buys today at 5 percent inflation. Any long-horizon projection quoted in future rupees flatters itself; converting back to today’s money is the only way to tell whether the plan reaches a real goal.',
    },
    {
      question: 'Does this calculator account for tax and expense ratios?',
      answer:
        'No. It projects gross growth at the rate you enter. Fund expense ratios come out of returns before you see them, so entering a rate net of expenses is closer to reality, and capital gains tax applies on redemption in most jurisdictions. Both reduce the final figure, and neither is modelled here because both depend on the specific fund and your tax residency.',
    },
    {
      question: 'Can I stop or change a SIP?',
      answer:
        'Yes. SIPs are not locked-in contracts — you can pause, reduce, increase or stop them, though funds with a lock-in such as ELSS hold each instalment for its own term from its own date. The financial cost of stopping is not a penalty; it is the compounding that instalment would have earned over the remaining years, which is why stopping early in a long plan costs disproportionately more than stopping late.',
    },
  ],
  sources: [
    {
      title: 'SEBI Investor — investor education on securities markets and mutual funds',
      publisher: 'Securities and Exchange Board of India (SEBI)',
      url: 'https://investor.sebi.gov.in/',
    },
    {
      title: 'Registered intermediaries — list of SEBI-registered mutual funds',
      publisher: 'Securities and Exchange Board of India (SEBI)',
      url: 'https://www.sebi.gov.in/intermediaries.html',
    },
    {
      title: 'How does compound interest work?',
      publisher: 'Consumer Financial Protection Bureau (CFPB)',
      url: 'https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/',
    },
  ],
  relatedSlugs: ['finance/compound-interest-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
  featured: true,
};

export default meta;
