"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;

    // Use native share sheet on mobile/supported browsers
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (_) {
        // User cancelled or share failed; fall through to clipboard
      }
    }

    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  }

  return (
    <button
      type="button"
      onClick={share}
      title={copied ? "Đã sao chép link!" : "Chia sẻ bài viết"}
      aria-label={copied ? "Đã sao chép link!" : "Chia sẻ bài viết"}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
        copied
          ? "border-green-400 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400"
          : [
              "border-slate-200 bg-white/80 text-slate-700 hover:border-blue-900/30 hover:text-blue-900",
              "dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:text-stone-100",
            ],
        className,
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">{copied ? "Đã sao chép!" : "Chia sẻ"}</span>
    </button>
  );
}

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      title="In bài viết"
      aria-label="In bài viết"
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
        "border-slate-200 bg-white/80 text-slate-700 hover:border-blue-900/30 hover:text-blue-900",
        "dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:text-stone-100",
        "print-hide",
        className,
      )}
    >
      <Copy className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">In / PDF</span>
    </button>
  );
}
