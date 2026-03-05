/**
 * AdminLayout — wraps all protected admin pages with Sidebar + Header.
 * Full implementation in Phase 8.
 */
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-cu-bg">
      <aside className="w-64 bg-white border-r border-cu-border flex-shrink-0">
        <div className="px-6 py-4 bg-cu-red text-white font-bold text-sm tracking-wide">
          DA REVENUE SYSTEM
        </div>
        <nav className="p-4 text-cu-muted text-sm">
          <p className="italic">Sidebar — Phase 8</p>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-cu-border px-6 py-3 text-sm font-semibold text-cu-text">
          DISTRICT ASSEMBLY – REVENUE UNIT
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
