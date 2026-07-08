"use client";

import { useState } from "react";
import Link from "next/link";
import type { CartLine } from "@/types/cart";
import {
  getAccessoryLabel,
  getBaseColor,
  getFinish,
  getFont,
} from "@/lib/customizer-options";
import { formatMoney } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import { DuckPreview } from "@/components/customizer/duck-preview";
import { DuckSilhouette } from "@/components/shop/duck-silhouette";
import { Button } from "@/components/ui/button";

function CustomDetails({ line }: { line: Extract<CartLine, { kind: "custom" }> }) {
  const c = line.customization;
  return (
    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
      <li>Color: {getBaseColor(c.baseColorId).name}</li>
      <li>Finish: {getFinish(c.finishId).name}</li>
      <li>Hat: {getAccessoryLabel("hats", c.accessories.hats)}</li>
      <li>Eyewear: {getAccessoryLabel("eyewear", c.accessories.eyewear)}</li>
      <li>Neckwear: {getAccessoryLabel("neckwear", c.accessories.neckwear)}</li>
      <li>
        Engraving: {c.engraving.trim() || "—"} ({getFont(c.fontId).name})
      </li>
      <li>Options: {formatMoney(line.deltaCents)}</li>
    </ul>
  );
}

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const setQty = useCartStore((s) => s.setQty);
  const removeLine = useCartStore((s) => s.removeLine);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  if (!hasHydrated) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading cart…</div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="space-y-6 py-16 text-center">
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <p className="text-muted-foreground">Browse the collection or compose a bespoke duck.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/shop/">
            <Button>Shop</Button>
          </Link>
          <Link href="/customize/">
            <Button variant="outline">Customize</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="divide-y divide-border border-y border-border">
        {lines.map((line) => (
          <li key={line.lineId} className="grid gap-4 py-6 sm:grid-cols-[120px_1fr_auto]">
            <div className="h-[120px] w-[120px] overflow-hidden bg-muted">
              {line.kind === "custom" ? (
                <DuckPreview customization={line.customization} className="h-full w-full" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <DuckSilhouette fill={line.accentHex} className="h-20 w-20" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl">{line.name}</h2>
              {line.kind === "product" && line.variantColorName ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Color: {line.variantColorName}
                </p>
              ) : null}
              {line.kind === "custom" ? <CustomDetails line={line} /> : null}
              <div className="mt-4 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Decrease quantity"
                  onClick={() => setQty(line.lineId, line.quantity - 1)}
                  disabled={line.quantity <= 1}
                >
                  −
                </Button>
                <span className="w-8 text-center tabular-nums">{line.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Increase quantity"
                  onClick={() => setQty(line.lineId, line.quantity + 1)}
                >
                  +
                </Button>
                {pendingRemove === line.lineId ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span>Remove?</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        removeLine(line.lineId);
                        setPendingRemove(null);
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPendingRemove(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingRemove(line.lineId)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <p className="text-right tabular-nums">
              {formatMoney(line.unitPriceCents * line.quantity)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
