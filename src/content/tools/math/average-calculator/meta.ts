import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'average-calculator',
  category: 'math',
  name: 'Average Calculator',
  h1: 'Average Calculator',
  metaTitle: 'Average Calculator — Mean, Median, Mode & Range',
  metaDescription:
    'Paste any list of numbers to get the mean, median, mode, range and standard deviation, plus weighted, geometric and harmonic means and when to use each one.',
  shortDescription:
    'Paste a list of numbers and get every kind of average at once — with a note on which one your data actually calls for.',
  leadAnswer:
    'The mean is the total divided by the count, the median is the middle value once the data is sorted, and the mode is the value appearing most often. On symmetric data all three land close together; on skewed data they separate, and that separation is itself information.',
  keywords: [
    'average calculator',
    'mean median mode calculator',
    'weighted average calculator',
    'standard deviation calculator',
    'geometric mean calculator',
    'find the average',
  ],
  faqs: [
    {
      question: 'What is the difference between mean, median and mode?',
      answer:
        'The mean is the total divided by the count. The median is the middle value once the data is sorted. The mode is the value that appears most often. On symmetric data the three land close together; on skewed data they separate, and the size of that separation is itself information about the shape of the distribution.',
    },
    {
      question: 'When should I use the median instead of the mean?',
      answer:
        'Whenever the data is skewed or contains outliers. Income is the standard example: a handful of very high earners pull the mean well above what a typical person earns, while the median stays where most of the data is. As a rule, if moving one extreme value would noticeably change your answer, the median is the safer summary.',
    },
    {
      question: 'How do I calculate a weighted average?',
      answer:
        'Multiply each value by its weight, add those products, then divide by the sum of the weights. It is the right method whenever the values represent groups of different sizes or importance — course grades by credit hours, portfolio returns by amount invested, or survey results by population. Taking a plain mean of those instead treats a group of ten as equal to a group of ten thousand.',
    },
    {
      question: 'Why can’t I just average percentages?',
      answer:
        'Because each percentage describes a different-sized group. A 10 percent conversion rate on 1,000 visitors and 20 percent on 100 visitors is not a 15 percent weekend — it is 120 conversions from 1,100 visitors, which is 10.9 percent. Go back to the underlying counts, add those, and recompute. If you only have the percentages and not the group sizes, the combination is genuinely not available.',
    },
    {
      question: 'What is the geometric mean used for?',
      answer:
        'Rates of change that multiply rather than add — investment returns, growth rates, and index numbers. Gaining 50 percent then losing 50 percent leaves you at 75 percent of where you started, not back at even, and only the geometric mean of the growth factors reports that correctly. It requires all values to be positive.',
    },
    {
      question: 'What is the difference between sample and population standard deviation?',
      answer:
        'The population version divides by n; the sample version divides by n − 1. The subtraction, known as Bessel’s correction, compensates for the fact that a sample’s own mean sits closer to its own data than the true mean does, which would otherwise make the spread look smaller than it is. Use the sample version unless your numbers really are the entire population.',
    },
    {
      question: 'What does it mean if my data has no mode?',
      answer:
        'It means every value appears exactly once, which is common with continuous measurements. The mode is most useful on categorical or repeated data — shoe sizes, survey responses, dice rolls — and largely uninformative on measurements that rarely repeat. Data can also have several modes, and two clear peaks usually means two different populations mixed together.',
    },
    {
      question: 'Does the range tell me anything useful?',
      answer:
        'A little, and it is fragile. The range depends entirely on the two most extreme values, so one mistyped figure changes it completely while leaving the median untouched. It is useful as a quick sanity check on whether your data is in the units you expected, and it should not be used as a serious measure of spread — standard deviation or the interquartile range are far more stable.',
    },
  ],
  sources: [
    {
      title: 'e-Handbook of Statistical Methods — 1.3.5.1 Measures of Location',
      publisher: 'NIST/SEMATECH',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm',
    },
    {
      title: 'e-Handbook of Statistical Methods — 1.3.5 Quantitative Techniques',
      publisher: 'NIST/SEMATECH',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm',
    },
    {
      title: 'e-Handbook of Statistical Methods',
      publisher: 'NIST/SEMATECH',
      url: 'https://www.itl.nist.gov/div898/handbook/',
    },
  ],
  relatedSlugs: ['math/percentage-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
  featured: true,
};

export default meta;
