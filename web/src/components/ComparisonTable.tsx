import { cn } from "@/lib/cn";
import type { TableData } from "@/data/report";

export function ComparisonTable({ table, className }: { table: TableData; className?: string }) {
  return (
    <figure className={cn("not-prose my-6", className)}>
      <figcaption
        className="mb-2 text-sm font-semibold text-slate-700 dark:text-stone-300"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {table.title}
      </figcaption>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-800/60">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-blue-900 text-stone-50 dark:bg-blue-950">
            <tr>
              {table.headers.map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, idx) => (
              <tr
                key={`${table.id}-${idx}`}
                className={cn(
                  idx % 2 === 0
                    ? "bg-white dark:bg-stone-800/40"
                    : "bg-slate-50 dark:bg-stone-800/70",
                )}
              >
                {row.map((cell, j) => (
                  <td
                    key={`${table.id}-${idx}-${j}`}
                    className={cn(
                      "align-top px-4 py-3 text-slate-800 dark:text-stone-200",
                      j === 0 && "font-semibold text-slate-900 dark:text-stone-100",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
