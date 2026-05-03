import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/pos/Shell";
import { products, categories } from "@/lib/pos-data";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products")({
  component: Products,
  head: () => ({ meta: [{ title: "Products · SmartPOS" }, { name: "description", content: "Manage your product catalog, pricing and categories." }] }),
});

function Products() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = products.filter((p) => (cat === "All" || p.category === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <Shell
      title="Catalog"
      subtitle={`${products.length} products across ${categories.length} categories`}
      actions={
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition" style={{ boxShadow: "var(--shadow-glow)" }}>
          <Plus className="h-4 w-4" /> New product
        </button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or SKU…" className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["All", ...categories].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap", cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")}>{c}</button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">SKU</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-right px-5 py-3">Cost</th>
              <th className="text-right px-5 py-3">Price</th>
              <th className="text-right px-5 py-3">Margin</th>
              <th className="text-right px-5 py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const margin = ((p.price - p.cost) / p.price) * 100;
              return (
                <tr key={p.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{p.emoji}</div>
                      <div className="font-medium">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-md bg-secondary text-xs">{p.category}</span></td>
                  <td className="px-5 py-3 text-right text-muted-foreground">${p.cost.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right font-medium">${p.price.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-success font-medium">{margin.toFixed(0)}%</td>
                  <td className={cn("px-5 py-3 text-right font-display font-bold", p.stock <= p.lowStockAt ? "text-warning" : "")}>{p.stock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
