import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import { headingText, slugify } from '@/lib/tools/headings';

/**
 * MDX element overrides applied to every tool and blog body.
 *
 * Three things matter here. Internal links go through next/link so navigation
 * between tools stays client-side; tables get wrapped in a scroll container —
 * the comparison tables on these pages are wide enough to break the layout on a
 * phone otherwise; and every section heading carries an id.
 *
 * The ids are load-bearing rather than cosmetic. These articles run past three
 * thousand words, so the contents rail beside them needs somewhere to point,
 * and a reader who found the one paragraph that answered their question needs
 * to be able to send the address of that paragraph rather than of the page.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = '', children, ...props }) => {
      const isInternal = href.startsWith('/') || href.startsWith('#');
      if (isInternal) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener" {...props}>
          {children}
        </a>
      );
    },

    // `id` is written after the spread so the derived anchor always wins. The
    // contents rail is built from the same slug function against the same
    // heading text, and the two agreeing is the whole contract.
    h2: ({ children, ...props }) => {
      const id = slugify(headingText(children));
      return (
        <h2 {...props} id={id}>
          {children}
          <HeadingAnchor id={id} />
        </h2>
      );
    },

    h3: ({ children, ...props }) => {
      const id = slugify(headingText(children));
      return (
        <h3 {...props} id={id}>
          {children}
          <HeadingAnchor id={id} />
        </h3>
      );
    },

    table: ({ children, ...props }) => (
      <div className="table-wrap">
        <table {...props}>{children}</table>
      </div>
    ),

    ...components,
  };
}

/**
 * The self-link that appears on hover.
 *
 * It sits inside the heading rather than wrapping it: `.prose-content a` is
 * brand-coloured and underlined, and wrapping would turn every section heading
 * on the site blue. It stays hidden until the heading is hovered or the link
 * itself takes focus — a column of permanently visible octothorpes is noise,
 * but a keyboard user still has to be able to reach it.
 */
function HeadingAnchor({ id }: { id: string }) {
  return (
    <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
      <span aria-hidden>#</span>
    </a>
  );
}
