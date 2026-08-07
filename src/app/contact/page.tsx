import type { Metadata } from 'next';
import { ProsePage } from '@/components/layout/ProsePage';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: withBrand('Contact MegaTools'),
  description:
    'Report an error in a calculator, request a tool, or ask about advertising. Every message reaches a person, and formula corrections are prioritised.',
  path: '/contact',
});

const CONTACT_EMAIL = 'darshanbgondaliya@gmail.com';

const reasons = [
  {
    heading: 'You found an error',
    body: 'This is the message we most want to receive. Tell us which tool, the exact inputs you used, the result you got, and the result you expected. If you have a source that contradicts ours, include it. Formula corrections go to the front of the queue and the page gets a correction note.',
  },
  {
    heading: 'You want a tool that does not exist yet',
    body: 'Describe the calculation and, if you can, where the formula comes from. Requests that arrive with a source attached get built first, because the research is the slow part.',
  },
  {
    heading: 'A source has been superseded',
    body: 'Standards bodies revise guidance and tax authorities change rates. If a page cites something that is no longer current, point us at the replacement and we will update it.',
  },
  {
    heading: 'Advertising or partnerships',
    body: 'We run display advertising through Google and do not sell direct placements, sponsored posts, or links. If that is what you are writing about, the answer is no — but it will still be read.',
  },
  {
    heading: 'Privacy and data requests',
    body: 'Access, deletion, and correction requests are handled at the same address and answered within 30 days. See the privacy policy for what we actually hold, which is very little.',
  },
];

export default function ContactPage() {
  return (
    <ProsePage
      title="Contact"
      path="/contact"
      intro="One address, read by a person. No ticket system, no chatbot."
    >
      <p>
        Email us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold">
          {CONTACT_EMAIL}
        </a>
        . We reply to most messages within two working days.
      </p>

      <p>
        There is no contact form on this page on purpose. A form would need to send
        your message through a third-party service, and the whole point of this site is
        that nothing you type into it gets routed somewhere you cannot see. Email goes
        directly from you to us.
      </p>

      <h2>What to write about</h2>

      {reasons.map((reason) => (
        <div key={reason.heading}>
          <h3>{reason.heading}</h3>
          <p>{reason.body}</p>
        </div>
      ))}

      <h2>What we cannot help with</h2>

      <p>
        We cannot tell you whether a mortgage is a good idea, interpret a health result
        for you, or advise on your tax position. Those are questions for someone who
        knows your circumstances and is qualified to answer them — a broker, a
        clinician, an accountant. We build the arithmetic; the judgement has to come
        from somewhere else.
      </p>
    </ProsePage>
  );
}
