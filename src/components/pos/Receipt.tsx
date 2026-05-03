import { forwardRef } from "react";

export type ReceiptData = {
  id: string;
  time: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
  method: string;
  cashier?: string;
};

export const Receipt = forwardRef<HTMLDivElement, { data: ReceiptData }>(({ data }, ref) => {
  return (
    <div ref={ref} className="receipt-print">
      <div className="receipt-inner">
        <div className="receipt-header">
          <div className="receipt-brand">SmartPOS</div>
          <div className="receipt-meta">123 Market Street · Downtown Flagship</div>
          <div className="receipt-meta">Tel (555) 010-2840</div>
        </div>
        <div className="receipt-divider" />
        <div className="receipt-row receipt-meta">
          <span>Receipt</span>
          <span>{data.id}</span>
        </div>
        <div className="receipt-row receipt-meta">
          <span>{data.time}</span>
          <span>Cashier: {data.cashier ?? "—"}</span>
        </div>
        <div className="receipt-divider" />
        {data.items.map((it, i) => (
          <div key={i} className="receipt-line">
            <div className="receipt-row">
              <span className="receipt-name">{it.name}</span>
              <span>${(it.price * it.qty).toFixed(2)}</span>
            </div>
            <div className="receipt-meta">
              {it.qty} × ${it.price.toFixed(2)}
            </div>
          </div>
        ))}
        <div className="receipt-divider" />
        <div className="receipt-row"><span>Subtotal</span><span>${data.subtotal.toFixed(2)}</span></div>
        <div className="receipt-row"><span>Tax</span><span>${data.tax.toFixed(2)}</span></div>
        <div className="receipt-row receipt-total"><span>TOTAL</span><span>${data.total.toFixed(2)}</span></div>
        <div className="receipt-divider" />
        <div className="receipt-row"><span>Paid by</span><span>{data.method}</span></div>
        <div className="receipt-divider" />
        <div className="receipt-footer">
          Thank you for shopping with us!
          <br />
          smartpos.app
        </div>
      </div>
    </div>
  );
});
Receipt.displayName = "Receipt";
