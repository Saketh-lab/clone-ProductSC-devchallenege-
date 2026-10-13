"use client";

import { DashboardProvider } from "@/context/dashboard-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
