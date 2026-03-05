import clsx from "clsx";

export interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: number; // positive = up, negative = down, 0 = neutral
  trendLabel?: string;
  isLoading?: boolean;
  accent?: "red" | "blue" | "green" | "purple";
}

const accentClasses = {
  red:    "bg-cu-red/10 text-cu-red",
  blue:   "bg-blue-100 text-blue-700",
  green:  "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
};

export default function StatsCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  isLoading = false,
  accent = "red",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-cu-border shadow-card p-5 flex items-start gap-4">
      {icon && (
        <div className={clsx("h-11 w-11 rounded-lg flex items-center justify-center shrink-0", accentClasses[accent])}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-cu-muted uppercase tracking-wide">{label}</p>
        {isLoading ? (
          <div className="mt-1 h-8 w-24 rounded bg-gray-100 animate-pulse" />
        ) : (
          <p className="mt-1 text-3xl font-bold text-cu-text tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        )}
        {trend !== undefined && !isLoading && (
          <div className="mt-1 flex items-center gap-1 text-xs font-medium">
            {trend > 0 ? (
              <>
                <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-green-700">+{trend}%</span>
              </>
            ) : trend < 0 ? (
              <>
                <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span className="text-red-600">{trend}%</span>
              </>
            ) : (
              <span className="text-cu-muted">—</span>
            )}
            {trendLabel && <span className="text-cu-muted">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
