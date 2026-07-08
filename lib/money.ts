import type { CartLine, CartTotals } from "@/types/cart";

export const TAX_BPS = 800;

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function cartTotals(lines: CartLine[]): CartTotals {
  const subtotalCents = lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.quantity,
    0,
  );
  const taxCents = Math.round((subtotalCents * TAX_BPS) / 10000);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    itemCount,
  };
}
