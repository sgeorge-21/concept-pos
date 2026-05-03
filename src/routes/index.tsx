import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/pos/Shell";
import { weeklySales, recentTransactions, products, outlets } from "@/lib/pos-data";
import { ArrowUpRight, TrendingUp, ShoppingCart, AlertTriangle, DollarSign, Plus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/")({
  component: Overview,
  head: () => ({
    meta: [
      { title: "SmartPOS — Operator Dashboard" },
      { name: "description", content: "Real-time sales, inventory and outlet performance for SmartPOS." },
    ],
  }),
});

function Stat({ label, value, delta, icon: Icon, tone = "default" }: { label: string; value: string; delta?: string; icon: any; tone?: "default" | "warn" | "good" }) {
  const toneClass = tone === "warn" ? "text-warning" : tone === "good" ? "text-success" : "text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${toneClass}`} />
      </div>
      <div className="mt-3 text-3xl font-display font-bold">{value}</div>
      {delta && <div className={`mt-1 text-xs ${toneClass} flex items-center gap-1`}><ArrowUpRight className="h-3 w-3" />{delta}</div>}
    </div>
  );
}

function Overview() {
  const lowStock = products.filter((p) => p.stock <= p.lowStockAt);
  const totalRevenue = weeklySales.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = weeklySales.reduce((s, d) => s + d.orders, 0);

  return (
    <Shell
      title="Today at a glance"
      subtitle="Live signal across every register, shelf and outlet."
      actions={
        <Link to="/pos" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition" style={{ boxShadow: "var(--shadow-glow)" }}>
          <Plus className="h-4 w-4" /> Open Terminal
        </Link>
      }
    >
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue · 7d" value={`$${totalRevenue.toLocaleString()}`} delta="+12.4% vs last week" icon={DollarSign} tone="good" />
        <Stat label="Orders · 7d" value={totalOrders.toString()} delta="+8.1%" icon={ShoppingCart} tone="good" />
        <Stat label="Avg Basket" value={`$${(totalRevenue / totalOrders).toFixed(2)}`} delta="+$1.20" icon={TrendingUp} />
        <Stat label="Low Stock" value={lowStock.length.toString()} delta={`${lowStock.length} need reorder`} icon={AlertTriangle} tone="warn" />
      </div>

      <div className="grid gap-4 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold">Revenue trend</h2>
              <p className="text-xs text-muted-foreground">Past 7 days · all outlets</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySales}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.88 0.21 130)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.88 0.21 130)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.28 0.012 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="oklch(0.68 0.02 250)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.012 250)", border: "1px solid oklch(0.28 0.012 250)", borderRadius: 12 }} labelStyle={{ color: "oklch(0.97 0.005 250)" }} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.88 0.21 130)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-display text-xl font-bold mb-1">Outlets</h2>
          <p className="text-xs text-muted-foreground mb-4">Live status</p>
          <div className="space-y-3">
            {outlets.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
                <div>
                  <div className="font-medium text-sm">{o.name}</div>
                  <div className="text-xs text-muted-foreground">{o.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold">${(o.revenue / 1000).toFixed(1)}k</div>
                  <div className={`text-[10px] uppercase tracking-wider ${o.status === "Open" ? "text-success" : "text-muted-foreground"}`}>{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 mt-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-display text-xl font-bold mb-4">Recent transactions</h2>
          <div className="space-y-2">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-mono text-xs">{t.method[0]}</div>
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{t.id} · {t.time}</div>
                    <div className="text-sm">{t.items} items · {t.cashier}</div>
                  </div>
                </div>
                <div className="font-display font-bold">${t.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-warning/40 bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /> Low stock alerts</h2>
          <p className="text-xs text-muted-foreground mb-4">Reorder before stockout</p>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{p.emoji}</div>
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-warning">{p.stock}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">in stock</div>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && <div className="text-sm text-muted-foreground">All items healthy ✓</div>}
          </div>
        </div>
      </div>
    </Shell>
  );
}
