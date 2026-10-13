"use client";

import { useDashboard } from "@/context/dashboard-context";
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
          What happens next? Ordered by stored priority score with plain-language
          explanations. Management can view; only qualified roles confirm.
        </p>
      </div>

      <div className="grid gap-3">
        {queue.map((f, index) => {
          const asset = getAsset(f.assetId);
          const port = getPort(f.portId);
          return (
            <Panel
              key={f.id}
              title={`${index + 1}. ${asset?.name ?? f.assetId}`}
              subtitle={`${port?.name} · ${f.defectType.replace("_", " ")} · score ${f.priorityScore}`}
              action={<PriorityPill band={f.priorityBand} />}
            >
              <p className="text-sm leading-relaxed text-[var(--dash-fg)]">
                {f.priorityExplanation}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <Badge tone="warn">sev {f.severity}</Badge>
                <Badge>conf {f.confidence.toFixed(2)}</Badge>
                <Badge>{f.status.replaceAll("_", " ")}</Badge>
                <Badge tone={f.verifyFlag ? "watch" : "neutral"}>
                  verify {f.verifyFlag ? "yes" : "no"}
                </Badge>
                <Badge>{f.daysInQueue}d in queue</Badge>
              </div>
              <p className="mt-3 text-xs text-[var(--dash-muted)]">
                Model: {f.modelSuggestion}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Action
                  label="Confirm"
                  disabled={!mayConfirm}
                  hint={
                    role === "management"
                      ? "Management cannot confirm defects"
                      : mayConfirm
                        ? "Qualified role action"
                        : "Not permitted for this role"
                  }
                />
                <Action
                  label="Reject (store for retraining)"
                  disabled={!mayConfirm}
                />
                <Action
                  label="Schedule re-inspection"
                  disabled={role === "platform_admin"}
                />
                <Action
                  label="Raise work order"
                  disabled={role !== "port_engineer" && role !== "management"}
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
