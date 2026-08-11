import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'paint-calculator',
  category: 'lifestyle',
  name: 'Paint Calculator',
  h1: 'Paint Calculator',
  metaTitle: 'Paint Calculator — How Much Paint for a Room',
  metaDescription:
    'Work out how much paint a room needs from its dimensions, doors and windows, at your own coverage rate and number of coats. Metric and US units both supported.',
  shortDescription:
    'Calculate how much paint a room needs from its dimensions, with doors and windows deducted and the coverage rate under your control.',
  leadAnswer:
    'Paint quantity comes from area divided by spreading rate, multiplied by the number of coats. The area is the walls minus the doors and windows; the spreading rate is printed on the tin and varies from about 6 to 16 square metres per litre depending on the paint and how absorbent the surface is.',
  keywords: [
    'paint calculator',
    'how much paint do i need',
    'paint coverage calculator',
    'wall paint quantity',
    'room paint estimator',
    'litres of paint per room',
  ],
  faqs: [
    {
      question: 'How much paint do I need for an average room?',
      answer:
        'For a room roughly 4 by 4 metres with a 2.4 metre ceiling, the walls come to about 38 square metres once a door and a window are deducted. At a typical emulsion spreading rate of 12 square metres per litre, two coats need about 6.5 litres — so a 5 litre tin plus a 2.5 litre tin, or one 10 litre tin if you would rather have the surplus for touch-ups. Your own numbers will differ, which is why the tool asks for them.',
    },
    {
      question: 'Where do I find the coverage rate for my paint?',
      answer:
        'On the tin, and on the manufacturer technical datasheet, usually given as square metres per litre or square feet per gallon. Treat the printed figure as a best case measured on a smooth, sealed, previously painted surface. Bare plaster, new plasterboard, textured wallpaper and masonry all absorb considerably more, and rolling absorbs more than spraying.',
    },
    {
      question: 'Do I really need two coats?',
      answer:
        'Usually yes. One coat is only sufficient when you are repainting the same colour on a sound, previously painted surface. Two coats are the norm for a colour change, and going from a dark colour to a light one, or covering a strong red or yellow, frequently needs three or a tinted primer underneath. Cheaper trade emulsions have lower opacity and need more coats than premium ones, which is where their price advantage tends to disappear.',
    },
    {
      question: 'Should I subtract doors and windows?',
      answer:
        'Yes, but they are smaller than people assume. A standard internal door is about 1.6 square metres and a typical window around 1.5. Deducting two openings from a normal room removes roughly 3 square metres out of 40, which is under a tenth. It is worth doing, and it will not usually change which tin sizes you buy.',
    },
    {
      question: 'Does the ceiling count in this calculation?',
      answer:
        'Only if you switch it on. Ceilings are frequently painted in a different product — a dedicated flat ceiling paint rather than a wall emulsion — so mixing the two areas into one figure would give you a quantity you cannot actually buy as one tin. The tool keeps the ceiling as a separate option and reports its area separately when included.',
    },
    {
      question: 'Why buy more paint than the calculation says?',
      answer:
        'Two reasons. The first is that spreading rates are optimistic and surfaces are rarely uniform, so real usage tends to run above the datasheet figure. The second is batch variation: tinted paint is mixed in batches and two tins of nominally the same colour from different batches can differ enough to see on a large wall. Buying what you need in one purchase, from one batch, avoids a visible join and leaves you a matched tin for repairs later.',
    },
    {
      question: 'Does the calculation work in US gallons?',
      answer:
        'Yes. Switch the unit toggle and enter dimensions in feet, coverage in square feet per gallon. A US gallon is 3.785 litres, and typical US coverage figures of 350 to 400 square feet per gallon correspond to roughly 8.6 to 9.8 square metres per litre. Note that a US gallon and an imperial gallon are different volumes, so a coverage figure taken from a UK tin cannot be used with US gallons unconverted.',
    },
  ],
  sources: [
    {
      title: 'BS EN 13300 — Paints and varnishes: classification of water-borne coating materials for interior walls and ceilings',
      publisher: 'British Standards Institution (BSI)',
      url: 'https://knowledge.bsigroup.com/products/paints-and-varnishes-water-borne-coating-materials-and-coating-systems-for-interior-walls-and-ceilings-classification',
    },
    {
      title: 'Dulux Trade product datasheets — declared spreading rates by product and substrate',
      publisher: 'AkzoNobel (Dulux Trade)',
      url: 'https://www.duluxtrade.co.uk/en/products',
    },
    {
      title: 'Paint coverage and estimating guidance',
      publisher: 'Sherwin-Williams',
      url: 'https://www.sherwin-williams.com/en-us/paint-calculator',
    },
  ],
  relatedSlugs: ['conversion/area-converter', 'conversion/volume-converter'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
