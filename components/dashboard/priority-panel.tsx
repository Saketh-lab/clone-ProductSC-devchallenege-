"use client";

import { useDashboard } from "@/context/dashboard-context";
import { statusLabel } from "@/lib/data/labels";
import { getAsset, getPort, priorityQueue } from "@/lib/data/selectors";
import { Badge, Panel, PriorityPill } from "./ui";

export function PriorityPanel() {
  const { role, filters } = useDashboard();
  const queue = priorityQueue(filters);
  const mayConfirm =
    role === "port_engineer" || role === "inspection_team";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Priority panel
        </h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          What happens next? Ordered by stored priority score = 0.45·severity +
          0.30·rate of change + 0.25·criticality. Management can view; only
          qualified roles confirm or reject.
        </p>
      </div>

      {!mayConfirm ? (
        <p className="rounded-md border border-amber-700/40 bg-amber-950/40 px-3 py-2 text-xs text-amber-100">
          Active role <strong>{role.replaceAll("_", " ")}</strong> cannot
          confirm or reject findings. Confirm / Reject controls are hidden.
        </p>
      ) : null}

      <div className="grid gap-3">
        {queue.map((f, index) => {
          const asset = getAsset(f.assetId);
          const port = getPort(f.portId);
          return (
            <Panel
              key={f.id}
              title={`${index + 1}. ${asset?.name ?? f.assetId}`}
              subtitle={`${port?.name} · ${f.displayId} · ${f.defectType.replace("_", " ")} · score ${f.priorityScore}`}
              action={<PriorityPill band={f.priorityBand} />}
            >
              <p className="text-sm leading-relaxed text-[var(--dash-fg)]">
                {f.priorityExplanation}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <Badge tone="warn">sev {f.severity}</Badge>
                <Badge>conf {f.confidence.toFixed(2)}</Badge>
                <Badge>DQ {f.dataQualityScore.toFixed(2)}</Badge>
                <Badge>{statusLabel(f.status)}</Badge>
                <Badge tone={f.verifyFlag ? "watch" : "neutral"}>
                  {f.verifyFlag
                    ? `verify — ${f.verifyTrigger}`
                    : "verify no"}
                </Badge>
                <Badge>Δ rate {f.rateOfChange.toFixed(2)}</Badge>
              </div>
              <p className="mt-3 text-xs text-[var(--dash-muted)]">
                Model: {f.modelSuggestion}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mayConfirm ? (
                  <>
                    <Action label="Confirm" hint="Qualified role action" />
                    <Action label="Reject (store for retraining)" />
                  </>
                ) : null}
                <Action
                  label="Schedule re-inspection"
                  disabled={role === "platform_admin"}
                />
                <Action
                  label={
                    role === "management"
                      ? "Approve work order"
                      : "Raise work order"
                  }
                  disabled={
                    role !== "port_engineer" && role !== "management"
                  }
                  hint={
                    role === "management"
                      ? "Management approves"
                      : role === "port_engineer"
                        ? "Port engineer raises"
                        : "Not permitted"
                  }
                />
              </div>
            </Panel>
          );
        })}
        {queue.length === 0 ? (
          <p className="text-sm text-[var(--dash-muted)]">
            No priorities match the current filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Action({
  label,
  disabled,
  hint,
}: {
  label: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={hint}
      className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-bg)] px-3 py-1.5 text-xs font-medium text-[var(--dash-fg)] transition enabled:hover:border-teal-500/50 enabled:hover:text-teal-200 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
