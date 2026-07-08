"use client";

import { cartTotals, formatMoney } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import type { LastOrder } from "@/types/checkout";

export function OrderSummary({
  order,
  compact = false,
}: {
  order?: LastOrder | null;
  compact?: boolean;
}) {
  const lines = useCartStore((s) => s.lines);
  const totals = order
    ? {
        subtotalCents: order.subtotalCents,
        taxCents: order.taxCents,
        totalCents: order.totalCents,
        itemCount: order.items.reduce((n, i) => n + i.quantity, 0),
      }
    : cartTotals(lines);

  const items = order
    ? order.items
    : lines.map((line) => ({
        lineId: line.lineId,
        name: line.name,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
      }));

  return (
    <aside
      className={
        compact
          ? "space-y-3 text-sm"
          : "space-y-4 rounded-sm border border-border bg-card p-6"
      }
    >
      {!compact ? <h2 className="font-display text-2xl">Order summary</h2> : null}
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.lineId} className="flex justify-between gap-4">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="tabular-nums">
              {formatMoney(item.unitPriceCents * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(totals.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax estimate</dt>
          <dd className="tabular-nums">{formatMoney(totals.taxCents)}</dd>
        </div>
        <div className="flex justify-between font-medium">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(totals.totalCents)}</dd>
        </div>
      </dl>
    </aside>
  );
}
