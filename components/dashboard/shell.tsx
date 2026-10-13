"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  ClipboardList,
  Gauge,
  History,
  LayoutDashboard,
  ListOrdered,
  Map,
  Shield,
} from "lucide-react";
import { ILLUSTRATIVE_BANNER } from "@/lib/data/store";
import { ROLE_LABELS } from "@/lib/data/store";
import type { UserRole } from "@/lib/data/types";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/dashboard/filter-bar";

const NAV = [
  { href: "/", label: "Network overview", icon: LayoutDashboard },
  { href: "/ports", label: "Port & asset", icon: Map },
  { href: "/history", label: "Asset history", icon: History },
  { href: "/review", label: "Review queue", icon: ClipboardList },
  { href: "/data-quality", label: "Data-quality centre", icon: AlertTriangle },
  { href: "/priorities", label: "Priority panel", icon: ListOrdered },
  { href: "/reports", label: "Reports & audit", icon: Shield },
] as const;

const ROLES: UserRole[] = [
  "management",
  "port_engineer",
  "inspection_team",
  "platform_admin",
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole } = useDashboard();

  return (
    <div className="min-h-dvh bg-[var(--dash-bg)] text-[var(--dash-fg)]">
      <div className="border-b border-amber-700/40 bg-amber-950/80 px-4 py-2 text-center text-xs font-medium tracking-wide text-amber-100">
        {ILLUSTRATIVE_BANNER}
      </div>

      <div className="flex min-h-[calc(100dvh-36px)]">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--dash-border)] bg-[var(--dash-panel)] md:flex">
          <div className="border-b border-[var(--dash-border)] px-4 py-5">
            <div className="flex items-center gap-2">
              <Gauge className="size-5 text-teal-400" />
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg leading-none tracking-tight">
                  PortPulse
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--dash-muted)]">
                  Cross-port intelligence
                </p>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 p-2">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                    active
                      ? "bg-teal-500/15 text-teal-200"
                      : "text-[var(--dash-muted)] hover:bg-white/5 hover:text-[var(--dash-fg)]"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--dash-border)] p-3">
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
              Active role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-md border border-[var(--dash-border)] bg-[var(--dash-bg)] px-2 py-1.5 text-xs"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[10px] leading-snug text-[var(--dash-muted)]">
              Role switches demo access only. Numbers stay identical — one
              database.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-3 md:px-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--dash-muted)]">
                Deliverable 4 · Module 3
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-xl tracking-tight md:text-2xl">
                Where we stand · What changed · What next
              </h1>
            </div>
            <div className="hidden text-right text-xs text-[var(--dash-muted)] sm:block">
              <p>Signed in as</p>
              <p className="font-medium text-[var(--dash-fg)]">
                {ROLE_LABELS[role]}
              </p>
            </div>
          </header>

          {/* Mobile nav */}
          <div className="flex gap-1 overflow-x-auto border-b border-[var(--dash-border)] bg-[var(--dash-panel)] px-2 py-2 md:hidden">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs",
                  (href === "/" ? pathname === "/" : pathname.startsWith(href))
                    ? "bg-teal-500/20 text-teal-200"
                    : "bg-white/5 text-[var(--dash-muted)]"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <FilterBar />

          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
