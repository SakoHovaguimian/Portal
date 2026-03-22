import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

export function DataTable<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-secondary bg-primary">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="bg-secondary_subtle">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-tertiary">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary bg-primary">
            {rows.map((row, index) => (
              <tr key={index} className="transition hover:bg-primary_hover">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-secondary">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
