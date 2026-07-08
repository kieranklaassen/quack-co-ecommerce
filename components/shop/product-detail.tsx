"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { formatMoney } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { DuckSilhouette } from "@/components/shop/duck-silhouette";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const addProduct = useCartStore((s) => s.addProduct);
  const [colorId, setColorId] = useState(product.colors?.[0]?.id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedColor =
    product.colors?.find((c) => c.id === colorId) ?? product.colors?.[0];
  const fill = selectedColor?.hex ?? product.accentHex;

  const onAdd = () => {
    addProduct({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPriceCents: product.priceCents,
      accentHex: fill,
      variantColorId: selectedColor?.id,
      variantColorName: selectedColor?.name,
      quantity: qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex aspect-square items-center justify-center bg-muted">
        <DuckSilhouette fill={fill} className="h-[70%] w-[70%]" />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg tabular-nums">{formatMoney(product.priceCents)}</p>
        </div>
        <p className="max-w-prose text-muted-foreground leading-relaxed">
          {product.description}
        </p>
        {product.colors && product.colors.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setColorId(color.id)}
                  className={cn(
                    "min-h-11 rounded-sm border px-4 text-sm",
                    colorId === color.id
                      ? "border-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  <span
                    className="mr-2 inline-block h-3 w-3 rounded-full border border-border"
                    style={{ background: color.hex }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="space-y-3">
          <p className="text-sm font-medium">Quantity</p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </Button>
            <span className="w-8 text-center tabular-nums">{qty}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
            >
              +
            </Button>
          </div>
        </div>
        <Button size="lg" onClick={onAdd} disabled={added}>
          {added ? "Added to Cart" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
