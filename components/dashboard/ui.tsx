import { cn } from "@/lib/utils";
import type { PriorityBand } from "@/lib/data/types";
import { priorityColor } from "@/lib/data/selectors";

export function Panel({
  title,
  subtitle,
  children,
  className,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--dash-border)] px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-[var(--dash-muted)]">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--dash-muted)]">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[11px] text-[var(--dash-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function PriorityPill({ band }: { band: PriorityBand }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white",
        priorityColor(band)
      )}
    >
      {band}
    </span>
  );
}

export function TrendArrow({
  direction,
}: {
  direction: "up" | "down" | "flat";
}) {
  const map = {
    up: { symbol: "↑", className: "text-emerald-400" },
    down: { symbol: "↓", className: "text-rose-400" },
    flat: { symbol: "→", className: "text-[var(--dash-muted)]" },
  } as const;
  const t = map[direction];
  return <span className={cn("font-semibold", t.className)}>{t.symbol}</span>;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "pass" | "watch" | "fail" | "warn";
}) {
  const tones = {
    neutral: "bg-white/10 text-[var(--dash-fg)]",
    pass: "bg-emerald-500/20 text-emerald-300",
    watch: "bg-amber-500/20 text-amber-200",
    fail: "bg-rose-500/20 text-rose-300",
    warn: "bg-orange-500/20 text-orange-200",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
