export type UserRole =
  | "port_engineer"
  | "inspection_team"
  | "management"
  | "platform_admin";

export type ObservationStatus =
  | "open"
  | "confirmed"
  | "rejected"
  | "awaiting_review"
  | "work_order_raised"
  | "closed";

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
  assetsPending: number;
  assetsNeedsFollowUp: number;
  unresolvedFindings: number;
  openDataQualityWarnings: number;
  lastInspectionDate: string;
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
  modelVersion: string;
  dataVersion: string;
  coveragePercent: number;
};

export type Finding = {
  id: string;
  portId: string;
  assetId: string;
  missionId: string;
  defectType: DefectType;
  status: ObservationStatus;
  severity: Severity;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  panelId: string;
  depthBand: string;
  positionConfidence: number;
  standoffM: number;
  imageQuality: DataQualityBand;
  modelSuggestion: string;
  verifyFlag: boolean;
  reviewer: string | null;
  daysInQueue: number;
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
