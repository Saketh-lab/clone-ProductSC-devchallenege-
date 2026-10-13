"use client";

import { useDashboard } from "@/context/dashboard-context";
import { PORTS } from "@/lib/data/store";
import type { AssetClass, ObservationStatus, Severity } from "@/lib/data/types";

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useDashboard();

  return (
    <div className="border-b border-[var(--dash-border)] bg-[var(--dash-bg)] px-4 py-3 md:px-6">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--dash-muted)]">
          Filters carry across screens
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs text-teal-300 hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8">
        <Select
          label="Port"
          value={filters.portId}
          onChange={(v) => setFilters({ portId: v as typeof filters.portId })}
          options={[
            { value: "all", label: "All ports" },
            ...PORTS.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <Select
          label="Berth"
          value={filters.berth}
          onChange={(v) => setFilters({ berth: v })}
          options={[
            { value: "all", label: "All berths" },
            { value: "B1", label: "B1" },
            { value: "B2", label: "B2" },
            { value: "A3", label: "A3" },
            { value: "C2", label: "C2" },
            { value: "D1", label: "D1" },
            { value: "E4", label: "E4" },
            { value: "F1", label: "F1" },
            { value: "G2", label: "G2" },
            { value: "H1", label: "H1" },
            { value: "J1", label: "J1" },
          ]}
        />
        <Select
          label="Asset class"
          value={filters.assetClass}
          onChange={(v) =>
            setFilters({ assetClass: v as AssetClass | "all" })
          }
          options={[
            { value: "all", label: "All classes" },
            { value: "quay_wall", label: "Quay wall" },
            { value: "fender", label: "Fender" },
            { value: "bollard", label: "Bollard" },
            { value: "pile", label: "Pile" },
            { value: "slab", label: "Slab" },
            { value: "crane_rail", label: "Crane rail" },
          ]}
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={(v) =>
            setFilters({ status: v as ObservationStatus | "all" })
          }
          options={[
            { value: "all", label: "All statuses" },
            { value: "open", label: "Open" },
            { value: "awaiting_review", label: "Awaiting review" },
            { value: "confirmed", label: "Confirmed" },
            { value: "rejected", label: "Rejected" },
            { value: "work_order_raised", label: "Work order" },
            { value: "closed", label: "Closed" },
          ]}
        />
        <Select
          label="Severity"
          value={String(filters.severity)}
          onChange={(v) =>
            setFilters({
              severity: v === "all" ? "all" : (Number(v) as Severity),
            })
          }
          options={[
            { value: "all", label: "All sev." },
            { value: "5", label: "5" },
            { value: "4", label: "4" },
            { value: "3", label: "3" },
            { value: "2", label: "2" },
            { value: "1", label: "1" },
          ]}
        />
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
          Conf. ≥ {filters.confidenceMin.toFixed(1)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={filters.confidenceMin}
            onChange={(e) =>
              setFilters({ confidenceMin: Number(e.target.value) })
            }
            className="mt-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
          From
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ dateFrom: e.target.value })}
            className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] px-2 py-1.5 text-xs text-[var(--dash-fg)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
          To
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ dateTo: e.target.value })}
            className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] px-2 py-1.5 text-xs text-[var(--dash-fg)]"
          />
        </label>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-[var(--dash-muted)]">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] px-2 py-1.5 text-xs text-[var(--dash-fg)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
