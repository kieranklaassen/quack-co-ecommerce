"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  detectCardBrand,
  paymentSchema,
  type PaymentFormValues,
} from "@/lib/validation";
import {
  getAccessoryLabel,
  getBaseColor,
  getFinish,
  getFont,
} from "@/lib/customizer-options";
import { cartTotals } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import {
  generateOrderNumber,
  useCheckoutStore,
} from "@/lib/checkout-store";
import type { LastOrder, OrderLineSnapshot } from "@/types/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "@/components/checkout/order-summary";

export function PaymentForm() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const cartHydrated = useCartStore((s) => s.hasHydrated);
  const draft = useCheckoutStore((s) => s.draft);
  const lastOrder = useCheckoutStore((s) => s.lastOrder);
  const checkoutHydrated = useCheckoutStore((s) => s.hasHydrated);
  const setBilling = useCheckoutStore((s) => s.setBilling);
  const setSameAsShipping = useCheckoutStore((s) => s.setSameAsShipping);
  const setPaymentMeta = useCheckoutStore((s) => s.setPaymentMeta);
  const setLastOrder = useCheckoutStore((s) => s.setLastOrder);
  const [pending, setPending] = useState(false);
  const guarded = useRef(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      sameAsShipping: draft.sameAsShipping,
      billing: {
        street: draft.billing.street,
        city: draft.billing.city,
        state: draft.billing.state,
        zip: draft.billing.zip,
        country: draft.billing.country || "United States",
      },
    },
  });

  const sameAsShipping = form.watch("sameAsShipping");

  useEffect(() => {
    if (!checkoutHydrated || !cartHydrated) return;
    // Back-nav after order: empty cart + existing order → confirmation.
    // New cart with leftover lastOrder must continue checkout.
    if (lastOrder && lines.length === 0) {
      router.replace("/checkout/confirmation/");
    }
  }, [checkoutHydrated, cartHydrated, lastOrder, lines.length, router]);

  useEffect(() => {
    if (!cartHydrated || !checkoutHydrated || guarded.current) return;
    guarded.current = true;
    if (lines.length === 0 && !useCheckoutStore.getState().lastOrder) {
      router.replace("/cart/");
    }
  }, [cartHydrated, checkoutHydrated, lines.length, router]);

  useEffect(() => {
    if (!checkoutHydrated) return;
    if (!draft.shipping.email && lines.length > 0) {
      router.replace("/checkout/shipping/");
    }
  }, [checkoutHydrated, draft.shipping.email, lines.length, router]);

  useEffect(() => {
    if (!checkoutHydrated) return;
    form.reset({
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      sameAsShipping: draft.sameAsShipping,
      billing: {
        street: draft.billing.street,
        city: draft.billing.city,
        state: draft.billing.state,
        zip: draft.billing.zip,
        country: draft.billing.country || "United States",
      },
    });
  }, [checkoutHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = form.handleSubmit(async (values) => {
    if (pending) return;
    setPending(true);
    await new Promise((r) => setTimeout(r, 500));

    const billing = values.sameAsShipping
      ? { ...draft.shipping }
      : {
          fullName: draft.shipping.fullName,
          email: draft.shipping.email,
          street: values.billing.street ?? "",
          city: values.billing.city ?? "",
          state: values.billing.state ?? "",
          zip: values.billing.zip ?? "",
          country: values.billing.country ?? "United States",
        };

    const digits = values.cardNumber.replace(/\s+/g, "");
    const brand = detectCardBrand(digits);
    const last4 = digits.slice(-4);
    const totals = cartTotals(lines);
    const items: OrderLineSnapshot[] = lines.map((line) => {
      if (line.kind === "custom") {
        const c = line.customization;
        return {
          lineId: line.lineId,
          kind: "custom",
          name: line.name,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          details: [
            getBaseColor(c.baseColorId).name,
            getFinish(c.finishId).name,
            `Hat: ${getAccessoryLabel("hats", c.accessories.hats)}`,
            `Eyewear: ${getAccessoryLabel("eyewear", c.accessories.eyewear)}`,
            `Neckwear: ${getAccessoryLabel("neckwear", c.accessories.neckwear)}`,
            c.engraving.trim()
              ? `Engraving: ${c.engraving} (${getFont(c.fontId).name})`
              : null,
          ]
            .filter(Boolean)
            .join(" · "),
        };
      }
      return {
        lineId: line.lineId,
        kind: "product",
        name: line.name,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
        details: line.variantColorName
          ? `Color: ${line.variantColorName}`
          : undefined,
      };
    });

    const order: LastOrder = {
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      shipping: draft.shipping,
      items,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
    };

    try {
      const nextDraft = {
        shipping: draft.shipping,
        billing,
        sameAsShipping: values.sameAsShipping,
        cardBrand: brand,
        last4,
      };
      localStorage.setItem(
        "quack-checkout-v1",
        JSON.stringify({
          state: {
            draft: nextDraft,
            lastOrder: order,
          },
          version: 0,
        }),
      );
      setSameAsShipping(values.sameAsShipping);
      setBilling(billing);
      setPaymentMeta({
        cardBrand: brand,
        last4,
        cardholderName: values.cardholderName,
      });
      setLastOrder(order);
    } catch {
      setPending(false);
      return;
    }

    router.push("/checkout/confirmation/");
  });

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl tracking-tight">Payment</h1>
          <Link href="/checkout/shipping/" className="text-sm text-muted-foreground underline">
            Back
          </Link>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholderName">Name on card</Label>
          <Input
            id="cardholderName"
            autoComplete="cc-name"
            {...form.register("cardholderName")}
          />
          {form.formState.errors.cardholderName ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.cardholderName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card number</Label>
          <Input
            id="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            {...form.register("cardNumber")}
          />
          {form.formState.errors.cardNumber ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.cardNumber.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry (MM/YY)</Label>
            <Input
              id="expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="12/28"
              {...form.register("expiry")}
            />
            {form.formState.errors.expiry ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.expiry.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              inputMode="numeric"
              autoComplete="cc-csc"
              {...form.register("cvv")}
            />
            {form.formState.errors.cvv ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.cvv.message}
              </p>
            ) : null}
          </div>
        </div>

        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            {...form.register("sameAsShipping")}
          />
          Billing address same as shipping
        </label>

        {!sameAsShipping ? (
          <div className="space-y-4 rounded-sm border border-border p-4">
            {(
              [
                ["billing.street", "Street", "street-address"],
                ["billing.city", "City", "address-level2"],
                ["billing.state", "State", "address-level1"],
                ["billing.zip", "ZIP", "postal-code"],
                ["billing.country", "Country", "country-name"],
              ] as const
            ).map(([name, label, autoComplete]) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  autoComplete={autoComplete}
                  {...form.register(name)}
                />
              </div>
            ))}
            {form.formState.errors.billing ? (
              <p className="text-sm text-destructive">
                Complete all billing address fields.
              </p>
            ) : null}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Placing order…" : "Place Order"}
        </Button>
      </form>
      <OrderSummary />
    </div>
  );
}
