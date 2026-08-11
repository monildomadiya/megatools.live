import { isValidElement, type ReactNode } from 'react';

/**
 * Section anchors for article bodies.
 *
 * Two callers have to agree exactly: the MDX `h2`/`h3` overrides, which see the
 * rendered React children, and the table-of-contents builder, which sees the
 * raw markdown line. Both derive the id from the heading's plain text through
 * `slugify`, so as long as they extract the same text they land on the same
 * anchor. Kept free of `node:fs` on purpose — this module is reachable from the
 * client graph through the MDX components, and the file reading lives in
 * `toc.ts`, which is not.
 */

/**
 * A heading's text as a URL fragment.
 *
 * `NFKD` first so the superscripts and subscripts in unit headings ("cmH2O",
 * "kgf/cm2") decompose to plain digits instead of being stripped to nothing —
 * without it, two headings that differ only in a subscript would collapse onto
 * the same slug.
 */
export function slugify(text: string): string {
  return (
    text
      .normalize('NFKD')
      // Combining marks left behind by the decomposition. Written as the
      // Unicode mark property rather than as a literal U+0300-U+036F range, so
      // the source stays ASCII and the rule is readable in an editor.
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * The plain text of a rendered heading, including any inline `<code>` or
 * `<strong>` inside it. MDX gives a heading its children as a string, an array,
 * or a tree of elements depending on what the author wrote, so this walks all
 * three.
 */
export function headingText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(headingText).join('');
  if (isValidElement(node)) {
    return headingText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

/**
 * The same text, recovered from a raw markdown heading line instead.
 *
 * Only the inline constructs that survive into rendered text are unwrapped —
 * emphasis, code spans and links all render as their inner text, so removing
 * the syntax here is what makes this agree with `headingText` above.
 */
export function markdownHeadingText(source: string): string {
  return source
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .trim();
}
