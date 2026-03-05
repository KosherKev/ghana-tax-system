import { Alert } from "@/components/ui";
import AuditTable from "../components/AuditTable";
import { useAuditLogs } from "../hooks/useReports";

const ACTION_OPTIONS = [
  "LOGIN_SUCCESS", "LOGIN_FAIL", "CREATE_TRADER", "USSD_REG_COMPLETE",
  "EXPORT_REPORT", "CREATE_ADMIN", "ROLE_CHANGE", "STATUS_CHANGE",
];

export default function AuditLogsPage() {
  const { logs, total, page, totalPages, isLoading, error, filters, setFilters } = useAuditLogs();

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-cu-text">Audit Logs</h1>
        <p className="text-sm text-cu-muted mt-0.5">
          {isLoading ? "Loading…" : `${total.toLocaleString()} audit log entr${total !== 1 ? "ies" : "y"}`}
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Filter bar */}
      <div className="bg-white border border-cu-border rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action filter */}
          <div>
            <label className="block text-xs font-semibold text-cu-muted mb-1">Action</label>
            <select
              value={filters.action ?? ""}
              onChange={(e) => setFilters({ action: e.target.value || undefined })}
              className="w-full px-3 py-2 rounded-md border border-cu-border text-sm text-cu-text focus:outline-none focus:ring-2 focus:ring-cu-red"
            >
              <option value="">All Actions</option>
              {ACTION_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Actor ID */}
          <div>
            <label className="block text-xs font-semibold text-cu-muted mb-1">Actor ID</label>
            <input
              type="text"
              placeholder="Admin ID…"
              defaultValue={filters.actor_id ?? ""}
              onChange={(e) => setFilters({ actor_id: e.target.value || undefined })}
              className="w-full px-3 py-2 rounded-md border border-cu-border text-sm text-cu-text placeholder:text-cu-muted focus:outline-none focus:ring-2 focus:ring-cu-red"
            />
          </div>

          {/* Date from */}
          <div>
            <label className="block text-xs font-semibold text-cu-muted mb-1">From Date</label>
            <input
              type="date"
              value={filters.date_from ?? ""}
              onChange={(e) => setFilters({ date_from: e.target.value || undefined })}
              className="w-full px-3 py-2 rounded-md border border-cu-border text-sm text-cu-text focus:outline-none focus:ring-2 focus:ring-cu-red"
            />
          </div>

          {/* Date to */}
          <div>
            <label className="block text-xs font-semibold text-cu-muted mb-1">To Date</label>
            <input
              type="date"
              value={filters.date_to ?? ""}
              onChange={(e) => setFilters({ date_to: e.target.value || undefined })}
              className="w-full px-3 py-2 rounded-md border border-cu-border text-sm text-cu-text focus:outline-none focus:ring-2 focus:ring-cu-red"
            />
          </div>
        </div>
      </div>

      {/* Hint text */}
      <p className="text-xs text-cu-muted">
        Click any row to expand and view metadata (before/after state) if available.
      </p>

      {/* Table */}
      <AuditTable
        logs={logs}
        total={total}
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={(p) => setFilters({ page: p })}
      />
    </div>
  );
}
