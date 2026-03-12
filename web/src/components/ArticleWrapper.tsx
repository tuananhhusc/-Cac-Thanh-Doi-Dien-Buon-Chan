"use client";

import { ReferencesProvider } from "@/context/ReferencesContext";
import type { ReferenceItem } from "@/data/report";

export function ArticleWrapper({
  references,
  children,
}: {
  references: ReferenceItem[];
  children: React.ReactNode;
}) {
  return (
    <ReferencesProvider value={references}>{children}</ReferencesProvider>
  );
}
