"use client";

import { createContext, useContext } from "react";
import type { ReferenceItem } from "@/data/report";

const ReferencesContext = createContext<ReferenceItem[]>([]);

export const ReferencesProvider = ReferencesContext.Provider;

export function useReferences(): ReferenceItem[] {
  return useContext(ReferencesContext);
}
