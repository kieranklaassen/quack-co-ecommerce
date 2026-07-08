import { describe, expect, it } from "vitest";
import { cartTotals, formatMoney } from "@/lib/money";
import type { CartLine } from "@/types/cart";
import { calcCustomUnitPrice, defaultCustomization } from "@/lib/customizer-options";
import { getAllSlugs, products } from "@/lib/products";
import { paymentSchema, shippingSchema } from "@/lib/validation";

describe("money", () => {
  it("formats cents as USD", () => {
    expect(formatMoney(3200)).toBe("$32.00");
  });

  it("computes subtotal tax and total to the cent", () => {
    const lines: CartLine[] = [
      {
        kind: "product",
        lineId: "1",
        productId: "a",
        slug: "a",
        name: "A",
        unitPriceCents: 3200,
        quantity: 2,
        accentHex: "#000",
      },
      {
        kind: "custom",
        lineId: "2",
        name: "Custom",
        customization: defaultCustomization,
        unitPriceCents: 5500,
        basePriceCents: 5500,
        deltaCents: 0,
        quantity: 1,
      },
    ];
    const totals = cartTotals(lines);
    expect(totals.subtotalCents).toBe(11900);
    expect(totals.taxCents).toBe(952);
    expect(totals.totalCents).toBe(12852);
    expect(totals.itemCount).toBe(3);
  });

  it("returns zeros for empty cart", () => {
    expect(cartTotals([])).toEqual({
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
      itemCount: 0,
    });
  });
});

describe("customizer pricing", () => {
  it("adds accessory finish and engraving fees", () => {
    const priced = calcCustomUnitPrice({
      ...defaultCustomization,
      accessories: { hats: "fedora", eyewear: "none", neckwear: "bow-tie" },
      finishId: "glitter",
      engraving: "Ada",
    });
    expect(priced.basePriceCents).toBe(5500);
    expect(priced.deltaCents).toBe(1200 + 700 + 1200 + 800);
    expect(priced.unitPriceCents).toBe(5500 + priced.deltaCents);
  });

  it("skips engraving fee when text empty", () => {
    const priced = calcCustomUnitPrice({
      ...defaultCustomization,
      engraving: "   ",
    });
    expect(priced.deltaCents).toBe(0);
  });
});

describe("catalog", () => {
  it("has at least 6 products and matching slugs", () => {
    expect(products.length).toBeGreaterThanOrEqual(6);
    expect(getAllSlugs()).toHaveLength(products.length);
  });
});

describe("validation", () => {
  it("rejects invalid email", () => {
    const result = shippingSchema.safeParse({
      fullName: "Ada Lovelace",
      email: "not-an-email",
      street: "1 Analytical Engine Way",
      city: "London",
      state: "LDN",
      zip: "SW1A",
      country: "United Kingdom",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short card numbers", () => {
    const result = paymentSchema.safeParse({
      cardholderName: "Ada Lovelace",
      cardNumber: "1234",
      expiry: "12/30",
      cvv: "123",
      sameAsShipping: true,
      billing: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid payment with same as shipping", () => {
    const result = paymentSchema.safeParse({
      cardholderName: "Ada Lovelace",
      cardNumber: "4242424242424242",
      expiry: "12/30",
      cvv: "123",
      sameAsShipping: true,
      billing: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
      },
    });
    expect(result.success).toBe(true);
  });
});
