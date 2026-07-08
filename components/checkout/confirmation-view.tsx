"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";

export function ConfirmationView() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const lastOrder = useCheckoutStore((s) => s.lastOrder);
  const checkoutHydrated = useCheckoutStore((s) => s.hasHydrated);
  const clearCart = useCartStore((s) => s.clearCart);
  const clearDraft = useCheckoutStore((s) => s.clearDraft);
  const cleared = useRef(false);

  useEffect(() => {
    if (!checkoutHydrated) return;
    if (!lastOrder) {
      router.replace("/shop/");
      return;
    }
    if (cleared.current) return;
    cleared.current = true;
    const cartMatchesOrder =
      lines.length === lastOrder.items.length &&
      lastOrder.items.every((item) => {
        const line = lines.find((l) => l.lineId === item.lineId);
        return line?.quantity === item.quantity;
      });
    if (cartMatchesOrder) {
      clearCart();
      clearDraft();
    }
  }, [checkoutHydrated, lastOrder, lines, router, clearCart, clearDraft]);

  if (!checkoutHydrated || !lastOrder) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading confirmation…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Order confirmed
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Thank you
        </h1>
        <p className="text-muted-foreground">
          Your order{" "}
          <span className="font-medium text-foreground">
            {lastOrder.orderNumber}
          </span>{" "}
          is being prepared with care.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3 rounded-sm border border-border p-6 text-sm">
          <h2 className="font-display text-xl">Shipping to</h2>
          <p>{lastOrder.shipping.fullName}</p>
          <p>{lastOrder.shipping.street}</p>
          <p>
            {lastOrder.shipping.city}, {lastOrder.shipping.state}{" "}
            {lastOrder.shipping.zip}
          </p>
          <p>{lastOrder.shipping.country}</p>
          <p className="text-muted-foreground">{lastOrder.shipping.email}</p>
        </div>
        <OrderSummary order={lastOrder} />
      </div>

      <ul className="space-y-3 border-t border-border pt-6 text-sm">
        {lastOrder.items.map((item) => (
          <li key={item.lineId}>
            <div className="flex justify-between gap-4">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="tabular-nums">
                {formatMoney(item.unitPriceCents * item.quantity)}
              </span>
            </div>
            {item.details ? (
              <p className="mt-1 text-muted-foreground">{item.details}</p>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="flex justify-center">
        <Link href="/shop/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
