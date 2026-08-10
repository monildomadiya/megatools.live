import type { Faq } from '@/lib/tools/types';

/**
 * Built on native <details> rather than a JS accordion. The answers are then
 * present in the initial HTML for crawlers and for readers on a slow connection,
 * and there is no hydration cost at all.
 *
 * Each question is an <h3> inside its <summary>. The questions are written the
 * way readers phrase them, so leaving them as anonymous spans kept ~280
 * query-shaped strings out of the document outline for no reason. A heading
 * inside a summary is valid, and screen readers get a real outline out of it.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-16">
      <p className="eyebrow">Common questions</p>
      <h2 id="faq-heading" className="mt-3 text-display-sm">
        Frequently asked questions
      </h2>

      <div className="mt-7 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="card group overflow-hidden px-5 py-4 transition-colors open:border-brand-200 sm:px-6"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-display font-bold tracking-tight text-ink-900 [&::-webkit-details-marker]:hidden">
              <h3 className="font-display font-bold tracking-tight">{faq.question}</h3>
              <span
                aria-hidden
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-panel-2 text-ink-500 transition-transform duration-200 group-open:rotate-180 group-open:bg-brand-50 group-open:text-brand-600"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4.5 7l4.5 4.5L13.5 7" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 pr-10 leading-relaxed text-ink-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
