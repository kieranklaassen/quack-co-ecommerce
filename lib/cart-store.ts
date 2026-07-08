"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, CustomCartLine, ProductCartLine } from "@/types/cart";
import type { Customization } from "@/types/customizer";

function newLineId(): string {
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

interface CartState {
  lines: CartLine[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addProduct: (input: Omit<ProductCartLine, "kind" | "lineId" | "quantity"> & { quantity?: number }) => void;
  addCustom: (input: {
    customization: Customization;
    unitPriceCents: number;
    basePriceCents: number;
    deltaCents: number;
  }) => void;
  setQty: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addProduct: (input) => {
        const quantity = Math.min(99, Math.max(1, input.quantity ?? 1));
        set((state) => {
          const existing = state.lines.find(
            (line): line is ProductCartLine =>
              line.kind === "product" &&
              line.productId === input.productId &&
              line.variantColorId === input.variantColorId,
          );
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.lineId === existing.lineId
                  ? {
                      ...line,
                      quantity: Math.min(99, line.quantity + quantity),
                    }
                  : line,
              ),
            };
          }
          const line: ProductCartLine = {
            kind: "product",
            lineId: newLineId(),
            productId: input.productId,
            slug: input.slug,
            name: input.name,
            variantColorId: input.variantColorId,
            variantColorName: input.variantColorName,
            unitPriceCents: input.unitPriceCents,
            quantity,
            accentHex: input.accentHex,
          };
          return { lines: [...state.lines, line] };
        });
      },
      addCustom: (input) => {
        const line: CustomCartLine = {
          kind: "custom",
          lineId: newLineId(),
          name: "Bespoke Quack & Co. Duck",
          customization: { ...input.customization, accessories: { ...input.customization.accessories } },
          unitPriceCents: input.unitPriceCents,
          basePriceCents: input.basePriceCents,
          deltaCents: input.deltaCents,
          quantity: 1,
        };
        set((state) => ({ lines: [...state.lines, line] }));
      },
      setQty: (lineId, quantity) => {
        const next = Math.min(99, Math.max(1, quantity));
        set((state) => ({
          lines: state.lines.map((line) =>
            line.lineId === lineId ? { ...line, quantity: next } : line,
          ),
        }));
      },
      removeLine: (lineId) => {
        set((state) => ({
          lines: state.lines.filter((line) => line.lineId !== lineId),
        }));
      },
      clearCart: () => set({ lines: [] }),
    }),
    {
      name: "quack-cart-v1",
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
