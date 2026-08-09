import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'calorie-calculator',
  category: 'health',
  name: 'Calorie Calculator',
  h1: 'Daily Calorie Calculator',
  metaTitle: 'Calorie Calculator — Daily Intake for Your Goal',
  metaDescription:
    'Work out how many calories a day to eat to lose, gain or maintain weight at a chosen rate, with a check on whether that rate is one your body can sustain.',
  shortDescription:
    'Set a weight goal and a rate, and see the daily calorie target it implies — plus whether that target is a safe one.',
  leadAnswer:
    'Your daily calorie target is your total energy expenditure adjusted for the result you want: eat that figure to maintain weight, less to lose, more to gain. A deficit of 300 to 700 calories a day suits most people; much larger deficits mostly cost muscle rather than fat.',
  keywords: [
    'calorie calculator',
    'daily calorie intake',
    'calorie deficit calculator',
    'how many calories to lose weight',
    'weight loss calculator',
    'maintenance calories',
  ],
  faqs: [
    {
      question: 'How many calories should I eat to lose weight?',
      answer:
        'Take your maintenance calories and subtract enough to produce the rate of loss you want, keeping the rate at or under about 1 percent of your body weight per week. For most people that means a deficit of 300 to 700 calories a day. Deficits much larger than that mostly buy faster muscle loss rather than faster fat loss, and they are considerably harder to sustain.',
    },
    {
      question: 'Is the 3,500 calories per pound rule accurate?',
      answer:
        'Only at the start. The rule assumes your energy expenditure stays fixed while you shrink, and it does not — a lighter body costs less to move and to maintain, and sustained restriction lowers metabolic rate further. Kevin Hall’s work at the NIH showed the rule progressively overestimates loss, which is why a deficit that produced a pound a week in month one produces noticeably less by month six. This page uses it for the initial estimate and tells you where it stops holding.',
    },
    {
      question: 'What is a safe rate of weight loss?',
      answer:
        'The CDC puts steady, sustainable loss at 1 to 2 pounds — roughly 0.5 to 1 kg — per week, and notes that people who lose weight at that pace are more likely to keep it off. A useful scaling rule is to cap the rate at about 1 percent of body weight per week, which keeps a 60 kg person and a 120 kg person on proportionate targets rather than the same absolute one.',
    },
    {
      question: 'Why does the calculator warn me when intake drops below my BMR?',
      answer:
        'Your basal metabolic rate is what your body spends at complete rest keeping organs running. Eating below it for extended periods means the deficit is being met partly by breaking down lean tissue, and it makes adequate protein, vitamin and mineral intake difficult within the calorie budget left. Very low calorie diets exist and have their uses, but they belong under medical supervision rather than as a self-selected setting.',
    },
    {
      question: 'Should I eat back the calories I burn exercising?',
      answer:
        'The activity multiplier in this calculator already includes your typical exercise, so eating back what a watch or a treadmill reports on top of that double-counts it. Consumer devices also tend to overestimate exercise energy expenditure substantially. Pick the activity level that describes your normal week, and adjust the target based on how your weight actually moves over a month rather than on what a device reports.',
    },
    {
      question: 'How many calories do I need to gain weight?',
      answer:
        'A surplus of 250 to 500 calories a day above maintenance supports muscle gain without adding fat faster than necessary. Gaining faster than roughly 0.25 to 0.5 percent of body weight per week mostly adds fat, because the rate at which the body can build muscle is capped by training and recovery rather than by how much you eat.',
    },
    {
      question: 'Why did my weight loss stall even though nothing changed?',
      answer:
        'Because the maintenance figure moved. Every kilogram lost lowers the energy cost of existing and of moving, so the deficit you set at the start shrinks as you succeed. A plateau after two or three months is usually the deficit having closed rather than anything going wrong. Recalculate at your current weight and reset the target.',
    },
    {
      question: 'How accurate is the maintenance number?',
      answer:
        'The Mifflin-St Jeor equation predicts resting energy expenditure within 10 percent for about 80 percent of people, and the activity multiplier applied on top is a much rougher instrument than that. Treat the result as a starting point, hold it for two to three weeks, and adjust based on the actual trend on the scale — your own data beats any equation within a month.',
    },
  ],
  sources: [
    {
      title:
        'A new predictive equation for resting energy expenditure in healthy individuals (Am J Clin Nutr, 1990)',
      publisher: 'Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO — via PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    },
    {
      title: 'Quantification of the effect of energy imbalance on bodyweight (Lancet, 2011)',
      publisher: 'Hall KD et al. — via PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21872751/',
    },
    {
      title: 'Steps for Losing Weight',
      publisher: 'Centers for Disease Control and Prevention (CDC)',
      url: 'https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html',
    },
    {
      title: 'The NIH Body Weight Planner',
      publisher: 'National Institute of Diabetes and Digestive and Kidney Diseases (NIH)',
      url: 'https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/nih-body-weight-planner',
    },
  ],
  relatedSlugs: ['health/tdee-calculator', 'health/bmr-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
  featured: true,
};

export default meta;
