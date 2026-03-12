import { cn } from "@/lib/cn";

// Roman numerals up to 20 sections
const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX"];

export function ReportSection({
  as,
  id,
  title,
  sectionNumber,
  children,
  className,
}: {
  as: "h2" | "h3";
  id: string;
  title: string;
  /** If provided, shows a Roman numeral badge before the heading. */
  sectionNumber?: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const Heading = as;
  const numeral = sectionNumber != null ? ROMAN[sectionNumber - 1] : null;

  return (
    <section className={cn("scroll-mt-20", className)}>
      <Heading
        id={id}
        className={cn(
          "flex items-baseline gap-2 font-semibold tracking-tight",
          as === "h2"
            ? "mt-8 border-b border-slate-200 pb-2 text-lg leading-snug text-blue-900 sm:mt-10 sm:text-2xl dark:border-stone-700 dark:text-blue-300"
            : "mt-6 text-base leading-snug text-slate-900 sm:mt-8 sm:text-xl dark:text-stone-100",
        )}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {numeral && (
          <span
            className={cn(
              "shrink-0 font-bold tabular-nums",
              as === "h2"
                ? "text-sm text-amber-600 dark:text-amber-500 sm:text-base"
                : "text-xs text-slate-400 dark:text-stone-500",
            )}
          >
            {numeral}.
          </span>
        )}
        <span>{title}</span>
      </Heading>
      {children}
    </section>
  );
}
