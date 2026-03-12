"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type TocItem = { id: string; title: string; level: 2 | 3 };

function getTocItems(rootId: string): TocItem[] {
  const root = document.getElementById(rootId);
  if (!root) return [];

  const nodes = Array.from(root.querySelectorAll("h2[id], h3[id]")) as Array<
    HTMLHeadingElement
  >;

  return nodes
    .map((el) => {
      const level = el.tagName === "H2" ? 2 : 3;
      const title = (el.textContent ?? "").trim();
      const id = el.id;
      return title && id ? ({ id, title, level } as TocItem) : null;
    })
    .filter((x): x is TocItem => Boolean(x));
}

export function TableOfContents({
  rootId,
  className,
}: {
  rootId: string;
  className?: string;
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    setItems(getTocItems(rootId));
  }, [rootId]);

  useEffect(() => {
    if (ids.length === 0) return;

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((x): x is HTMLElement => Boolean(x));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.35, 0.5],
        rootMargin: "-12% 0px -70% 0px",
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  if (items.length === 0) return null;

  return (
    <nav className={cn("text-sm", className)} aria-label="Mục lục">
      <div className="hidden lg:block">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500">
          Mục lục
        </div>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block rounded-sm border-l-2 py-1 pl-3 pr-2 leading-snug transition",
                  "text-slate-700 dark:text-stone-400",
                  item.level === 3 && "pl-6 text-[13px]",
                  activeId === item.id
                    ? "border-amber-600 bg-white/70 font-semibold text-blue-900 shadow-sm dark:bg-stone-800/70 dark:text-blue-300"
                    : "border-transparent hover:border-amber-600/50 hover:bg-white/50 hover:text-slate-900 dark:hover:bg-stone-800/50 dark:hover:text-stone-200",
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-blue-900 px-4 py-2.5 text-sm font-semibold text-stone-50 shadow-lg shadow-blue-900/40"
        >
          <span>Mục lục</span>
          {activeId && (
            <span className="max-w-[160px] truncate text-xs font-normal text-blue-100">
              {
                items.find((it) => it.id === activeId)?.title ??
                items[0]?.title
              }
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm">
            <div className="max-h-[70vh] w-full rounded-t-3xl bg-white px-4 pb-6 pt-4 shadow-xl dark:bg-stone-900">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-stone-300">
                  Mục lục
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  Đóng
                </button>
              </div>
              <div className="max-h-[55vh] overflow-y-auto pb-2">
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                          } else {
                            window.location.hash = `#${item.id}`;
                          }
                          setMobileOpen(false);
                        }}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-[14px] leading-snug text-slate-700",
                          item.level === 3 && "pl-6 text-[13px] text-slate-600",
                          activeId === item.id && "bg-amber-50 font-semibold text-blue-900",
                        )}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

