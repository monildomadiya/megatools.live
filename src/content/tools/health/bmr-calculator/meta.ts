import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'bmr-calculator',
  category: 'health',
  name: 'BMR Calculator',
  h1: 'BMR Calculator',
  metaTitle: 'BMR Calculator — Mifflin-St Jeor & Harris-Benedict',
  metaDescription:
    'Calculate basal metabolic rate with both Mifflin-St Jeor and revised Harris-Benedict equations, see how far apart they land, and which one the evidence backs.',
  shortDescription:
    'Estimate the energy your body uses at complete rest, using both standard equations side by side so you can see how much the choice of formula matters.',
  leadAnswer:
    'Basal metabolic rate is the energy your body uses at complete rest — breathing, circulation, brain activity, cell repair and holding your temperature steady. It accounts for roughly 60 to 70 percent of most people’s total daily energy use, which is why it dominates any calorie calculation.',
  keywords: [
    'bmr calculator',
    'basal metabolic rate',
    'mifflin st jeor equation',
    'harris benedict equation',
    'resting metabolic rate',
    'how many calories at rest',
  ],
  faqs: [
    {
      question: 'What is basal metabolic rate?',
      answer:
        'The energy your body uses at complete rest just to stay alive — breathing, circulation, brain activity, cell maintenance, keeping your temperature stable. For most people it accounts for roughly 60 to 70 percent of total daily energy use, which is why it dominates any calorie calculation even though it involves doing nothing at all.',
    },
    {
      question: 'What is the difference between BMR and RMR?',
      answer:
        'True BMR is measured under strict conditions: after a full night of sleep in the testing facility, fasted for 12 hours, at rest, in a thermally neutral room. RMR is measured under more relaxed conditions and comes out roughly 10 percent higher. Almost every equation labelled "BMR" online, including Mifflin-St Jeor, was actually derived against RMR measurements. The distinction rarely matters in practice, but it is why two sources can quote different numbers for the same person.',
    },
    {
      question: 'Which equation should I use?',
      answer:
        'Mifflin-St Jeor. A 2005 systematic review in the Journal of the American Dietetic Association compared the common equations and found it predicted resting metabolic rate within 10 percent of measured values more often than any other, with the narrowest error range — about 82 percent of the time overall, though only around 70 percent in obese participants. That is why this calculator shows it first.',
    },
    {
      question: 'Why do the two equations give different answers?',
      answer:
        'They were fitted to different populations decades apart. Harris and Benedict published theirs in 1918 from a sample of largely young, lean, physically active subjects; Roza and Shizgal revised the coefficients in 1984. Mifflin and colleagues built theirs in 1990 from 498 subjects across a much wider range of body sizes. For a 30-year-old man at 80 kg and 180 cm they differ by about 74 calories a day — roughly 4 percent.',
    },
    {
      question: 'How accurate is any of this for me personally?',
      answer:
        'The equations describe a population average, and individual metabolic rates vary by roughly 10 to 15 percent either side of prediction even among people with identical height, weight, age, and sex. Body composition is the main reason: muscle burns more at rest than fat does, and none of these formulas can see the difference. Treat the result as a starting point to test against reality, not a measurement.',
    },
    {
      question: 'Can I raise my BMR?',
      answer:
        'Only modestly, and mostly through building muscle. Lean tissue is more metabolically active than fat, so adding muscle raises resting expenditure — but the effect is often overstated. A kilogram of muscle burns roughly 13 calories a day at rest, so a substantial gain in muscle mass moves BMR by tens of calories, not hundreds. The larger returns are in activity, not in resting rate.',
    },
    {
      question: 'Does BMR fall when you diet?',
      answer:
        'Yes, and by more than the weight loss alone would predict. A smaller body needs less energy, but sustained restriction also produces adaptive thermogenesis — the body becomes more efficient. This is one reason weight loss slows on a fixed calorie target and why recalculating as your weight changes matters.',
    },
    {
      question: 'Should I eat below my BMR?',
      answer:
        'That is a question for a doctor or a registered dietitian, not a calculator. Very low intakes carry real risks around nutrient deficiency, muscle loss, and gallstones, and they are used clinically only under supervision. The number this page gives you is an estimate of a physiological baseline, not a target.',
    },
  ],
  sources: [
    {
      title:
        'A new predictive equation for resting energy expenditure in healthy individuals (Am J Clin Nutr, 1990)',
      publisher: 'Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO',
      url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    },
    {
      title:
        'The Harris Benedict equation reevaluated: resting energy requirements and the body cell mass (Am J Clin Nutr, 1984)',
      publisher: 'Roza AM, Shizgal HM',
      url: 'https://pubmed.ncbi.nlm.nih.gov/6741850/',
    },
    {
      title:
        'Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults: a systematic review (J Am Diet Assoc, 2005)',
      publisher: 'Frankenfield D, Roth-Yousey L, Compher C',
      url: 'https://pubmed.ncbi.nlm.nih.gov/15883556/',
    },
    {
      title: 'A Biometric Study of Human Basal Metabolism (PNAS, 1918)',
      publisher: 'Harris JA, Benedict FG',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1091498/',
    },
  ],
  relatedSlugs: ['health/tdee-calculator', 'health/bmi-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
