/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";

import React, { useRef, useState } from "react";
import { useReferences } from "@/context/ReferencesContext";
import { cn } from "@/lib/cn";

// ─── Citation tooltip ────────────────────────────────────────────────────────

function CitationLink({ num }: { num: string }) {
  const references = useReferences();
  const ref = references.find((r) => r.id === parseInt(num, 10));

  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  function handleClick(e: React.MouseEvent) {
    const id = `ref-${num}`;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <sup
      className="relative ml-0.5 inline-block align-super text-[0.72em]"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <a
        href={`#ref-${num}`}
        onClick={handleClick}
        className={cn(
          "rounded-sm font-semibold text-blue-900 underline decoration-blue-900/30",
          "underline-offset-2 transition hover:decoration-blue-900/70",
          "focus:outline-none focus:ring-2 focus:ring-amber-600/40",
          "dark:text-blue-400 dark:decoration-blue-400/30",
        )}
      >
        [{num}]
      </a>

      {/* Tooltip */}
      {open && ref && (
        <span
          onMouseEnter={show}
          onMouseLeave={hide}
          className={cn(
            "absolute bottom-full left-1/2 z-50 mb-2 w-72 max-w-[90vw] -translate-x-1/2",
            "rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg",
            "dark:border-stone-700 dark:bg-stone-800",
            "pointer-events-auto",
          )}
          role="tooltip"
        >
          <span
            className="text-[11px] font-bold text-amber-700 dark:text-amber-500"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            [{num}]
          </span>
          <span
            className="mt-0.5 block text-[12px] leading-snug text-slate-700 dark:text-stone-300"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {ref.text.replace(/(https?:\/\/\S+)/, "").trim()}
          </span>
          {ref.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-[11px] text-blue-700 underline dark:text-blue-400"
            >
              {ref.url}
            </a>
          )}
          {/* Arrow */}
          <span
            className={cn(
              "absolute left-1/2 top-full -mt-px h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45",
              "border-b border-r border-slate-200 bg-white",
              "dark:border-stone-700 dark:bg-stone-800",
            )}
          />
        </span>
      )}
    </sup>
  );
}

// ─── Main renderer ───────────────────────────────────────────────────────────

function renderWithCitations(text: string): React.ReactNode[] {
  const cleaned = text.replace(/[\u2013\u2014]/g, " ");
  const re = /([.)""])(\d{1,3})(?=\s|$)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of cleaned.matchAll(re)) {
    const idx = match.index ?? 0;
    const full = match[0] ?? "";
    const prefix = match[1] ?? "";
    const num = match[2] ?? "";
    if (!num) continue;

    parts.push(cleaned.slice(lastIndex, idx));
    parts.push(prefix);
    parts.push(<CitationLink key={`cite-${idx}-${num}`} num={num} />);
    lastIndex = idx + full.length;
  }

  parts.push(cleaned.slice(lastIndex));
  return parts;
}

export function RichText({ text }: { text: string }) {
  return <>{renderWithCitations(text)}</>;
}
