export type UserRole =
  | "port_engineer"
  | "inspection_team"
  | "management"
  | "platform_admin";

/** Doc status ladder (Module 2/3). */
export type ObservationStatus =
  | "auto_detected"
  | "needs_review"
  | "inspector_confirmed"
  | "rejected";

export type Severity = 1 | 2 | 3 | 4 | 5;

export type DataQualityBand = "pass" | "watch" | "fail";

export type PriorityBand = "critical" | "high" | "medium" | "low";

export type AssetClass =
  | "quay_wall"
  | "fender"
  | "bollard"
  | "pile"
  | "slab"
  | "crane_rail";

export type DefectType =
  | "crack"
  | "spalling"
  | "corrosion"
  | "scour"
  | "joint_failure"
  | "coating_loss";

export type WarningCause =
  | "low_visibility"
  | "high_position_uncertainty"
  | "incomplete_coverage"
  | "marker_not_verified"
  | "calibration_expired"
  | "clock_drift"
  | "awaiting_review_too_long";

export type Port = {
  id: string;
  name: string;
  code: string;
  region: string;
  lat: number;
  lng: number;
  /** Stored aggregate — not computed in UI */
  assetsTotal: number;
  assetsInspected: number;
  /** Not yet inspected = total − inspected (stored to match that definition) */
  assetsPending: number;
  /** Among inspected assets that need another pass (not part of pending) */
  assetsNeedsFollowUp: number;
  unresolvedFindings: number;
  openDataQualityWarnings: number;
  lastInspectionDate: string;
  /**
   * Share of due inspections completed by their due date (stored).
   * Not the same as inspected/total.
   */
  percentOnSchedule: number;
  trendDirection: "up" | "down" | "flat";
  worstOpenPriority: PriorityBand;
  overdueInspections: number;
};

export type Asset = {
  id: string;
  portId: string;
  berth: string;
  name: string;
  assetClass: AssetClass;
  lastInspected: string;
  /** Stored condition score 0–100 */
  conditionScore: number;
  conditionLabel: "good" | "fair" | "poor" | "critical";
  openItems: number;
  criticality: "A" | "B" | "C";
};

export type Mission = {
  id: string;
  portId: string;
  assetId: string;
  date: string;
  dataQualityBand: DataQualityBand;
  /** 0–1 stored mission data-quality score */
  dataQualityScore: number;
  modelVersion: string;
  dataVersion: string;
  coveragePercent: number;
};

export type Finding = {
  /** Internal stable key */
  id: string;
  /** OBS-… until inspector_confirmed, then DEF-… */
  displayId: string;
  portId: string;
  assetId: string;
  missionId: string;
  defectType: DefectType;
  status: ObservationStatus;
  severity: Severity;
  confidence: number;
  /** 0–1 stored data-quality score for verify rule */
  dataQualityScore: number;
  firstSeen: string;
  lastSeen: string;
  panelId: string;
  depthBand: string;
  positionConfidence: number;
  standoffM: number;
  imageQuality: DataQualityBand;
  modelSuggestion: string;
  /**
   * Stored verify flag. Rule: confidence < 0.6 OR dataQualityScore < 0.5.
   */
  verifyFlag: boolean;
  /** Which rule fired — null when verifyFlag is false */
  verifyTrigger: string | null;
  reviewer: string | null;
  daysInQueue: number;
  /** 0–1 rate of change used in priority formula */
  rateOfChange: number;
  /**
   * Stored priority score =
   * 0.45×severityNorm + 0.30×rateOfChange + 0.25×criticalityNorm (×100)
   */
  priorityScore: number;
  priorityBand: PriorityBand;
  priorityExplanation: string;
};

export type DataQualityWarning = {
  id: string;
  portId: string;
  missionId: string;
  assetId: string | null;
  cause: WarningCause;
  /** Stored label shown in UI */
  label: string;
  triggeredWhen: string;
  recommendedAction: string;
  status: "open" | "acknowledged" | "resolved";
  raisedAt: string;
};

export type ConditionPoint = {
  assetId: string;
  date: string;
  severityAvg: number;
  affectedAreaM2: number;
  conditionScore: number;
};

export type ElevationObservation = {
  id: string;
  assetId: string;
  findingId: string | null;
  panelCol: number;
  panelRow: number;
  status: ObservationStatus | "clear" | "no_coverage";
  severity: Severity | 0;
};

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  role: UserRole;
  action: string;
  detail: string;
};

export type DashboardFilters = {
  portId: string | "all";
  berth: string | "all";
  assetClass: AssetClass | "all";
  dateFrom: string;
  dateTo: string;
  status: ObservationStatus | "all";
  severity: Severity | "all";
  confidenceMin: number;
  defectType: DefectType | "all";
  dataQualityBand: DataQualityBand | "all";
  verifyFlag: "all" | "yes" | "no";
  reviewer: string | "all";
};

/** Priority weights (doc): severity, rate of change, criticality */
export const PRIORITY_WEIGHTS = {
  severity: 0.45,
  rateOfChange: 0.3,
  criticality: 0.25,
} as const;
