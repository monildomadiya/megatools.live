import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'electricity-cost-calculator',
  category: 'lifestyle',
  name: 'Electricity Cost Calculator',
  h1: 'Electricity Cost Calculator',
  metaTitle: 'Electricity Cost Calculator — Cost to Run an Appliance',
  metaDescription:
    'Work out what an appliance costs to run per day, month and year from its wattage, hours of use and your unit rate, with duty cycle and standby power accounted for.',
  shortDescription:
    'Work out the running cost of any appliance from its wattage and your unit rate, with duty cycle and standby draw included rather than ignored.',
  leadAnswer:
    'Electricity is billed by the kilowatt-hour: one kilowatt of power drawn for one hour. Running cost is therefore power in kilowatts multiplied by hours of use multiplied by the unit rate on your tariff. The trap is that most appliances do not draw their rated wattage continuously, so the rating alone overstates the bill.',
  keywords: [
    'electricity cost calculator',
    'appliance running cost',
    'kwh cost calculator',
    'cost to run a heater',
    'watts to cost',
    'electricity usage calculator',
    'energy cost per hour',
  ],
  faqs: [
    {
      question: 'How do I turn watts into a cost?',
      answer:
        'Divide the wattage by 1,000 to get kilowatts, multiply by the hours it runs to get kilowatt-hours, then multiply by your unit rate. A 2,000 W heater running 5 hours uses 10 kWh; at 25p per kWh that is £2.50. The only figure people usually get wrong is the unit rate, because bills quote it in pence or cents while advertising quotes annual totals. Take the rate from a recent bill rather than from memory.',
    },
    {
      question: 'Why is my actual bill lower than this estimate?',
      answer:
        'Usually because the appliance does not draw its rated power continuously. A fridge is rated for the compressor running, but the compressor cycles — it may be on a third of the time. A thermostatic heater does the same once the room is warm. An oven draws full power heating up and far less holding temperature. The duty cycle field on this page exists for exactly that: set it to the fraction of the time the appliance is genuinely drawing power, and the estimate stops assuming the worst case.',
    },
    {
      question: 'What is standby power and does it matter?',
      answer:
        'Standby is the power an appliance draws while apparently off — the clock on a microwave, the network chip in a television waiting for a remote, a charger left plugged in with nothing attached. Individually these are one to a few watts and trivial. Collectively they run 24 hours a day across a dozen devices, and the annual total is large enough that most energy agencies publish guidance on it. This calculator lets you add a standby figure so the always-on portion is visible next to the in-use portion.',
    },
    {
      question: 'Does this include the standing charge?',
      answer:
        'No, deliberately. A standing charge is a fixed daily fee for being connected, charged whether you use anything or not, so it is not part of the cost of running a particular appliance. Adding it here would make every appliance look more expensive than it is and would double-count it across several calculations. To reconcile against a full bill, work out your appliance costs here and add the standing charge once.',
    },
    {
      question: 'Does the calculation change on a time-of-use tariff?',
      answer:
        'Yes, and substantially. Economy 7, time-of-use and dynamic tariffs price electricity differently by hour, so a dishwasher run at 2am and the same cycle at 6pm cost different amounts on the same tariff. Run the calculation once per rate with the hours that fall in each band, rather than using an average rate — an average hides exactly the decision a time-of-use tariff is asking you to make.',
    },
    {
      question: 'Where do I find an appliance’s wattage?',
      answer:
        'On the rating plate, which is usually a sticker or moulded panel on the back or underside, and in the manual. It may be given in watts or as volts and amps, in which case multiply the two. Treat the rating plate as a maximum rather than as typical consumption. For anything that cycles, a plug-in energy monitor measuring actual kilowatt-hours over a week will beat any calculation from a rating, including this one.',
    },
    {
      question: 'Is a higher-wattage appliance always more expensive to run?',
      answer:
        'Not necessarily, because power and energy are different things. A 3,000 W kettle draws twice the power of a 1,500 W one but boils the same water in roughly half the time, so the energy used — and the cost — is close to identical. What matters is kilowatt-hours consumed, not the wattage on the plate. Where higher power genuinely does cost more is when it runs for the same duration regardless, as with heating.',
    },
  ],
  sources: [
    {
      title: 'Estimating Appliance and Home Electronic Energy Use',
      publisher: 'US Department of Energy — Energy Saver',
      url: 'https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use',
    },
    {
      title: 'Electricity data — average retail price of electricity',
      publisher: 'US Energy Information Administration (EIA)',
      url: 'https://www.eia.gov/electricity/',
    },
    {
      title: 'Energy price cap — unit rates and standing charges',
      publisher: 'Ofgem (Great Britain energy regulator)',
      url: 'https://www.ofgem.gov.uk/energy-price-cap',
    },
  ],
  relatedSlugs: ['lifestyle/fuel-cost-calculator', 'finance/vat-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
