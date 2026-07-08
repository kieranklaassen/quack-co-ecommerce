import { CartView } from "@/components/cart/cart-view";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="mb-10 font-display text-4xl tracking-tight sm:text-5xl">
        Cart
      </h1>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <CartView />
        <CartSummary />
      </div>
    </div>
  );
}
