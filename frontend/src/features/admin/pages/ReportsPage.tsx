import { Card, Button, Alert } from "@/components/ui";
import ReportSummary from "../components/ReportSummary";
import { useReportSummary, useExportCsv } from "../hooks/useReports";
import type { Period } from "../hooks/useReports";

const PERIOD_LABELS: Record<Period, string> = { "7d": "7 Days", "30d": "30 Days", "all": "All Time" };

export default function ReportsPage() {
  const { data, isLoading, error, period, setPeriod, refetch } = useReportSummary();
  const { exportCsv, isExporting } = useExportCsv();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-cu-text">Reports</h1>
          <p className="text-sm text-cu-muted mt-0.5">Registration summary and data export</p>
        </div>
        <Button
          variant="primary"
          size="md"
          isLoading={isExporting}
          onClick={() => exportCsv({ period })}
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Export CSV
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Period + Refresh controls */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-cu-muted">Period:</span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(["7d", "30d", "all"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    period === p ? "bg-cu-red text-white shadow-sm" : "text-cu-muted hover:text-cu-text"
                  }`}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={refetch}
            className="text-xs font-medium text-cu-muted hover:text-cu-red transition-colors flex items-center gap-1"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </Card>

      {/* Summary tables */}
      <ReportSummary data={data} isLoading={isLoading} />
    </div>
  );
}
