"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed bottom-[4.5rem] right-5 z-40 lg:bottom-6",
        "flex h-10 w-10 items-center justify-center",
        "rounded-full shadow-md",
        "border border-slate-200 bg-white/90 text-slate-700",
        "hover:bg-slate-50 hover:text-blue-900",
        "dark:border-stone-700 dark:bg-stone-800/90 dark:text-stone-300 dark:hover:bg-stone-700",
        "transition-all duration-200 print-hide",
      ].join(" ")}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
