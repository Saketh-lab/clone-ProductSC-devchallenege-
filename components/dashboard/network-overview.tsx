"use client";

import Link from "next/link";
import { useDashboard } from "@/context/dashboard-context";
import {
  filterPorts,
  networkTotals,
  portsVisibleToRole,
} from "@/lib/data/selectors";
import { Panel, PriorityPill, StatTile, TrendArrow } from "./ui";

export function NetworkOverview() {
  const { role, filters, setFilters } = useDashboard();
  const visible = portsVisibleToRole(role);
  const ports = filterPorts(visible, filters);
  const totals = networkTotals(ports);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Network overview — 11 ports
        </h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          Where do we stand? Tiles and table read stored port fields from one
          database — screens never recalculate status.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile
          label="Inspected"
          value={totals.inspected}
          hint="Assets with ≥1 completed survey"
        />
        <StatTile
          label="Pending"
          value={totals.pending}
          hint="Not yet inspected (= total − inspected)"
        />
        <StatTile
          label="Needs follow-up"
          value={totals.needsFollowUp}
          hint="Already inspected; need another pass"
        />
        <StatTile
          label="Unresolved findings"
          value={totals.unresolvedFindings}
          hint="Stored sum"
        />
        <StatTile
          label="Open DQ warnings"
          value={totals.openDataQualityWarnings}
          hint="Open only — matches data-quality centre"
        />
      </div>
      <p className="text-[11px] text-[var(--dash-muted)]">
        Tile check: inspected ({totals.inspected}) + pending ({totals.pending}) ={" "}
        {totals.inspected + totals.pending} assets in scope. Needs follow-up is
        a subset of inspected, not an extra bucket.
      </p>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel
          title="Port map"
          subtitle="Pin colour = worst open priority (stored field)"
          className="lg:col-span-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-[var(--dash-border)] bg-[#0a1018]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(#243041 1px, transparent 1px), linear-gradient(90deg, #243041 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {ports.map((p) => {
              const left = ((p.lng + 6) / 12) * 100;
              const top = ((56 - p.lat) / 8) * 100;
              return (
                <button
                  key={p.id}
                  type="button"
                  title={`${p.name} · ${p.worstOpenPriority}`}
                  onClick={() => setFilters({ portId: p.id })}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${Math.min(92, Math.max(8, left))}%`,
                    top: `${Math.min(88, Math.max(10, top))}%`,
                  }}
                >
                  <span
                    className={`block size-3 rounded-full ring-2 ring-white/30 ${
                      p.worstOpenPriority === "critical"
                        ? "bg-rose-600"
                        : p.worstOpenPriority === "high"
                          ? "bg-orange-500"
                          : p.worstOpenPriority === "medium"
                            ? "bg-amber-400"
                            : "bg-emerald-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-[var(--dash-muted)]">
            Click a pin to set the port filter (carries to all screens).
          </p>
        </Panel>

        <Panel
          title="Overdue inspections calendar"
          subtitle="Stored overdue count per port"
          className="lg:col-span-3"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {ports
              .filter((p) => p.overdueInspections > 0)
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-md border border-rose-500/30 bg-rose-950/30 px-3 py-2"
                >
                  <p className="text-xs font-medium">{p.name}</p>
                  <p className="text-[11px] text-[var(--dash-muted)]">
                    {p.overdueInspections} overdue · last {p.lastInspectionDate}
                  </p>
                </div>
              ))}
            {ports.every((p) => p.overdueInspections === 0) ? (
              <p className="text-sm text-[var(--dash-muted)]">
                No overdue inspections in current filter.
              </p>
            ) : null}
          </div>
        </Panel>
      </div>

      <Panel
        title="Ports table"
        subtitle="Assets, last inspection, % on schedule, open findings by stored status, trend"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
              <tr className="border-b border-[var(--dash-border)]">
                <th className="py-2 pr-3 font-medium">Port</th>
                <th className="py-2 pr-3 font-medium">Assets</th>
                <th className="py-2 pr-3 font-medium">Last insp.</th>
                <th className="py-2 pr-3 font-medium">
                  On schedule
                  <span className="mt-0.5 block font-normal normal-case tracking-normal text-[10px] text-[var(--dash-muted)]">
                    % of due inspections done by due date
                  </span>
                </th>
                <th className="py-2 pr-3 font-medium">Unresolved</th>
                <th className="py-2 pr-3 font-medium">DQ warn.</th>
                <th className="py-2 pr-3 font-medium">Worst priority</th>
                <th className="py-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[var(--dash-border)]/70 hover:bg-white/[0.02]"
                >
                  <td className="py-2.5 pr-3">
                    <Link
                      href="/ports"
                      onClick={() => setFilters({ portId: p.id })}
                      className="font-medium text-teal-300 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="ml-2 text-[11px] text-[var(--dash-muted)]">
                      {p.code}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">
                    {p.assetsInspected}/{p.assetsTotal}
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums text-[var(--dash-muted)]">
                    {p.lastInspectionDate}
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">
                    {p.percentOnSchedule}%
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">
                    {p.unresolvedFindings}
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">
                    {p.openDataQualityWarnings}
                  </td>
                  <td className="py-2.5 pr-3">
                    <PriorityPill band={p.worstOpenPriority} />
                  </td>
                  <td className="py-2.5">
                    <TrendArrow direction={p.trendDirection} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
