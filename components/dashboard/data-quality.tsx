"use client";

import { useDashboard } from "@/context/dashboard-context";
import { getAsset, getPort, warningsFiltered } from "@/lib/data/selectors";
import { MISSIONS } from "@/lib/data/store";
import { Badge, Panel } from "./ui";

export function DataQualityCentre() {
  const { filters, setFilters } = useDashboard();
  const warnings = warningsFiltered(filters);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Data-quality centre
        </h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          One list of everything the platform doubts about its own data. Judge
          missions by validity, availability and fault recovery — not just
          average error. Network overview tile counts <strong>open</strong>{" "}
          warnings only (stored per port); this table lists all open and
          acknowledged records for the filter.
        </p>
      </div>

      <Panel
        title="Open & acknowledged warnings"
        subtitle={`Showing all ${warnings.length} matching records (not a truncated “latest” list)`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
              <tr className="border-b border-[var(--dash-border)]">
                <th className="py-2 pr-3">Warning</th>
                <th className="py-2 pr-3">Triggered when</th>
                <th className="py-2 pr-3">Action</th>
                <th className="py-2 pr-3">Port / mission</th>
                <th className="py-2 pr-3">Asset</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((w) => {
                const mission = MISSIONS.find((m) => m.id === w.missionId);
                return (
                  <tr
                    key={w.id}
                    className="border-b border-[var(--dash-border)]/70"
                  >
                    <td className="py-2.5 pr-3 font-medium">{w.label}</td>
                    <td className="py-2.5 pr-3 text-[var(--dash-muted)]">
                      {w.triggeredWhen}
                    </td>
                    <td className="py-2.5 pr-3">{w.recommendedAction}</td>
                    <td className="py-2.5 pr-3">
                      <button
                        type="button"
                        className="text-teal-300 hover:underline"
                        onClick={() => setFilters({ portId: w.portId })}
                      >
                        {getPort(w.portId)?.name}
                      </button>
                      <div className="text-[11px] text-[var(--dash-muted)]">
                        {w.missionId}
                        {mission ? ` · DQ ${mission.dataQualityBand}` : ""}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-[var(--dash-muted)]">
                      {w.assetId
                        ? getAsset(w.assetId)?.name ?? w.assetId
                        : "—"}
                    </td>
                    <td className="py-2.5">
                      <Badge
                        tone={w.status === "open" ? "fail" : "watch"}
                      >
                        {w.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
