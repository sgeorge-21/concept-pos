import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/pos/Shell";
import { products } from "@/lib/pos-data";
import { AlertTriangle, Package2, TrendingDown, Truck } from "lucide-react";

export const Route = createFileRoute("/inventory")({
  component: Inventory,
  head: () => ({ meta: [{ title: "Inventory · SmartPOS" }, { name: "description", content: "Real-time stock levels, low-stock alerts and supplier orders." }] }),
});

function Inventory() {
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const low = products.filter((p) => p.stock <= p.lowStockAt);

  return (
    <Shell title="Inventory" subtitle="Stock health across the floor and the back-of-house.">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: "Units on hand", value: totalUnits.toLocaleString(), icon: Package2, tone: "text-primary" },
          { label: "Inventory value", value: `$${totalValue.toFixed(0)}`, icon: TrendingDown, tone: "text-success" },
          { label: "Low stock SKUs", value: low.length.toString(), icon: AlertTriangle, tone: "text-warning" },
          { label: "Open POs", value: "3", icon: Truck, tone: "text-accent" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <Icon className={`h-4 w-4 ${s.tone}`} />
              </div>
              <div className="mt-3 text-3xl font-display font-bold">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Stock ledger</h2>
          <span className="text-xs text-muted-foreground">{products.length} SKUs</span>
        </div>
        <div className="divide-y divide-border">
          {products.map((p) => {
            const ratio = Math.min(100, (p.stock / (p.lowStockAt * 4)) * 100);
            const critical = p.stock <= p.lowStockAt;
            return (
              <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                <div className="text-2xl">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{p.sku} · {p.category}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-display font-bold ${critical ? "text-warning" : ""}`}>{p.stock} units</div>
                      <div className="text-xs text-muted-foreground">reorder at {p.lowStockAt}</div>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${ratio}%`, background: critical ? "oklch(0.82 0.16 75)" : "var(--gradient-primary)" }} />
                  </div>
                </div>
                {critical && (
                  <button className="px-3 py-1.5 rounded-lg bg-warning/15 text-warning text-xs font-medium hover:bg-warning/25 transition">Reorder</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
