"use client";

import { useMemo, useState } from "react";
import { useDashboard } from "@/context/dashboard-context";
import {
  ASSETS,
  conditionForAsset,
  findingsForAsset,
  getAsset,
  getPort,
  missionsForAsset,
  portsVisibleToRole,
} from "@/lib/data/selectors";
import { Badge, Panel } from "./ui";

export function AssetHistory() {
  const { role, filters } = useDashboard();
  const visible = portsVisibleToRole(role);
  const options = ASSETS.filter((a) =>
    visible.some((p) => p.id === a.portId)
  ).filter((a) => filters.portId === "all" || a.portId === filters.portId);

  const defaultId =
    options.find((a) => a.id === "a-nhv-qw-01")?.id ?? options[0]?.id;
  const [assetId, setAssetId] = useState(defaultId ?? "");
  const asset = getAsset(assetId);
  const missions = asset ? missionsForAsset(asset.id) : [];
  const trend = asset ? conditionForAsset(asset.id) : [];
  const defects = asset ? findingsForAsset(asset.id) : [];
  const [slider, setSlider] = useState(50);

  const maxArea = useMemo(
    () => Math.max(...trend.map((t) => t.affectedAreaM2), 1),
    [trend]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg">
            Asset history
          </h2>
          <p className="mt-1 text-sm text-[var(--dash-muted)]">
            What changed? Repeated surveys form a time-evolving model. Changes
            are trusted only beyond registration error.
          </p>
        </div>
        <label className="text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
          Asset
          <select
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="ml-2 rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] px-2 py-1.5 text-xs text-[var(--dash-fg)]"
          >
            {options.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({getPort(a.portId)?.code})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Mission timeline"
          subtitle="Each mission carries a stored data-quality badge"
        >
          <ol className="space-y-3">
            {missions.map((m) => (
              <li
                key={m.id}
                className="flex items-start justify-between gap-3 rounded-md border border-[var(--dash-border)] px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{m.date}</p>
                  <p className="text-[11px] text-[var(--dash-muted)]">
                    {m.id} · model {m.modelVersion} · coverage{" "}
                    {m.coveragePercent}%
                  </p>
                </div>
                <Badge
                  tone={
                    m.dataQualityBand === "pass"
                      ? "pass"
                      : m.dataQualityBand === "watch"
                        ? "watch"
                        : "fail"
                  }
                >
                  {m.dataQualityBand}
                </Badge>
              </li>
            ))}
            {missions.length === 0 ? (
              <p className="text-sm text-[var(--dash-muted)]">
                No missions for this asset.
              </p>
            ) : null}
          </ol>
        </Panel>

        <Panel
          title="Condition trend"
          subtitle="Severity and affected area over time (stored points)"
        >
          <div className="flex h-40 items-end gap-3">
            {trend.map((t) => (
              <div key={t.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-teal-500/70"
                  style={{
                    height: `${(t.affectedAreaM2 / maxArea) * 100}%`,
                    minHeight: 8,
                  }}
                  title={`Area ${t.affectedAreaM2} m² · sev ${t.severityAvg}`}
                />
                <span className="text-[9px] text-[var(--dash-muted)]">
                  {t.date.slice(2)}
                </span>
                <span className="text-[10px] tabular-nums">{t.conditionScore}</span>
              </div>
            ))}
            {trend.length === 0 ? (
              <p className="text-sm text-[var(--dash-muted)]">
                No trend series stored.
              </p>
            ) : null}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Side-by-side slider"
          subtitle="Registration error shown beside images (illustrative ±0.12 m)"
        >
          <div className="relative aspect-video overflow-hidden rounded-md border border-[var(--dash-border)]">
            <div className="absolute inset-0 flex items-center justify-center bg-sky-950/60 text-xs">
              Prior mission frame
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center bg-teal-950/80 text-xs"
              style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}
            >
              Latest mission frame
            </div>
            <div
              className="absolute inset-y-0 w-0.5 bg-white"
              style={{ left: `${slider}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="mt-3 w-full"
          />
          <p className="mt-2 text-[11px] text-[var(--dash-muted)]">
            Registration error: ±0.12 m · change trusted only beyond this error.
          </p>
        </Panel>

        <Panel
          title="Profile view"
          subtitle="Cross-section through crack/surface in both missions"
        >
          <svg viewBox="0 0 320 140" className="w-full text-teal-300">
            <path
              d="M10 90 C 60 88, 100 70, 150 72 S 250 95, 310 78"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.45"
            />
            <path
              d="M10 95 C 60 92, 100 55, 150 58 S 250 100, 310 82"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
            />
            <text x="12" y="20" fill="#8b9aab" fontSize="10">
              Prior profile
            </text>
            <text x="12" y="34" fill="#f43f5e" fontSize="10">
              Latest profile (growth beyond error band)
            </text>
          </svg>
          <p className="text-[11px] text-[var(--dash-muted)]">
            Expert 2D profiles beat automatic distances for exact change.
          </p>
        </Panel>
      </div>

      <Panel title="Defect register" subtitle="ID · type · first seen · last seen · status">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
              <tr className="border-b border-[var(--dash-border)]">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">First seen</th>
                <th className="py-2 pr-3">Last seen</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {defects.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-[var(--dash-border)]/70"
                >
                  <td className="py-2 pr-3 font-mono text-xs">{d.id}</td>
                  <td className="py-2 pr-3">{d.defectType.replace("_", " ")}</td>
                  <td className="py-2 pr-3 tabular-nums">{d.firstSeen}</td>
                  <td className="py-2 pr-3 tabular-nums">{d.lastSeen}</td>
                  <td className="py-2">
                    <Badge>{d.status.replaceAll("_", " ")}</Badge>
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
