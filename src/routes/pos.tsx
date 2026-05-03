import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/pos/Shell";
import { products, categories, type Product } from "@/lib/pos-data";
import { useMemo, useRef, useState } from "react";
import { Search, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Receipt as ReceiptIcon, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Receipt, type ReceiptData } from "@/components/pos/Receipt";


export const Route = createFileRoute("/pos")({
  component: Terminal,
  head: () => ({ meta: [{ title: "Terminal · SmartPOS" }, { name: "description", content: "Cashier terminal for fast checkout." }] }),
});

type CartItem = Product & { qty: number };

function Terminal() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<"Cash" | "Card" | "Mobile">("Card");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const printReceipt = () => window.print();


  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
      const matchC = cat === "All" || p.category === cat;
      return matchQ && matchC;
    });
  }, [query, cat]);

  const add = (p: Product) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === p.id);
      if (ex) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...p, qty: 1 }];
    });
  };
  const setQty = (id: string, d: number) => {
    setCart((c) => c.flatMap((i) => (i.id === id ? (i.qty + d <= 0 ? [] : [{ ...i, qty: i.qty + d }]) : [i])));
  };
  const remove = (id: string) => setCart((c) => c.filter((i) => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const checkout = () => {
    if (!cart.length) return toast.error("Cart is empty");
    const id = `TX-${Math.floor(Math.random() * 90000 + 10000)}`;
    const data: ReceiptData = {
      id,
      time: new Date().toLocaleString(),
      items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      subtotal,
      tax,
      total,
      method,
      cashier: "Amelia",
    };
    setReceipt(data);
    toast.success(`Sale completed · $${total.toFixed(2)} via ${method}`, { description: `Receipt ${id} ready to print.` });
    setCart([]);
  };


  return (
    <Shell title="Terminal" subtitle="Scan, tap, charge.">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* Catalog */}
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Scan barcode or search…"
                className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition",
                  cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => add(p)}
                className="group text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/60 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="text-4xl mb-2">{p.emoji}</div>
                <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>
                <div className="font-medium text-sm mt-1 leading-tight">{p.name}</div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-display font-bold text-primary">${p.price.toFixed(2)}</span>
                  <span className={cn("text-[10px] uppercase tracking-wider", p.stock <= p.lowStockAt ? "text-warning" : "text-muted-foreground")}>{p.stock} left</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <aside className="rounded-2xl border border-border bg-card flex flex-col" style={{ boxShadow: "var(--shadow-card)", maxHeight: "calc(100vh - 180px)" }}>
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Order #{Math.floor(Math.random() * 900 + 100)}</h2>
              <p className="text-xs text-muted-foreground">{cart.length} line{cart.length !== 1 && "s"}</p>
            </div>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-muted-foreground hover:text-destructive">Clear</button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 min-h-40">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <ReceiptIcon className="h-10 w-10 mb-3 opacity-50" />
                <div className="text-sm">Tap a product to start an order.</div>
              </div>
            ) : (
              cart.map((i) => (
                <div key={i.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40">
                  <div className="text-2xl">{i.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{i.name}</div>
                    <div className="text-xs text-muted-foreground">${i.price.toFixed(2)} ea</div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-secondary rounded-lg p-1">
                    <button onClick={() => setQty(i.id, -1)} className="h-6 w-6 rounded hover:bg-background flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm font-medium">{i.qty}</span>
                    <button onClick={() => setQty(i.id, 1)} className="h-6 w-6 rounded hover:bg-background flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="w-16 text-right font-display font-bold text-sm">${(i.price * i.qty).toFixed(2)}</div>
                  <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-border space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-2xl font-display font-bold pt-2 border-t border-border"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {([
                { k: "Cash", icon: Banknote },
                { k: "Card", icon: CreditCard },
                { k: "Mobile", icon: Smartphone },
              ] as const).map(({ k, icon: Icon }) => (
                <button
                  key={k}
                  onClick={() => setMethod(k)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 rounded-lg border text-xs font-medium transition",
                    method === k ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {k}
                </button>
              ))}
            </div>

            <button
              onClick={checkout}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-base hover:opacity-90 transition"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              Charge ${total.toFixed(2)}
            </button>
          </div>
        </aside>
      </div>

      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 print:bg-transparent print:p-0 print:block">
          <div className="relative bg-card border border-border rounded-2xl p-6 max-w-md w-full print:border-0 print:p-0 print:bg-transparent print:max-w-none" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-4 print:hidden">
              <h3 className="font-display text-xl font-bold">Receipt</h3>
              <button onClick={() => setReceipt(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto rounded-lg print:max-h-none print:overflow-visible">
              <Receipt ref={receiptRef} data={receipt} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 print:hidden">
              <button
                onClick={() => setReceipt(null)}
                className="py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary"
              >
                Close
              </button>
              <button
                onClick={printReceipt}
                className="py-3 rounded-xl bg-primary text-primary-foreground text-sm font-display font-bold flex items-center justify-center gap-2 hover:opacity-90"
              >
                <Printer className="h-4 w-4" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>

  );
}
