import { cn } from "@/lib/cn";

export function PullQuote({
  quote,
  attribution,
  className,
}: {
  quote: string;
  attribution: string;
  className?: string;
}) {
  return (
    <blockquote
      className={cn(
        "not-prose my-7 border-l-4 border-amber-600 py-2 pl-5 pr-3",
        "dark:border-amber-500",
        className,
      )}
    >
      <p
        className="text-lg font-medium italic leading-relaxed text-blue-900 dark:text-blue-300 sm:text-xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        &#8220;{quote}&#8221;
      </p>
      <footer
        className="mt-2 text-sm font-semibold not-italic text-slate-500 dark:text-stone-500"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {attribution}
      </footer>
    </blockquote>
  );
}
