"use client";

import { useMemo, useState } from "react";
import type { ProductCategory } from "@/types/product";
import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/shop/product-card";
import { cn } from "@/lib/utils";

const tabs: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "classic", label: "Classic" },
  { id: "limited", label: "Limited Edition" },
  { id: "themed", label: "Themed" },
];

export function ShopCatalog() {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const items = useMemo(() => getProductsByCategory(category), [category]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={cn(
              "min-h-11 rounded-sm border px-4 text-sm transition-colors",
              category === tab.id
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
          <p>No ducks in this collection.</p>
          <button
            type="button"
            className="mt-4 text-foreground underline"
            onClick={() => setCategory("all")}
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
