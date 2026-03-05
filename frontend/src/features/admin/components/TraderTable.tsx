import { useNavigate } from "react-router-dom";
import { Badge, Spinner } from "@/components/ui";
import { formatDateTime, formatBusinessType } from "@/lib/utils";
import type { Trader } from "../hooks/useTraders";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-cu-border bg-white text-sm text-cu-muted">
      <span>
        Showing <strong className="text-cu-text">{from}–{to}</strong> of{" "}
        <strong className="text-cu-text">{total.toLocaleString()}</strong> traders
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="px-2 py-1 rounded border border-cu-border disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >«</button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 rounded border border-cu-border disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >‹</button>
        <span className="px-3 py-1 rounded border border-cu-red bg-cu-red text-white text-xs font-semibold">
          {page}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2 py-1 rounded border border-cu-border disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >›</button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="px-2 py-1 rounded border border-cu-border disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >»</button>
      </div>
    </div>
  );
}

interface TraderTableProps {
  traders: Trader[];
  total: number;
  page: number;
  totalPages: number;
  pageSize?: number;
  isLoading: boolean;
  onPageChange: (p: number) => void;
}

export default function TraderTable({
  traders,
  total,
  page,
  totalPages,
  pageSize = 20,
  isLoading,
  onPageChange,
}: TraderTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-cu-border rounded-lg overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b border-cu-border bg-gray-50">
              {["TIN", "Name", "Phone", "Business Type", "Region", "Channel", "Registered At", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-cu-muted uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cu-border">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-cu-muted">
                    <Spinner size="lg" />
                    <span className="text-sm">Loading traders…</span>
                  </div>
                </td>
              </tr>
            ) : traders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-cu-muted text-sm">
                  No traders match your filters.
                </td>
              </tr>
            ) : (
              traders.map((t) => (
                <tr
                  key={t.trader_id}
                  className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/traders/${t.trader_id}`)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-cu-red whitespace-nowrap">
                    {t.tin_number}
                  </td>
                  <td className="px-4 py-3 text-cu-text font-medium whitespace-nowrap">{t.name}</td>
                  <td className="px-4 py-3 text-cu-muted whitespace-nowrap">{t.phone_number}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatBusinessType(t.business_type)}</td>
                  <td className="px-4 py-3 text-cu-muted whitespace-nowrap">{t.region}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={t.channel === "web" ? "web" : "ussd"}>
                      {t.channel.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-cu-muted text-xs whitespace-nowrap">
                    {formatDateTime(t.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/traders/${t.trader_id}`);
                      }}
                      className="text-xs font-medium text-cu-red hover:underline whitespace-nowrap"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && traders.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
