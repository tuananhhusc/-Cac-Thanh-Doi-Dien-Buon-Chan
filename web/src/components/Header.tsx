import { Cross } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FontSizeControl } from "@/components/FontSizeControl";
import { ShareButton, PrintButton } from "@/components/ShareButton";

export function Header({ title }: { title?: string }) {
  return (
    <header
      className={[
        "border-b border-amber-600/20 bg-stone-50/90 backdrop-blur",
        "supports-[backdrop-filter]:bg-stone-50/75",
        "dark:border-amber-800/20 dark:bg-[#1c1917]/90 dark:supports-[backdrop-filter]:bg-[#1c1917]/80",
        "print-hide",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6 sm:py-3">
        {/* Logo / brand */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-600/40 bg-white shadow-sm dark:border-amber-700/40 dark:bg-stone-800">
          <Cross className="h-3.5 w-3.5 text-blue-900 dark:text-blue-300" aria-hidden="true" />
        </div>

        {/* Title */}
        <p
          className="min-w-0 flex-1 truncate text-sm font-semibold leading-tight text-slate-900 dark:text-stone-100"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="hidden text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 sm:mr-1.5 sm:inline">
            Nghiên cứu
          </span>
          {title ?? "Các Thánh Đối Diện Buồn Chán"}
        </p>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <FontSizeControl className="print-hide" />
          <div className="h-4 w-px bg-slate-200 dark:bg-stone-700 print-hide" />
          <ShareButton title={title ?? "Các Thánh Đối Diện Buồn Chán"} className="print-hide" />
          <PrintButton className="print-hide" />
          <div className="h-4 w-px bg-slate-200 dark:bg-stone-700 print-hide" />
          <ThemeToggle className="print-hide" />
        </div>
      </div>
    </header>
  );
}
