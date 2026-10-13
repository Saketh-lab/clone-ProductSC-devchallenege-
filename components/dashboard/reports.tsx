"use client";

import { useDashboard } from "@/context/dashboard-context";
import { AUDIT_LOG } from "@/lib/data/store";
import { Panel } from "./ui";

const REPORTS = [
  {
    name: "Asset report (PDF)",
    detail: "Condition, findings, missions — stamped with data & model version",
  },
  {
    name: "Port summary (PDF)",
    detail: "Inspected / pending / follow-up tiles and open priorities",
  },
  {
    name: "Management one-pager (PDF)",
    detail: "11-port standings, trends, top priorities in plain words",
  },
  {
    name: "Defect register (CSV)",
    detail: "By asset and date — export of stored register fields",
  },
  {
    name: "Data-quality report per mission",
    detail: "Validity, availability, fault recovery, warning list",
  },
];

export function ReportsAudit() {
  const { role } = useDashboard();
  const entries =
    role === "management" || role === "platform_admin"
      ? AUDIT_LOG
      : AUDIT_LOG.filter((a) => a.role === role);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Reports, alerts & audit
        </h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          Each report states data version, model version and weights used.
          Access by role and port.
        </p>
      </div>

      <Panel title="Export catalogue" subtitle="Demo buttons — no files generated">
        <ul className="space-y-2">
          {REPORTS.map((r) => (
            <li
              key={r.name}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--dash-border)] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-[11px] text-[var(--dash-muted)]">{r.detail}</p>
              </div>
              <button
                type="button"
                className="rounded-md bg-teal-600/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-500"
              >
                Export
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-[var(--dash-muted)]">
          Example stamp: dataVersion mission-2026-03-28-r3 · model defect-v2.4.1 ·
          weights criticality-A severity 1.4
        </p>
      </Panel>

      <Panel
        title="Alerts to port engineer"
        subtitle="Severity 5 · fast change on critical asset · items stuck in queue"
      >
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--dash-muted)]">
          <li>f-1001 severity 5 crack growth on Quay Wall B1 North</li>
          <li>f-1003 awaiting review 21 days — escalate</li>
          <li>Tees Mouth: 4 overdue inspections</li>
        </ul>
      </Panel>

      <Panel
        title="Audit log"
        subtitle={
          role === "management" || role === "platform_admin"
            ? "All actions visible"
            : "Own-role actions only (demo filter)"
        }
      >
        <ul className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.id}
              className="rounded-md border border-[var(--dash-border)] px-3 py-2 text-sm"
            >
              <p className="font-medium">
                {e.action.replaceAll("_", " ")} · {e.actor}
              </p>
              <p className="text-[11px] text-[var(--dash-muted)]">
                {e.at} · {e.detail}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
