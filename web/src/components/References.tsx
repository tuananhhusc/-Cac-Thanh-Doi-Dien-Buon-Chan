import type { ReferenceItem } from "@/data/report";

export function References({ items }: { items: ReferenceItem[] }) {
  return (
    <section className="mt-16 border-t border-slate-200 pt-10 dark:border-stone-700">
      <h2
        id="nguon-trich-dan"
        className="scroll-mt-24 text-2xl font-semibold text-blue-900 dark:text-blue-300"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Nguồn trích dẫn
      </h2>
      <ol className="mt-6 space-y-3 text-sm leading-relaxed text-slate-800 dark:text-stone-300">
        {items.map((ref) => (
          <li key={ref.id} id={`ref-${ref.id}`} className="scroll-mt-24">
            <div className="flex gap-3">
              <div className="w-10 shrink-0 text-right font-semibold text-amber-700 dark:text-amber-500">
                [{ref.id}]
              </div>
              <div className="min-w-0">
                <div className="break-words">{ref.text}</div>
                {ref.url ? (
                  <div className="mt-1">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className={[
                        "text-blue-900 underline decoration-blue-900/30 underline-offset-2",
                        "hover:decoration-blue-900/70",
                        "dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:decoration-blue-400/70",
                      ].join(" ")}
                    >
                      {ref.url}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
