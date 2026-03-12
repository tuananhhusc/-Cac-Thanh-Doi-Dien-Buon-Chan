"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const SCALES = [
  { label: "A−", value: 0.9, title: "Chữ nhỏ hơn" },
  { label: "A",  value: 1.0, title: "Cỡ chữ mặc định" },
  { label: "A+", value: 1.15, title: "Chữ lớn hơn" },
];

const STORAGE_KEY = "font-scale";

export function FontSizeControl({ className }: { className?: string }) {
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    try {
      const saved = parseFloat(localStorage.getItem(STORAGE_KEY) ?? "1");
      if (!isNaN(saved)) {
        setScale(saved);
        document.documentElement.style.setProperty("--font-scale", String(saved));
      }
    } catch (_) {}
  }, []);

  function apply(value: number) {
    setScale(value);
    document.documentElement.style.setProperty("--font-scale", String(value));
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (_) {}
  }

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="group"
      aria-label="Cỡ chữ"
    >
      {SCALES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => apply(s.value)}
          title={s.title}
          aria-pressed={Math.abs(scale - s.value) < 0.01}
          className={cn(
            "flex h-7 min-w-[1.75rem] items-center justify-center rounded px-1.5 text-xs font-semibold transition-colors",
            Math.abs(scale - s.value) < 0.01
              ? "bg-blue-900 text-white dark:bg-blue-700"
              : "text-slate-600 hover:bg-slate-100 dark:text-stone-400 dark:hover:bg-stone-700",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
