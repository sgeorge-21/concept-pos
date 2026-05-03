import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/pos/Shell";
import { outlets } from "@/lib/pos-data";
import { MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/outlets")({
  component: Outlets,
  head: () => ({ meta: [{ title: "Outlets · SmartPOS" }, { name: "description", content: "Manage and compare every store location from one dashboard." }] }),
});

function Outlets() {
  return (
    <Shell
      title="Outlets"
      subtitle="One brand, many doors."
      actions={
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition" style={{ boxShadow: "var(--shadow-glow)" }}>
          <Plus className="h-4 w-4" /> Add outlet
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {outlets.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="h-28 relative" style={{ background: "var(--gradient-primary)" }}>
              <div className="absolute inset-0 flex items-end p-5">
                <MapPin className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${o.status === "Open" ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}>{o.status}</span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl font-bold">{o.name}</h3>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Revenue</div>
                  <div className="font-display font-bold text-lg text-primary">${o.revenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Orders</div>
                  <div className="font-display font-bold text-lg">{o.orders}</div>
                </div>
              </div>
              <button className="w-full mt-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/70 transition">Open dashboard</button>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
