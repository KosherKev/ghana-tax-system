/**
 * PublicLayout — wraps all trader-facing pages with Header + Footer.
 * Full implementation in Phase 8.
 */
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cu-bg">
      <header className="bg-cu-red text-white px-6 py-3 text-sm font-semibold tracking-wide">
        DISTRICT ASSEMBLY – REVENUE UNIT
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-cu-border px-6 py-4 text-xs text-cu-muted text-center">
        © {new Date().getFullYear()} District Assembly Revenue Unit. All rights reserved.
      </footer>
    </div>
  );
}
