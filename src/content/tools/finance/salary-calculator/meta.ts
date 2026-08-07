import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'salary-calculator',
  category: 'finance',
  name: 'Salary Calculator',
  h1: 'Salary Calculator',
  metaTitle: 'Salary Calculator — Hourly to Annual Pay',
  metaDescription:
    'Convert pay between hourly, daily, weekly, biweekly, monthly and annual, adjust for unpaid weeks, and see FLSA overtime at one and a half times the regular rate.',
  shortDescription:
    'Convert a wage between every pay period, adjust for unpaid time off, and check what overtime is actually worth.',
  keywords: [
    'salary calculator',
    'hourly to salary calculator',
    'annual salary calculator',
    'hourly wage calculator',
    'pay period calculator',
    'overtime pay calculator',
  ],
  faqs: [
    {
      question: 'How do I convert an hourly wage to an annual salary?',
      answer:
        'Multiply the hourly rate by the hours you work per week, then by the number of paid weeks in your year. The common shortcut multiplies by 2,080, which is 40 hours across 52 weeks. That shortcut assumes you are paid for every week of the year including holidays — if you take unpaid time, reduce the week count accordingly.',
    },
    {
      question: 'Why is 2,080 the standard number of work hours in a year?',
      answer:
        'It is 40 hours a week multiplied by 52 weeks. It is a convention rather than a measurement: no year contains exactly 52 weeks, and the figure includes paid holidays and paid leave as though they were worked. It is used because it makes salary comparisons consistent, not because anyone works precisely 2,080 hours.',
    },
    {
      question: 'What is the difference between biweekly and semi-monthly pay?',
      answer:
        'Biweekly means every two weeks, which is 26 pay periods a year. Semi-monthly means twice a month, which is 24. The annual total is identical, but biweekly cheques are smaller and twice a year you receive three of them in one calendar month. That third cheque is not a bonus — it is the same annual salary distributed differently, and budgeting monthly on a biweekly cheque is a common way to end up short.',
    },
    {
      question: 'How is overtime pay calculated in the US?',
      answer:
        'Under the Fair Labor Standards Act, non-exempt employees must receive at least one and a half times their regular rate for hours worked beyond 40 in a workweek. The regular rate is total compensation for the week divided by total hours actually worked, which means non-discretionary bonuses and shift differentials raise it. The FLSA sets no daily overtime requirement — some states do.',
    },
    {
      question: 'Does salaried mean I cannot get overtime?',
      answer:
        'No. Exemption depends on the duties you perform and the salary you earn, not on whether you are paid a salary. A salaried employee who does not meet an exemption test is still entitled to overtime, and the Department of Labor computes it by dividing the weekly salary by the hours actually worked to find the regular rate. Job title alone determines nothing.',
    },
    {
      question: 'Does this calculator show take-home pay?',
      answer:
        'No, every figure here is gross. Income tax, national insurance or payroll taxes, pension contributions and benefit deductions all vary by country, state, filing status and employer, and a number that pretends to know your net pay without knowing any of that would be worse than no number. Use these figures for comparing offers, not for budgeting to the pound.',
    },
    {
      question: 'How should I account for unpaid leave?',
      answer:
        'Reduce the paid weeks per year. Someone working 40 hours a week for 48 paid weeks earns 1,920 hours a year rather than 2,080 — around 8 percent less than the standard conversion suggests. This matters most for contractors and hourly staff, where unpaid time comes straight off the annual figure while a salaried colleague on the same nominal rate loses nothing.',
    },
    {
      question: 'Is a higher hourly rate always a better offer?',
      answer:
        'Not on its own. A contract paying 20 percent more per hour with no paid holiday, no sick pay, no employer pension contribution and no notice period can be worth less annually than the salaried alternative. Convert both to an annual figure using the paid weeks you will actually be paid for, then add the value of the benefits, and compare those.',
    },
  ],
  sources: [
    {
      title: 'Fact Sheet #23: Overtime Pay Requirements of the FLSA',
      publisher: 'Wage and Hour Division, US Department of Labor',
      url: 'https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay',
    },
    {
      title: 'Fact Sheet #56A: Overview of the Regular Rate of Pay under the FLSA',
      publisher: 'Wage and Hour Division, US Department of Labor',
      url: 'https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate',
    },
    {
      title: 'Overtime Pay — general guidance',
      publisher: 'US Department of Labor',
      url: 'https://www.dol.gov/general/topic/wages/overtimepay',
    },
  ],
  relatedSlugs: ['finance/compound-interest-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
};

export default meta;
