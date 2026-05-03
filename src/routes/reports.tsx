import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/pos/Shell";
import { weeklySales, products } from "@/lib/pos-data";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports · SmartPOS" }, { name: "description", content: "Sales, profit and category analytics with exports." }] }),
});

const categoryColors = ["oklch(0.88 0.21 130)", "oklch(0.70 0.18 320)", "oklch(0.75 0.18 155)", "oklch(0.82 0.16 75)", "oklch(0.65 0.22 25)", "oklch(0.78 0.16 220)"];

function Reports() {
  const byCat = Array.from(
    products.reduce((m, p) => {
      m.set(p.category, (m.get(p.category) || 0) + p.price * (50 - p.stock / 4));
      return m;
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value: Math.max(50, Math.round(value)) }));

  const top = [...products].sort((a, b) => b.price * b.stock - a.price * a.stock).slice(0, 6).map((p) => ({ name: p.name.split(" ").slice(0, 2).join(" "), units: Math.round(p.stock * 0.8 + 20) }));

  const revenue = weeklySales.reduce((s, d) => s + d.revenue, 0);
  const cost = revenue * 0.42;

  return (
    <Shell
      title="Reports"
      subtitle="Profit, mix and momentum."
      actions={
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/70 transition">
          <Download className="h-4 w-4" /> Export PDF
        </button>
      }
    >
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { l: "Revenue", v: `$${revenue.toLocaleString()}` },
          { l: "Cost of goods", v: `$${cost.toFixed(0)}` },
          { l: "Gross profit", v: `$${(revenue - cost).toFixed(0)}`, hl: true },
          { l: "Margin", v: `${(((revenue - cost) / revenue) * 100).toFixed(1)}%` },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            <div className={`mt-3 text-3xl font-display font-bold ${s.hl ? "text-primary" : ""}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-display text-xl font-bold mb-4">Best-selling items</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top}>
                <CartesianGrid stroke="oklch(0.28 0.012 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="oklch(0.68 0.02 250)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.012 250)", border: "1px solid oklch(0.28 0.012 250)", borderRadius: 12 }} />
                <Bar dataKey="units" fill="oklch(0.88 0.21 130)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-display text-xl font-bold mb-4">Category mix</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCat} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3} stroke="oklch(0.18 0.012 250)" strokeWidth={2}>
                  {byCat.map((_, i) => <Cell key={i} fill={categoryColors[i % categoryColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.18 0.012 250)", border: "1px solid oklch(0.28 0.012 250)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {byCat.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: categoryColors[i % categoryColors.length] }} />
                <span className="flex-1 text-muted-foreground">{c.name}</span>
                <span className="font-medium">${c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
