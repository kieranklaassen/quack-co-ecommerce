import { ShopCatalog } from "@/components/shop/shop-catalog";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 max-w-xl space-y-3">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Shop</h1>
        <p className="text-muted-foreground">
          Classic silhouettes, limited editions, and themed collections — priced
          for collectors, finished for quiet display.
        </p>
      </div>
      <ShopCatalog />
    </div>
  );
}
