import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'tdee-calculator',
  category: 'health',
  name: 'TDEE Calculator',
  h1: 'TDEE Calculator',
  metaTitle: 'TDEE Calculator — Daily Calorie Needs',
  metaDescription:
    'Estimate total daily energy expenditure from your BMR and activity level, compared against the official FAO/WHO/UNU physical activity ranges most calculators ignore.',
  shortDescription:
    'Estimate the calories you burn in a full day, using both the common gym multipliers and the official FAO/WHO/UNU activity ranges so you can see how far apart they are.',
  leadAnswer:
    'Total daily energy expenditure is everything your body burns in 24 hours: basal metabolic rate, plus the energy spent digesting food, plus deliberate exercise, plus the incidental movement of an ordinary day. BMR is usually 60 to 70 percent of it, and activity accounts for most of the rest.',
  keywords: [
    'tdee calculator',
    'total daily energy expenditure',
    'daily calorie needs',
    'maintenance calories',
    'physical activity level',
    'calorie deficit calculator',
  ],
  faqs: [
    {
      question: 'What is TDEE?',
      answer:
        'Total daily energy expenditure — everything your body burns in 24 hours. It is your basal metabolic rate plus the energy used digesting food, plus deliberate exercise, plus all the incidental movement of an ordinary day. BMR is usually 60 to 70 percent of it.',
    },
    {
      question: 'How is TDEE calculated?',
      answer:
        'BMR multiplied by a physical activity level factor. This calculator computes BMR with the Mifflin-St Jeor equation, then applies the multiplier you select. The BMR arithmetic is well validated; the multiplier is where nearly all the uncertainty lives.',
    },
    {
      question: 'Why do the two sets of activity multipliers disagree?',
      answer:
        'The familiar set — 1.2 sedentary through 1.9 extra active — comes from the Harris-Benedict tradition and circulates widely in fitness contexts without a clear primary source. The 2001 FAO/WHO/UNU expert consultation, which measured physical activity level directly, places a sedentary or light-activity lifestyle at 1.40 to 1.69. Its floor sits above the popular set’s sedentary value entirely, which means the common 1.2 multiplier probably understates most people.',
    },
    {
      question: 'Which activity level should I pick?',
      answer:
        'Most people overestimate. An office job with three gym sessions a week is usually light to moderate, not "very active" — a one-hour workout is a small share of a 24-hour day. If your weight is stable, your current intake is your actual TDEE, and that measured figure beats any multiplier. Start one bracket lower than feels right and adjust from what the scale does over three weeks.',
    },
    {
      question: 'How accurate is a TDEE estimate?',
      answer:
        'Less accurate than a BMR estimate, because the errors compound. BMR prediction is within 10 percent for roughly 82 percent of people, and the activity multiplier adds its own uncertainty on top — moving one bracket changes the result by roughly 250 to 350 calories a day for most adults. Treat the number as a starting hypothesis, not a measurement.',
    },
    {
      question: 'Is a 500 calorie deficit really a pound a week?',
      answer:
        'Only at first. The rule comes from assuming a pound of fat stores 3,500 calories and that nothing else changes. In practice a smaller body burns less, and sustained restriction lowers metabolic rate further, so the same deficit produces progressively less loss. Modelling by Hall and colleagues in The Lancet showed body weight responds to a sustained intake change over roughly a year, not a fixed weekly amount. Expect the first weeks to match the rule and later weeks to fall short of it.',
    },
    {
      question: 'Do I need to recalculate as I lose weight?',
      answer:
        'Yes. TDEE scales with body mass, so the figure that produced a deficit at your starting weight becomes closer to maintenance as you get lighter. Recalculating every four to five kilograms of change, or whenever loss stalls for more than two or three weeks, keeps the target honest.',
    },
    {
      question: 'Does TDEE include exercise, or do I add it separately?',
      answer:
        'It includes it, provided you selected an activity level that reflects your training. Adding a workout’s calorie burn on top of a multiplier that already assumed the workout counts it twice — a common way to eat back a deficit without realising. Pick the multiplier or track exercise separately against a sedentary baseline, never both.',
    },
  ],
  sources: [
    {
      title:
        'Human energy requirements — Report of a Joint FAO/WHO/UNU Expert Consultation (2001), Chapter 5: physical activity levels',
      publisher: 'Food and Agriculture Organization of the United Nations',
      url: 'https://www.fao.org/4/y5686e/y5686e07.htm',
    },
    {
      title:
        'Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids',
      publisher: 'National Academies of Sciences, Engineering, and Medicine',
      url: 'https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids',
    },
    {
      title:
        'A new predictive equation for resting energy expenditure in healthy individuals (Am J Clin Nutr, 1990)',
      publisher: 'Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO',
      url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    },
    {
      title: 'Quantification of the effect of energy imbalance on bodyweight (Lancet, 2011)',
      publisher: 'Hall KD, Sacks G, Chandramohan D, Chow CC, Wang YC, Gortmaker SL, Swinburn BA',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21872751/',
    },
  ],
  relatedSlugs: ['health/bmr-calculator', 'health/bmi-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
