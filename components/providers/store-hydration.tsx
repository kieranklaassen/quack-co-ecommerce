"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";

async function rehydrateStore(
  rehydrate: () => void | Promise<void>,
  onDone: () => void,
) {
  await Promise.resolve(rehydrate());
  onDone();
}

export function StoreHydration() {
  useEffect(() => {
    void rehydrateStore(
      () => useCartStore.persist.rehydrate(),
      () => useCartStore.getState().setHasHydrated(true),
    );
    void rehydrateStore(
      () => useCheckoutStore.persist.rehydrate(),
      () => useCheckoutStore.getState().setHasHydrated(true),
    );
  }, []);

  return null;
}
