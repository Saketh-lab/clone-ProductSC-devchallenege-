"use client";

import { useMemo, useState } from "react";
import { useDashboard } from "@/context/dashboard-context";
import {
  ASSETS,
  elevationForAsset,
  filterAssets,
  getAsset,
  getPort,
  portsVisibleToRole,
} from "@/lib/data/selectors";
import { FINDINGS } from "@/lib/data/store";
import { Badge, Panel, PriorityPill } from "./ui";
import { cn } from "@/lib/utils";

export function PortAssetView() {
  const { role, filters, setFilters } = useDashboard();
  const visiblePorts = portsVisibleToRole(role);
  const assets = filterAssets(
    ASSETS.filter((a) => visiblePorts.some((p) => p.id === a.portId)),
    filters
  );
  const [selectedId, setSelectedId] = useState(
    assets[0]?.id ?? "a-nhv-qw-01"
  );
  const selected = getAsset(selectedId) ?? assets[0];
  const elevation = selected ? elevationForAsset(selected.id) : [];
  const finding = FINDINGS.find((f) => f.assetId === selected?.id);

  const grid = useMemo(() => {
    const cols = 4;
    const rows = 3;
    const cells: ((typeof elevation)[number] | null)[][] = Array.from(
      { length: rows },
      () => Array.from({ length: cols }, () => null)
    );
    for (const e of elevation) {
      if (cells[e.panelRow]) cells[e.panelRow][e.panelCol] = e;
    }
    return cells;
  }, [elevation]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Port & asset view
        </h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          Asset list with berth/class filters. Elevation view localises
          observations; coverage gaps are stored as no_coverage cells.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Asset list" className="lg:col-span-2">
          <ul className="max-h-[420px] space-y-1 overflow-auto">
            {assets.map((a) => {
              const port = getPort(a.portId);
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(a.id);
                      setFilters({ portId: a.portId });
                    }}
                    className={cn(
                      "w-full rounded-md border px-3 py-2 text-left transition",
                      selected?.id === a.id
                        ? "border-teal-500/50 bg-teal-500/10"
                        : "border-transparent hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{a.name}</span>
                      <Badge
                        tone={
                          a.conditionLabel === "critical" ||
                          a.conditionLabel === "poor"
                            ? "fail"
                            : a.conditionLabel === "fair"
                              ? "watch"
                              : "pass"
                        }
                      >
                        {a.conditionLabel}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--dash-muted)]">
                      {port?.name} · {a.berth} · {a.assetClass.replace("_", " ")}{" "}
                      · last {a.lastInspected} · {a.openItems} open
                    </p>
                  </button>
                </li>
              );
            })}
            {assets.length === 0 ? (
              <p className="text-sm text-[var(--dash-muted)]">
                No assets match filters.
              </p>
            ) : null}
          </ul>
        </Panel>

        <div className="space-y-4 lg:col-span-3">
          <Panel
            title="Elevation view"
            subtitle={
              selected
                ? `${selected.name} — colour = status, size = severity`
                : undefined
            }
          >
            <div className="mb-2 flex flex-wrap gap-3 text-[10px] text-[var(--dash-muted)]">
              <span>Depth bands ↓ · Panels →</span>
              <span className="inline-flex items-center gap-1">
                <i className="size-2 rounded-sm bg-emerald-500/40" /> clear
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="size-2 rounded-sm bg-rose-500" /> finding
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="size-2 rounded-sm bg-zinc-600" /> no coverage
              </span>
            </div>
            <div className="grid gap-1">
              {grid.map((row, ri) => (
                <div key={ri} className="grid grid-cols-4 gap-1">
                  {row.map((cell, ci) => {
                    if (!cell) {
                      return (
                        <div
                          key={`${ri}-${ci}`}
                          className="aspect-[4/3] rounded bg-zinc-800/40"
                        />
                      );
                    }
                    const size =
                      cell.severity >= 5
                        ? "scale-100"
                        : cell.severity >= 3
                          ? "scale-90"
                          : "scale-75";
                    const bg =
                      cell.status === "no_coverage"
                        ? "bg-zinc-700"
                        : cell.status === "clear"
                          ? "bg-emerald-900/50"
                          : cell.severity >= 5
                            ? "bg-rose-600"
                            : cell.severity >= 3
                              ? "bg-orange-500"
                              : "bg-amber-500";
                    return (
                      <div
                        key={cell.id}
                        className={cn(
                          "flex aspect-[4/3] items-center justify-center rounded border border-white/10 text-[10px] font-medium",
                          bg,
                          size
                        )}
                        title={`${cell.status} · sev ${cell.severity}`}
                      >
                        {cell.status === "no_coverage"
                          ? "—"
                          : cell.status === "clear"
                            ? "ok"
                            : `S${cell.severity}`}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-[var(--dash-muted)]">
              Areas with no usable frames are stored coverage gaps (affects
              comparison trust). Occlusion on vertical walls reduces accuracy —
              shown as no_coverage / watch bands in linked missions.
            </p>
          </Panel>

          <Panel
            title="Evidence side panel"
            subtitle="Raw/enhanced frame placeholders · pose · confidence · standoff · model"
          >
            {finding && selected ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--dash-border)] bg-[#0a1018] text-xs text-[var(--dash-muted)]">
                    Raw frame · {finding.panelId}
                  </div>
                  <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--dash-border)] bg-[#0a1018] text-xs text-[var(--dash-muted)]">
                    Enhanced frame · contrast stretch
                  </div>
                </div>
                <dl className="space-y-2 text-sm">
                  <Row k="Finding" v={finding.displayId} />
                  <Row k="Confidence" v={finding.confidence.toFixed(2)} />
                  <Row k="Data quality" v={finding.dataQualityScore.toFixed(2)} />
                  <Row
                    k="Verify"
                    v={
                      finding.verifyFlag
                        ? finding.verifyTrigger
                        : "no (conf ≥ 0.6 and DQ ≥ 0.5)"
                    }
                  />
                  <Row
                    k="Position confidence"
                    v={finding.positionConfidence.toFixed(2)}
                  />
                  <Row k="Standoff" v={`${finding.standoffM} m`} />
                  <Row k="Image quality" v={finding.imageQuality} />
                  <Row k="Depth band" v={finding.depthBand} />
                  <Row
                    k="Priority"
                    v={<PriorityPill band={finding.priorityBand} />}
                  />
                  <Row k="Model suggestion" v={finding.modelSuggestion} />
                </dl>
              </div>
            ) : (
              <p className="text-sm text-[var(--dash-muted)]">
                Select an asset with findings to inspect evidence fields.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[var(--dash-border)]/60 pb-1.5">
      <dt className="text-[var(--dash-muted)]">{k}</dt>
      <dd className="text-right text-[var(--dash-fg)]">{v}</dd>
    </div>
  );
}
