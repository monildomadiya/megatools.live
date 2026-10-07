import type { ReactNode } from 'react';
import clsx from 'clsx';
export type TableColumn<Row> = { key: string; label: string; numeric?: boolean; render: (row: Row) => ReactNode };
/** Server-rendered table with a caption, sticky row headings and numeric alignment. */
export function DataTable<Row>({ caption, columns, rows, rowKey }: { caption: string; columns: TableColumn<Row>[]; rows: Row[]; rowKey: (row: Row) => string }) {
  return <div role="region" aria-label={caption} tabIndex={0} className="data-table overflow-x-auto rounded-2xl border border-border bg-white shadow-xs"><table className="w-full border-collapse text-sm"><caption className="bg-slate-50 px-5 py-4 text-left font-semibold text-primary">{caption}</caption><thead><tr>{columns.map((column, index) => <th key={column.key} scope="col" className={clsx('border-b border-border bg-slate-50 px-5 py-3', column.numeric ? 'text-right' : 'text-left', index === 0 && 'sticky left-0 z-10')}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={rowKey(row)}>{columns.map((column, index) => index === 0 ? <th key={column.key} scope="row" className="sticky left-0 border-b border-border bg-white px-5 py-4 text-left font-medium">{column.render(row)}</th> : <td key={column.key} className={clsx('border-b border-border bg-white px-5 py-4', column.numeric && 'text-right tabular-nums')}>{column.render(row)}</td>)}</tr>)}</tbody></table></div>;
}

