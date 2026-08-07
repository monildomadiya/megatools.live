import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'tip-calculator',
  category: 'lifestyle',
  name: 'Tip Calculator',
  h1: 'Tip Calculator & Bill Splitter',
  metaTitle: 'Tip Calculator — Split a Bill and Tip Correctly',
  metaDescription:
    'Work out a tip and split the bill between any number of people, with the option to tip on the pre-tax total and to round the amount each person pays.',
  shortDescription:
    'Work out a tip and split a bill evenly, with the option to tip on the pre-tax total rather than the amount at the bottom of the receipt.',
  keywords: [
    'tip calculator',
    'bill splitter',
    'how much to tip',
    'split the bill',
    'gratuity calculator',
    'tip percentage',
  ],
  faqs: [
    {
      question: 'Should I tip on the pre-tax or post-tax total?',
      answer:
        'Etiquette guidance in the United States generally says pre-tax, on the reasoning that sales tax is money going to the state rather than payment for service. In practice most people tip on the total at the bottom of the receipt, partly because card terminals suggest amounts calculated that way. The difference is small — on a 9% sales tax and a 20% tip, tipping on the post-tax figure adds about 1.8% of the bill — so this calculator supports both and shows what each comes to.',
    },
    {
      question: 'How much should I tip at a restaurant in the United States?',
      answer:
        'The common range for sit-down table service is 15% to 20%, with 20% widely treated as the standard for satisfactory service. Pew Research Center found in 2023 that 57% of Americans would tip 15% or less for an average sit-down meal, so real behaviour sits somewhat below the figure etiquette guides recommend. Counter service, where no table service is provided, attracts far lower rates or none.',
    },
    {
      question: 'Why is tipping expected more in the US than elsewhere?',
      answer:
        'Because of how tipped workers are paid. Under the federal Fair Labor Standards Act an employer may count tips toward the minimum wage, paying a cash wage as low as $2.13 an hour provided tips bring the total to at least the full federal minimum. Tips are therefore part of the wage rather than a bonus on top of it. Many states set higher tipped minimums or ban the practice entirely, and most countries outside the US pay full wages and treat tipping as optional.',
    },
    {
      question: 'Is a service charge the same as a tip?',
      answer:
        'No, and the distinction matters. A mandatory service charge — often added automatically for large parties — is treated as the employer’s revenue, not as a tip, and the business decides how much of it reaches staff. A tip is voluntary and belongs to the worker. If a service charge already appears on your bill, check before adding a further tip, and if you want to be certain the money reaches your server, cash is the reliable route.',
    },
    {
      question: 'How do I split a bill when people ordered very differently?',
      answer:
        'An even split is the right tool only when the orders were roughly comparable. When one person had a starter and three drinks and another had a salad and tap water, splitting evenly transfers real money between friends. In that case add up each person’s items, then apply the same tip percentage to each subtotal — the tip stays proportional and nobody subsidises anyone. This calculator handles the even split; the uneven case is arithmetic best done per person.',
    },
    {
      question: 'Do I need to declare tips I receive as income?',
      answer:
        'In the United States, yes. The IRS treats all tips as taxable income, including cash tips, tips received electronically, and amounts shared through a tip pool. Employees receiving $20 or more in tips in a month are required to report them to their employer, who then withholds tax on them. Rules differ elsewhere, so check the guidance from your own tax authority.',
    },
    {
      question: 'Should I round the tip or the total?',
      answer:
        'Either works, and rounding is mostly a convenience. Rounding the per-person amount up to a whole unit of currency is the most useful option when several people are paying separately in cash, because it removes the problem of nobody having the right change. The calculator shows the exact figure alongside the rounded one so you can see what the rounding actually costs.',
    },
  ],
  sources: [
    {
      title: 'Wages and the Fair Labor Standards Act — Tipped Employees',
      publisher: 'United States Department of Labor, Wage and Hour Division',
      url: 'https://www.dol.gov/agencies/whd/flsa/tips',
    },
    {
      title: 'Topic no. 761 — Tips, withholding and reporting',
      publisher: 'Internal Revenue Service (IRS)',
      url: 'https://www.irs.gov/taxtopics/tc761',
    },
    {
      title: 'Tipping Culture in America: Public Opinion on Who and How Much to Tip (2023)',
      publisher: 'Pew Research Center',
      url: 'https://www.pewresearch.org/social-trends/2023/11/09/tipping-culture-in-america-public-opinion-on-who-and-how-much-to-tip/',
    },
  ],
  relatedSlugs: ['math/percentage-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
};

export default meta;
