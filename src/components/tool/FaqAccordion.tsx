import type { Faq } from '@/lib/tools/types';

/**
 * Built on native <details> rather than a JS accordion. The answers are then
 * present in the initial HTML for crawlers and for readers on a slow connection,
 * and there is no hydration cost at all.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2 id="faq-heading" className="text-2xl font-bold text-ink-900">
        Frequently asked questions
      </h2>

      <div className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <svg
                aria-hidden
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                className="mt-1 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
              >
                <path d="M4.5 7l4.5 4.5L13.5 7" />
              </svg>
            </summary>
            <p className="mt-3 pr-8 leading-relaxed text-ink-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
