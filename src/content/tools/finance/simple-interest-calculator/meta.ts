import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'simple-interest-calculator',
  category: 'finance',
  name: 'Simple Interest Calculator',
  h1: 'Simple Interest Calculator',
  metaTitle: 'Simple Interest Calculator — I = P × r × t',
  metaDescription:
    'Work out simple interest and the total repayable, see how far it drifts from compound interest over the same term, and check which day-count basis applies.',
  shortDescription:
    'Calculate simple interest on a principal, and see exactly how much less it is than compound interest over the same term.',
  leadAnswer:
    'Simple interest is calculated only on the original principal, never on interest already earned. The formula is I = P × r × t — principal, times the annual rate as a decimal, times the time in years. Unlike compound interest, the amount earned each year never changes.',
  keywords: [
    'simple interest calculator',
    'simple interest formula',
    'interest calculator',
    'principal rate time',
    'simple vs compound interest',
    'daily simple interest',
  ],
  faqs: [
    {
      question: 'What is the simple interest formula?',
      answer:
        'Interest equals principal times rate times time: I = P × r × t. The rate is a decimal rather than a percentage, so 6 percent is 0.06, and time is measured in the same unit the rate is quoted in — an annual rate needs the term in years. The total repayable is P + I, which can also be written as P(1 + rt).',
    },
    {
      question: 'What is the difference between simple and compound interest?',
      answer:
        'Simple interest is charged only on the original principal, so the amount added each period never changes. Compound interest is charged on the principal plus everything accrued so far, so each period adds more than the last. Over one year at the same rate they are nearly identical; over twenty years compound produces dramatically more, because the gap grows exponentially rather than linearly.',
    },
    {
      question: 'Where is simple interest actually used?',
      answer:
        'Most car loans and many personal loans in the US accrue simple interest on the outstanding balance. Short-term commercial paper, some bonds’ coupon calculations, and statutory interest on late government payments also use it. Mortgages, credit cards and savings accounts almost always compound.',
    },
    {
      question: 'What does “simple interest loan” mean on a car loan?',
      answer:
        'It means interest is calculated on the balance you actually owe on the day your payment is due, rather than being fixed at the start of the loan. The practical consequence is that paying early or paying extra genuinely reduces the interest you pay. The alternative, precomputed interest, fixes the total finance charge up front, so early payment saves you much less or nothing at all.',
    },
    {
      question: 'Does the number of days in a year matter?',
      answer:
        'It does, and it is one of the more common sources of small unexplained discrepancies. Dividing an annual rate by 360 rather than 365 makes each day slightly more expensive — about 1.4 percent more interest over a full year. Different markets use different conventions, and a loan agreement will normally state which basis applies.',
    },
    {
      question: 'How do I calculate simple interest for months or days?',
      answer:
        'Convert the term into a fraction of a year and keep the rate annual. Six months is 0.5 years; 90 days is 90 ÷ 365 of a year, or 90 ÷ 360 on a commercial basis. Converting the rate instead of the term works too, but mixing the two — an annual rate with a term in months — is the mistake that produces answers twelve times too large.',
    },
    {
      question: 'Can I rearrange the formula to find the rate or the term?',
      answer:
        'Yes, it is a single multiplication so any variable falls out by division: r = I ÷ (P × t), t = I ÷ (P × r), and P = I ÷ (r × t). This is genuinely useful for checking a quoted deal — dividing the total interest by the principal and the term tells you the implied annual rate, which is often not the rate that was advertised.',
    },
    {
      question: 'Is simple interest better for a borrower than compound?',
      answer:
        'On the same nominal rate and term, yes, and increasingly so the longer the term runs. But the rate is rarely the same. A lender quoting simple interest generally quotes a higher rate to compensate, so comparing the total repayable is the only reliable test. Compare what you actually hand over, not the headline percentage.',
    },
  ],
  sources: [
    {
      title:
        'What’s the difference between a simple interest rate and precomputed interest on an auto loan?',
      publisher: 'Consumer Financial Protection Bureau (CFPB)',
      url: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/',
    },
    {
      title: 'How does compound interest work?',
      publisher: 'Consumer Financial Protection Bureau (CFPB)',
      url: 'https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/',
    },
    {
      title: 'Prompt Payment — simple daily interest on late government payments',
      publisher: 'Bureau of the Fiscal Service, US Department of the Treasury',
      url: 'https://fiscal.treasury.gov/payments-from-government/prompt-payment/interest',
    },
  ],
  relatedSlugs: ['finance/compound-interest-calculator', 'finance/loan-emi-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
