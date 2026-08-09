import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'standard-deviation-calculator',
  category: 'math',
  name: 'Standard Deviation Calculator',
  h1: 'Standard Deviation Calculator',
  metaTitle: 'Standard Deviation Calculator — Sample & Population',
  metaDescription:
    'Calculate sample and population standard deviation, variance, standard error and quartiles, with every step of the working shown for the numbers you enter.',
  shortDescription:
    'Work out sample or population standard deviation with the full working shown, plus variance, standard error, quartiles and the coefficient of variation.',
  keywords: [
    'standard deviation calculator',
    'sample standard deviation',
    'population standard deviation',
    'variance calculator',
    'standard error calculator',
    'coefficient of variation',
  ],
  faqs: [
    {
      question: 'What is the difference between sample and population standard deviation?',
      answer:
        'The population formula divides the sum of squared deviations by n; the sample formula divides by n − 1. You use the population form only when your numbers are the entire group you care about — every employee in a company of 40, every match in a season. You use the sample form when the numbers are a subset drawn from a larger group you want to describe. In practice the sample form is correct far more often, which is why most software defaults to it.',
    },
    {
      question: 'Why divide by n − 1 instead of n?',
      answer:
        'Because the sample mean is itself estimated from the same data, and it sits, by construction, closer to your sample points than the true population mean does. That makes the squared deviations systematically too small. Dividing by n − 1 rather than n — Bessel’s correction — inflates the result by exactly enough to make the variance an unbiased estimator of the population variance. The correction matters most at small n: at n = 5 it raises the variance by 25%, at n = 100 by about 1%.',
    },
    {
      question: 'How do I calculate standard deviation by hand?',
      answer:
        'Five steps. Find the mean. Subtract the mean from each value to get the deviations. Square each deviation. Add the squares and divide by n for a population or n − 1 for a sample — that is the variance. Take the square root, and that is the standard deviation. This calculator shows all five steps for the numbers you enter so you can check your own working against it.',
    },
    {
      question: 'What counts as a high standard deviation?',
      answer:
        'Nothing, in isolation. Standard deviation carries the units of the data, so a value of 12 means one thing for exam scores out of 100 and another for house prices. To judge spread you need a reference: compare it to the mean using the coefficient of variation, which expresses standard deviation as a percentage of the mean and is unitless, or compare it to the standard deviation of a similar dataset measured the same way.',
    },
    {
      question: 'What is the empirical rule?',
      answer:
        'For data that follows a normal distribution, roughly 68% of values fall within one standard deviation of the mean, 95% within two, and 99.7% within three. It is a useful sanity check, but only for symmetric bell-shaped data. Applied to skewed data — incomes, response times, waiting times — it misleads badly, because those distributions have a long tail on one side and nothing on the other.',
    },
    {
      question: 'What is standard error and how is it different?',
      answer:
        'Standard deviation describes the spread of your data. Standard error of the mean describes the precision of your estimate of the mean, and it is the standard deviation divided by the square root of n. They answer different questions: standard deviation does not shrink as you collect more data, because the underlying spread is what it is, whereas standard error does, because a larger sample pins the mean down more tightly.',
    },
    {
      question: 'Should I remove outliers before calculating?',
      answer:
        'Only if you can justify it as a data error rather than an inconvenient value. Standard deviation is highly sensitive to outliers because deviations are squared, so a single extreme point can dominate the result — which is often exactly the signal you need to see. If a genuine extreme value is distorting a summary, the honest response is to report a robust measure such as the interquartile range alongside it, not to delete the point.',
    },
  ],
  sources: [
    {
      title: 'NIST/SEMATECH e-Handbook of Statistical Methods — Measures of Scale',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm',
    },
    {
      title: 'Evaluation of measurement data — Guide to the expression of uncertainty in measurement (JCGM 100:2008)',
      publisher: 'Joint Committee for Guides in Metrology / BIPM',
      url: 'https://www.bipm.org/en/committees/jc/jcgm/publications',
    },
    {
      title: 'NIST/SEMATECH e-Handbook of Statistical Methods — Summary Statistics',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm',
    },
  ],
  relatedSlugs: ['math/average-calculator'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
