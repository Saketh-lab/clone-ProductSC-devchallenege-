import type { ObservationStatus } from "./types";

export const STATUS_LABELS: Record<ObservationStatus, string> = {
  auto_detected: "Auto-detected",
  needs_review: "Needs review",
  inspector_confirmed: "Inspector confirmed",
  rejected: "Rejected",
};

export const STATUS_FILTER_HELP =
  "Status ladder: auto_detected → needs_review → inspector_confirmed | rejected";

export function statusLabel(status: ObservationStatus) {
  return STATUS_LABELS[status];
}
