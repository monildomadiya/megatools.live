import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';

/**
 * MDX element overrides applied to every tool and blog body.
 *
 * Two things matter here. Internal links go through next/link so navigation
 * between tools stays client-side, and tables get wrapped in a scroll container
 * — the comparison tables on these pages are wide enough to break the layout on
 * a phone otherwise.
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

    table: ({ children, ...props }) => (
      <div className="table-wrap">
        <table {...props}>{children}</table>
      </div>
    ),

    ...components,
  };
}
