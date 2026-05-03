import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ScanBarcode, Package, Boxes, BarChart3, Store, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/pos", label: "Terminal", icon: ScanBarcode },
  { to: "/products", label: "Products", icon: Package },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/outlets", label: "Outlets", icon: Store },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border p-4">
      <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-6">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold text-sidebar-foreground tracking-tight">SmartPOS</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Operator</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl p-4 border border-sidebar-border bg-sidebar-accent/40">
        <div className="text-xs text-muted-foreground">Signed in as</div>
        <div className="font-medium text-sidebar-foreground">Amelia Hart</div>
        <div className="text-xs text-primary mt-1">Manager · Downtown</div>
      </div>
    </aside>
  );
}
