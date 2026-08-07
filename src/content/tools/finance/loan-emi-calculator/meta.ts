import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'loan-emi-calculator',
  category: 'finance',
  name: 'Loan EMI Calculator',
  h1: 'Loan EMI Calculator',
  metaTitle: 'Loan EMI Calculator — Monthly Payment & Interest',
  metaDescription:
    'Calculate the monthly payment on any amortising loan, see the total interest it will cost, and find out how much an extra payment each month would save you.',
  shortDescription:
    'Find the monthly payment on a personal, car, or education loan, the total interest it costs, and what overpaying would save.',
  keywords: [
    'loan emi calculator',
    'emi calculator',
    'monthly loan payment',
    'personal loan calculator',
    'car loan calculator',
    'loan interest calculator',
  ],
  faqs: [
    {
      question: 'What does EMI mean?',
      answer:
        'Equated Monthly Instalment — a fixed monthly payment that covers both interest and principal, sized so the loan reaches zero exactly at the end of the term. The term is standard in India and increasingly used elsewhere; in the US and UK the same thing is usually just called the monthly payment on an amortising loan. The arithmetic is identical either way.',
    },
    {
      question: 'How is EMI calculated?',
      answer:
        'EMI = P × r(1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments. The payment stays constant while its composition shifts: interest is charged on the outstanding balance, so early instalments are mostly interest and later ones mostly principal.',
    },
    {
      question: 'Does a longer term cost more?',
      answer:
        'Substantially, even at the same rate. A 25,000 loan at 11 percent costs 4,464.85 in interest over three years and 7,613.63 over five — 70 percent more interest for a monthly payment that is about a third lower. A longer term buys breathing room in the monthly budget and pays for it in total cost.',
    },
    {
      question: 'What is the difference between flat rate and reducing balance?',
      answer:
        'Reducing balance charges interest on what you still owe, so the interest falls as you repay. Flat rate charges interest on the original amount for the whole term, which roughly doubles the effective cost — a 10 percent flat rate over five years works out to about 17.3 percent on a reducing balance, and over three years to about 17.9 percent. This calculator uses reducing balance, which is how mortgages, most personal loans, and all regulated APR disclosures work. If a lender quotes a flat rate, ask for the APR.',
    },
    {
      question: 'How much does overpaying actually save?',
      answer:
        'More than the size of the overpayment suggests, because every extra unit paid stops accruing interest for the entire remaining term. The saving is largest early on when the balance is highest, and it shortens the term rather than reducing the instalment unless you specifically ask the lender to recalculate. Check for early repayment charges first — they are common on fixed-rate products.',
    },
    {
      question: 'Why is my lender’s EMI different from this?',
      answer:
        'Usually processing fees, insurance bundled into the loan, or a rate that differs from the one you entered. Some lenders also charge interest from the disbursement date rather than the first instalment date, which adds a partial period of interest at the start. The principal-and-interest arithmetic itself is standard and should match.',
    },
    {
      question: 'Should I compare loans on interest rate or APR?',
      answer:
        'APR, because it folds in mandatory fees and expresses the whole cost as an annual rate. Two loans at the same nominal rate can have materially different APRs once arrangement fees are included, and the one with the lower headline rate is not always the cheaper loan.',
    },
    {
      question: 'What happens if I miss a payment?',
      answer:
        'Interest continues to accrue on the unpaid balance and most lenders add a late fee, so the loan ends up costing more than any schedule here shows. If the shortfall is large enough that the payment no longer covers the interest, the balance can grow rather than shrink — negative amortisation. Talk to the lender before missing a payment rather than after.',
    },
  ],
  sources: [
    {
      title: 'What is amortization and how could it affect my auto loan?',
      publisher: 'Consumer Financial Protection Bureau',
      url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/',
    },
    {
      title: 'What is negative amortization?',
      publisher: 'Consumer Financial Protection Bureau',
      url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-negative-amortization-en-103/',
    },
    {
      title: 'Consumer Credit (G.19) — average finance rates on consumer loans',
      publisher: 'Board of Governors of the Federal Reserve System',
      url: 'https://www.federalreserve.gov/releases/g19/current/',
    },
    {
      title: 'Selected Interest Rates (H.15)',
      publisher: 'Board of Governors of the Federal Reserve System',
      url: 'https://www.federalreserve.gov/releases/h15/',
    },
  ],
  relatedSlugs: ['finance/mortgage-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
};

export default meta;
