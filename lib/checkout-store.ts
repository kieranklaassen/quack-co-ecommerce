"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, CheckoutDraft, LastOrder } from "@/types/checkout";

export const emptyAddress: Address = {
  fullName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
};

const emptyDraft: CheckoutDraft = {
  shipping: { ...emptyAddress },
  billing: { ...emptyAddress },
  sameAsShipping: true,
};

interface CheckoutState {
  draft: CheckoutDraft;
  lastOrder: LastOrder | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setShipping: (shipping: Address) => void;
  setBilling: (billing: Address) => void;
  setSameAsShipping: (value: boolean) => void;
  setPaymentMeta: (meta: { cardBrand?: string; last4?: string; cardholderName?: string }) => void;
  setLastOrder: (order: LastOrder | null) => void;
  clearDraft: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      draft: emptyDraft,
      lastOrder: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setShipping: (shipping) =>
        set((state) => ({
          draft: { ...state.draft, shipping },
        })),
      setBilling: (billing) =>
        set((state) => ({
          draft: { ...state.draft, billing },
        })),
      setSameAsShipping: (sameAsShipping) =>
        set((state) => ({
          draft: { ...state.draft, sameAsShipping },
        })),
      setPaymentMeta: (meta) =>
        set((state) => ({
          draft: {
            ...state.draft,
            cardBrand: meta.cardBrand,
            last4: meta.last4,
            cardholderName: meta.cardholderName,
          },
        })),
      setLastOrder: (lastOrder) => set({ lastOrder }),
      clearDraft: () =>
        set({
          draft: {
            shipping: { ...emptyAddress },
            billing: { ...emptyAddress },
            sameAsShipping: true,
          },
        }),
    }),
    {
      name: "quack-checkout-v1",
      skipHydration: true,
      partialize: (state) => ({
        draft: {
          shipping: state.draft.shipping,
          billing: state.draft.billing,
          sameAsShipping: state.draft.sameAsShipping,
          cardBrand: state.draft.cardBrand,
          last4: state.draft.last4,
        },
        lastOrder: state.lastOrder,
      }),
    },
  ),
);

export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QC-${stamp}-${rand}`;
}
