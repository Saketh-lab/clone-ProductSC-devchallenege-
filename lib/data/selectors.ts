import {
  ASSETS,
  CONDITION_TRENDS,
  DATA_QUALITY_WARNINGS,
  DEFAULT_OWNED_PORTS,
  ELEVATION_OBS,
  FINDINGS,
  MISSIONS,
  PORTS,
} from "./store";
import type {
  Asset,
  DashboardFilters,
  Finding,
  Port,
  PriorityBand,
  UserRole,
} from "./types";

export function emptyFilters(): DashboardFilters {
  return {
    portId: "all",
    berth: "all",
    assetClass: "all",
    dateFrom: "2025-01-01",
    dateTo: "2026-12-31",
    status: "all",
    severity: "all",
    confidenceMin: 0,
    defectType: "all",
    dataQualityBand: "all",
    verifyFlag: "all",
    reviewer: "all",
  };
}

export function portsVisibleToRole(role: UserRole): Port[] {
  const owned = new Set(DEFAULT_OWNED_PORTS[role] ?? []);
  if (role === "management" || role === "platform_admin") return PORTS;
  return PORTS.filter((p) => owned.has(p.id));
}

/** Network tiles — sum of stored port fields only (no derived recalculation). */
export function networkTotals(ports: Port[]) {
  return {
    inspected: ports.reduce((s, p) => s + p.assetsInspected, 0),
    pending: ports.reduce((s, p) => s + p.assetsPending, 0),
    needsFollowUp: ports.reduce((s, p) => s + p.assetsNeedsFollowUp, 0),
    unresolvedFindings: ports.reduce((s, p) => s + p.unresolvedFindings, 0),
    openDataQualityWarnings: ports.reduce(
      (s, p) => s + p.openDataQualityWarnings,
      0
    ),
    overdueInspections: ports.reduce((s, p) => s + p.overdueInspections, 0),
  };
}

export function filterPorts(
  ports: Port[],
  filters: DashboardFilters
): Port[] {
  if (filters.portId === "all") return ports;
  return ports.filter((p) => p.id === filters.portId);
}

export function filterAssets(
  assets: Asset[],
  filters: DashboardFilters
): Asset[] {
  return assets.filter((a) => {
    if (filters.portId !== "all" && a.portId !== filters.portId) return false;
    if (filters.berth !== "all" && a.berth !== filters.berth) return false;
    if (filters.assetClass !== "all" && a.assetClass !== filters.assetClass)
      return false;
    return true;
  });
}

export function filterFindings(
  findings: Finding[],
  filters: DashboardFilters
): Finding[] {
  return findings.filter((f) => {
    if (filters.portId !== "all" && f.portId !== filters.portId) return false;
    if (filters.status !== "all" && f.status !== filters.status) return false;
    if (filters.severity !== "all" && f.severity !== filters.severity)
      return false;
    if (f.confidence < filters.confidenceMin) return false;
    if (filters.defectType !== "all" && f.defectType !== filters.defectType)
      return false;
    if (filters.verifyFlag === "yes" && !f.verifyFlag) return false;
    if (filters.verifyFlag === "no" && f.verifyFlag) return false;
    if (filters.reviewer !== "all") {
      if (filters.reviewer === "unassigned" && f.reviewer !== null) return false;
      if (
        filters.reviewer !== "unassigned" &&
        f.reviewer !== filters.reviewer
      )
        return false;
    }
    if (f.lastSeen < filters.dateFrom || f.lastSeen > filters.dateTo)
      return false;

    const asset = ASSETS.find((a) => a.id === f.assetId);
    if (!asset) return false;
    if (filters.berth !== "all" && asset.berth !== filters.berth) return false;
    if (filters.assetClass !== "all" && asset.assetClass !== filters.assetClass)
      return false;
    return true;
  });
}

export function getPort(id: string) {
  return PORTS.find((p) => p.id === id);
}

export function getAsset(id: string) {
  return ASSETS.find((a) => a.id === id);
}

export function assetsForPort(portId: string) {
  return ASSETS.filter((a) => a.portId === portId);
}

export function missionsForAsset(assetId: string) {
  return MISSIONS.filter((m) => m.assetId === assetId).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function findingsForAsset(assetId: string) {
  return FINDINGS.filter((f) => f.assetId === assetId);
}

export function conditionForAsset(assetId: string) {
  return CONDITION_TRENDS.filter((c) => c.assetId === assetId).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

export function elevationForAsset(assetId: string) {
  return ELEVATION_OBS.filter((e) => e.assetId === assetId);
}

export function warningsFiltered(filters: DashboardFilters) {
  return DATA_QUALITY_WARNINGS.filter((w) => {
    if (filters.portId !== "all" && w.portId !== filters.portId) return false;
    if (w.status === "resolved") return false;
    return true;
  });
}

/** Active priorities for action — excludes already inspector_confirmed / rejected. */
export function priorityQueue(filters: DashboardFilters) {
  return filterFindings(FINDINGS, filters)
    .filter(
      (f) => f.status === "needs_review" || f.status === "auto_detected"
    )
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

/** Review queue — needs_review only (confirmed items stay out). */
export function reviewQueue(filters: DashboardFilters) {
  return filterFindings(FINDINGS, filters)
    .filter((f) => f.status === "needs_review")
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export function openWarningCount() {
  return DATA_QUALITY_WARNINGS.filter((w) => w.status === "open").length;
}

export function priorityColor(band: PriorityBand) {
  switch (band) {
    case "critical":
      return "bg-rose-600";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-400";
    case "low":
      return "bg-emerald-500";
  }
}

export function canConfirm(role: UserRole) {
  return role === "port_engineer" || role === "inspection_team";
}

export function canEditWeights(role: UserRole) {
  return role === "management" || role === "port_engineer";
}

export function canUploadMissions(role: UserRole) {
  return role === "inspection_team";
}

export {
  ASSETS,
  FINDINGS,
  MISSIONS,
  PORTS,
  DATA_QUALITY_WARNINGS,
  AUDIT_LOG,
} from "./store";
