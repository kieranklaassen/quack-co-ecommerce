"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSchema, type ShippingFormValues } from "@/lib/validation";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "@/components/checkout/order-summary";

export function ShippingForm() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const cartHydrated = useCartStore((s) => s.hasHydrated);
  const draft = useCheckoutStore((s) => s.draft);
  const checkoutHydrated = useCheckoutStore((s) => s.hasHydrated);
  const setShipping = useCheckoutStore((s) => s.setShipping);
  const clearDraft = useCheckoutStore((s) => s.clearDraft);
  const guarded = useRef(false);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: draft.shipping,
  });

  useEffect(() => {
    if (checkoutHydrated) {
      form.reset(draft.shipping);
    }
  }, [checkoutHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!cartHydrated || !checkoutHydrated || guarded.current) return;
    guarded.current = true;
    if (lines.length === 0) {
      // Starting a fresh browse after an order: allow empty cart redirect,
      // but keep lastOrder for confirmation deep-links.
      clearDraft();
      router.replace("/cart/");
    } else if (useCheckoutStore.getState().lastOrder) {
      // New cart after a prior order — clear stale confirmation snapshot.
      useCheckoutStore.getState().setLastOrder(null);
    }
  }, [cartHydrated, checkoutHydrated, lines.length, router, clearDraft]);

  const onSubmit = form.handleSubmit((values) => {
    setShipping(values);
    router.push("/checkout/payment/");
  });

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <h1 className="font-display text-3xl tracking-tight">Shipping</h1>
        {(
          [
            ["fullName", "Full name", "name"],
            ["email", "Email", "email"],
            ["street", "Street address", "street-address"],
            ["city", "City", "address-level2"],
            ["state", "State", "address-level1"],
            ["zip", "ZIP / postal code", "postal-code"],
            ["country", "Country", "country-name"],
          ] as const
        ).map(([name, label, autoComplete]) => (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              autoComplete={autoComplete}
              type={name === "email" ? "email" : "text"}
              {...form.register(name)}
            />
            {form.formState.errors[name] ? (
              <p className="text-sm text-destructive">
                {form.formState.errors[name]?.message}
              </p>
            ) : null}
          </div>
        ))}
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Continue to Payment
        </Button>
      </form>
      <OrderSummary />
    </div>
  );
}
