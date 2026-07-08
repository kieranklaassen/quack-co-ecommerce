"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { formatMoney } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { ProductSwatch } from "@/components/shop/duck-silhouette";

export function ProductCard({ product }: { product: Product }) {
  const addProduct = useCartStore((s) => s.addProduct);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    const defaultColor = product.colors?.[0];
    addProduct({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPriceCents: product.priceCents,
      accentHex: defaultColor?.hex ?? product.accentHex,
      variantColorId: defaultColor?.id,
      variantColorName: defaultColor?.name,
      quantity: 1,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col">
      <Link href={`/shop/${product.slug}/`} className="block overflow-hidden">
        <ProductSwatch product={product} />
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <Link href={`/shop/${product.slug}/`} className="font-display text-xl tracking-tight">
            {product.name}
          </Link>
          <span className="text-sm tabular-nums">{formatMoney(product.priceCents)}</span>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {product.category.replace("-", " ")}
        </p>
        <Button
          className="mt-auto w-full"
          variant="outline"
          onClick={onAdd}
          disabled={added}
        >
          {added ? "Added" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}
