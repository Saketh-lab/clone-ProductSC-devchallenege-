"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { emptyFilters } from "@/lib/data/selectors";
import type { DashboardFilters, UserRole } from "@/lib/data/types";

type DashboardContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  filters: DashboardFilters;
  setFilters: (patch: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("management");
  const [filters, setFiltersState] = useState<DashboardFilters>(emptyFilters);

  const value = useMemo<DashboardContextValue>(
    () => ({
      role,
      setRole,
      filters,
      setFilters: (patch) =>
        setFiltersState((prev) => ({ ...prev, ...patch })),
      resetFilters: () => setFiltersState(emptyFilters()),
    }),
    [role, filters]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
