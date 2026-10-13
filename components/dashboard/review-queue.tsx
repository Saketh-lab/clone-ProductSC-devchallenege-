"use client";

import { useDashboard } from "@/context/dashboard-context";
import { statusLabel } from "@/lib/data/labels";
import { getAsset, getPort, reviewQueue } from "@/lib/data/selectors";
import { Badge, Panel, PriorityPill } from "./ui";

export function ReviewQueue() {
  const { role, filters } = useDashboard();
  const items = reviewQueue(filters);
  const mayAct = role === "port_engineer" || role === "inspection_team";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Review queue
        </h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          Needs-review observations only (OBS- IDs). Inspector-confirmed defects
          (DEF-) are excluded — e.g. DEF-1004 stays in the register/audit, not
          here.
        </p>
      </div>

      {!mayAct ? (
        <p className="rounded-md border border-amber-700/40 bg-amber-950/40 px-3 py-2 text-xs text-amber-100">
          Confirm / Reject hidden for role <strong>{role.replaceAll("_", " ")}</strong>.
        </p>
      ) : null}

      <div className="space-y-3">
        {items.map((f) => (
          <Panel
            key={f.id}
            title={getAsset(f.assetId)?.name ?? f.assetId}
            subtitle={`${getPort(f.portId)?.name} · ${f.displayId}`}
            action={<PriorityPill band={f.priorityBand} />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[var(--dash-border)] bg-[#0a1018] text-xs text-[var(--dash-muted)] md:col-span-1">
                Evidence frame · {f.panelId}
              </div>
              <div className="space-y-2 text-sm md:col-span-2">
                <p>{f.modelSuggestion}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="warn">sev {f.severity}</Badge>
                  <Badge>conf {f.confidence.toFixed(2)}</Badge>
                  <Badge>DQ {f.dataQualityScore.toFixed(2)}</Badge>
                  <Badge>{statusLabel(f.status)}</Badge>
                  <Badge tone={f.verifyFlag ? "watch" : "neutral"}>
                    {f.verifyFlag
                      ? `verify — ${f.verifyTrigger}`
                      : "verify no"}
                  </Badge>
                  <Badge>{f.daysInQueue}d waiting</Badge>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {mayAct ? (
                    <>
                      <button
                        type="button"
                        className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Confirm → DEF-
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-[var(--dash-border)] px-3 py-1.5 text-xs"
                      >
                        Reject → retrain store
                      </button>
                    </>
                  ) : null}
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
          <p className="text-sm text-[var(--dash-muted)]">
            Queue empty for filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
