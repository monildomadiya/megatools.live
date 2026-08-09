import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'mortgage-calculator',
  category: 'finance',
  name: 'Mortgage Calculator',
  h1: 'Mortgage Calculator',
  metaTitle: 'Mortgage Calculator — Full Monthly Payment',
  metaDescription:
    'Work out your full monthly mortgage payment including property tax, insurance, PMI and HOA — not just principal and interest. Shows total interest and payoff date.',
  shortDescription:
    'Calculate the whole monthly payment, not just principal and interest: tax, insurance, PMI and HOA included, with total interest over the life of the loan.',
  leadAnswer:
    'A mortgage payment is an amortising loan payment: a fixed monthly amount split between interest on the outstanding balance and repayment of principal. Because the balance falls each month, the interest share shrinks and the principal share grows, while the total payment stays the same throughout the term.',
  keywords: [
    'mortgage calculator',
    'monthly mortgage payment',
    'home loan calculator',
    'PITI calculator',
    'mortgage payment with taxes and insurance',
    'PMI calculator',
  ],
  faqs: [
    {
      question: 'What does a mortgage calculator not tell you?',
      answer:
        'It cannot tell you what a lender will actually offer. Your rate depends on your credit file, your debt-to-income ratio, the property type, and the loan product — none of which a calculator can see. Treat the result as a budgeting estimate and get a written quote before committing to anything.',
    },
    {
      question: 'What is included in a monthly mortgage payment?',
      answer:
        'In the US the payment is usually described as PITI: principal, interest, taxes and insurance. Principal and interest go to the lender. Property tax and homeowners insurance are typically collected alongside them into an escrow account and paid out on your behalf. If your down payment was under 20 percent there is usually private mortgage insurance too, and if the property is in a managed community there may be HOA fees on top.',
    },
    {
      question: 'How much of my first payment goes to interest?',
      answer:
        'Most of it. Interest is charged on the outstanding balance, which is at its highest at the start, so early payments are heavily weighted toward interest. On a 320,000 loan over 30 years at 6.5 percent, the payment is about 2,023 and roughly 1,733 of that — about 86 percent — is interest. The split reverses gradually, and on those terms you do not pay more principal than interest until month 233, a little over 19 years in.',
    },
    {
      question: 'When does PMI stop?',
      answer:
        'Under the US Homeowners Protection Act, a lender must cancel PMI automatically once the balance reaches 78 percent of the original value on a conventional loan with a good payment history, and you can request cancellation at 80 percent. FHA mortgage insurance works differently and on most current FHA loans lasts the life of the loan unless you refinance.',
    },
    {
      question: 'Does paying extra each month actually help?',
      answer:
        'Substantially, because every extra unit of currency goes straight against the principal and stops accruing interest for the remaining term. On a 320,000 loan over 30 years at 6.5 percent, adding 10 percent to the monthly payment — about 202 — clears the loan in 280 months instead of 360, which is 23 years and four months rather than 30. That is just under seven years of payments removed. The effect is largest in the early years when the balance, and therefore the interest, is highest.',
    },
    {
      question: 'What is the difference between interest rate and APR?',
      answer:
        'The interest rate is what accrues on your balance. The APR folds in lender fees, points, and mortgage insurance, expressed as an annual rate, so it reflects the cost of the loan rather than just the interest. This calculator uses the interest rate, because that is what actually drives the monthly payment. Compare offers on APR.',
    },
    {
      question: 'Should I take a shorter term?',
      answer:
        'A 15-year loan carries a meaningfully higher monthly payment but far less total interest, often less than half of a 30-year equivalent. Whether that is right depends on what else you would do with the difference — and on how much room you want in your budget if your income changes. The calculator lets you compare terms directly.',
    },
    {
      question: 'Why is the lender’s figure different from this one?',
      answer:
        'Usually because of things this calculator has no way to know: your actual property tax assessment, your specific insurance quote, the PMI rate the insurer set for your credit profile, prepaid interest at closing, or a rate that includes discount points. The principal-and-interest figure should match closely; the escrow items are estimates until you have real quotes.',
    },
  ],
  sources: [
    {
      title: 'What is private mortgage insurance?',
      publisher: 'Consumer Financial Protection Bureau',
      url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/',
    },
    {
      title: 'What is an escrow or impound account?',
      publisher: 'Consumer Financial Protection Bureau',
      url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-an-escrow-or-impound-account-en-140/',
    },
    {
      title: 'Homeowners Protection Act — PMI cancellation and termination procedures',
      publisher: 'Consumer Financial Protection Bureau',
      url: 'https://files.consumerfinance.gov/f/documents/102012_cfpb_homeowners-protection-act-hpa-pmi-cancellation-act_procedures.pdf',
    },
    {
      title: 'Primary Mortgage Market Survey — weekly average mortgage rates',
      publisher: 'Freddie Mac',
      url: 'https://www.freddiemac.com/pmms',
    },
    {
      title: 'Selected Interest Rates (H.15)',
      publisher: 'Board of Governors of the Federal Reserve System',
      url: 'https://www.federalreserve.gov/releases/h15/',
    },
  ],
  relatedSlugs: ['finance/loan-emi-calculator', 'finance/compound-interest-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
  featured: true,
};

export default meta;
