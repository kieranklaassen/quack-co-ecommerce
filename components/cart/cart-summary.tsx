"use client";

import Link from "next/link";
import { cartTotals, formatMoney } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";

export function CartSummary() {
  const lines = useCartStore((s) => s.lines);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  if (!hasHydrated || lines.length === 0) return null;

  const totals = cartTotals(lines);

  return (
    <aside className="space-y-4 rounded-sm border border-border bg-card p-6">
      <h2 className="font-display text-2xl">Summary</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(totals.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax estimate (8%)</dt>
          <dd className="tabular-nums">{formatMoney(totals.taxCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(totals.totalCents)}</dd>
        </div>
      </dl>
      <Link href="/checkout/shipping/" className="block">
        <Button className="w-full" size="lg">
          Proceed to Checkout
        </Button>
      </Link>
    </aside>
  );
}
