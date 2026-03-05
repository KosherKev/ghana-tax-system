import { useState } from "react";
import { Spinner } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { AuditLog } from "../hooks/useReports";

const ACTION_COLORS: Record<string, string> = {
  LOGIN_SUCCESS:        "text-green-700 bg-green-50 border-green-200",
  LOGIN_FAIL:           "text-red-700 bg-red-50 border-red-200",
  CREATE_TRADER:        "text-blue-700 bg-blue-50 border-blue-200",
  USSD_REG_COMPLETE:    "text-purple-700 bg-purple-50 border-purple-200",
  EXPORT_REPORT:        "text-orange-700 bg-orange-50 border-orange-200",
  CREATE_ADMIN:         "text-cu-red bg-cu-red/5 border-cu-red/20",
  ROLE_CHANGE:          "text-yellow-700 bg-yellow-50 border-yellow-200",
};

function ActionBadge({ action }: { action: string }) {
  const cls = ACTION_COLORS[action] ?? "text-cu-muted bg-gray-50 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-semibold ${cls}`}>
      {action}
    </span>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
}

function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-cu-border bg-white text-sm text-cu-muted">
      <span><strong className="text-cu-text">{total.toLocaleString()}</strong> total entries</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="px-2 py-1 rounded border border-cu-border disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed">‹</button>
        <span className="px-3 py-1 rounded border border-cu-red bg-cu-red text-white text-xs font-semibold">{page}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className="px-2 py-1 rounded border border-cu-border disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed">›</button>
      </div>
    </div>
  );
}

interface AuditTableProps {
  logs: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (p: number) => void;
}

export default function AuditTable({ logs, total, page, totalPages, isLoading, onPageChange }: AuditTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-white border border-cu-border rounded-lg overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b border-cu-border bg-gray-50">
              {["Timestamp", "Actor", "Role", "Action", "Entity", "Channel", "IP Address"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-cu-muted uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cu-border">
            {isLoading ? (
              <tr><td colSpan={7} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-cu-muted">
                  <Spinner size="lg" /><span className="text-sm">Loading logs…</span>
                </div>
              </td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={7} className="py-16 text-center text-cu-muted text-sm">
                No audit log entries found.
              </td></tr>
            ) : (
              logs.map((log) => (
                <>
                  <tr
                    key={log.log_id}
                    className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === log.log_id ? null : log.log_id)}
                  >
                    <td className="px-4 py-3 text-xs text-cu-muted whitespace-nowrap font-mono">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="px-4 py-3 text-xs text-cu-text font-mono whitespace-nowrap">
                      {log.actor_id?.slice(0, 12) ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-cu-muted whitespace-nowrap">{log.actor_role ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><ActionBadge action={log.action} /></td>
                    <td className="px-4 py-3 text-xs text-cu-muted font-mono whitespace-nowrap">
                      {log.entity_id?.slice(0, 12) ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-cu-muted whitespace-nowrap">{log.channel ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-cu-muted font-mono whitespace-nowrap">
                      {log.ip_address ?? "—"}
                    </td>
                  </tr>
                  {expandedId === log.log_id && log.meta && (
                    <tr key={`${log.log_id}-detail`} className="bg-gray-950">
                      <td colSpan={7} className="px-6 py-3">
                        <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && logs.length > 0 && (
        <Pagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
      )}
    </div>
  );
}
