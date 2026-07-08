"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const steps = [
  { href: "/checkout/shipping/", label: "Shipping", id: "shipping" },
  { href: "/checkout/payment/", label: "Payment", id: "payment" },
  { href: "/checkout/confirmation/", label: "Confirmation", id: "confirmation" },
];

export function CheckoutProgress() {
  const pathname = usePathname();
  const activeIndex = steps.findIndex((step) => pathname?.includes(step.id));

  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const done = index < activeIndex;
          const current = index === activeIndex;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-3">
              {done && index < 2 ? (
                <Link
                  href={step.href}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs text-background">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Step {index + 1} of 3
                    </span>
                    {step.label}
                  </span>
                </Link>
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-3 text-sm",
                    current ? "text-foreground" : "text-muted-foreground",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs",
                      current
                        ? "bg-foreground text-background"
                        : "border border-border",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.16em]">
                      Step {index + 1} of 3
                    </span>
                    {step.label}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
