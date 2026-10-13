"use client";

import { useDashboard } from "@/context/dashboard-context";
import { getAsset, getPort, priorityQueue } from "@/lib/data/selectors";
import { Badge, Panel, PriorityPill } from "./ui";

export function ReviewQueue() {
  const { role, filters } = useDashboard();
  const items = priorityQueue(filters).filter(
    (f) => f.status === "awaiting_review" || f.verifyFlag
  );
  const mayAct = role === "port_engineer" || role === "inspection_team";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Review queue
        </h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          Ordered by priority score. Evidence, model suggestion, and the three
          actions: confirm, reject (stored for retraining), or schedule
          re-inspection.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((f) => (
          <Panel
            key={f.id}
            title={getAsset(f.assetId)?.name ?? f.assetId}
            subtitle={`${getPort(f.portId)?.name} · ${f.id}`}
            action={<PriorityPill band={f.priorityBand} />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--dash-border)] bg-[#0a1018] text-xs text-[var(--dash-muted)] md:col-span-1">
                Evidence frame · {f.panelId}
              </div>
              <div className="md:col-span-2 space-y-2 text-sm">
                <p>{f.modelSuggestion}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="warn">sev {f.severity}</Badge>
                  <Badge>conf {f.confidence.toFixed(2)}</Badge>
                  <Badge>{f.daysInQueue}d waiting</Badge>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    disabled={!mayAct}
                    className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    disabled={!mayAct}
                    className="rounded-md border border-[var(--dash-border)] px-3 py-1.5 text-xs disabled:opacity-40"
                  >
                    Reject → retrain store
                  </button>
                  <button
                    type="button"
                    disabled={role === "platform_admin"}
                    className="rounded-md border border-[var(--dash-border)] px-3 py-1.5 text-xs disabled:opacity-40"
                  >
                    Schedule re-inspection
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-[var(--dash-muted)]">Queue empty for filters.</p>
        ) : null}
      </div>
    </div>
  );
}
