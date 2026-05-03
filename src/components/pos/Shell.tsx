import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Shell({ children, title, subtitle, actions }: { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar variant="drawer" onNavigate={() => setOpen(false)} />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-40">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="h-10 w-10 rounded-lg border border-border flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold tracking-tight">SmartPOS</span>
          </Link>
          <div className="w-10" />
        </div>

        <header className="border-b border-border px-4 sm:px-6 md:px-10 py-5 md:py-6 flex items-end justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1 text-xs sm:text-sm">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        </header>
        <div className="flex-1 p-4 sm:p-6 md:p-10">{children}</div>
      </main>
      <Toaster theme="dark" position="top-right" richColors />
    </div>
  );
}
