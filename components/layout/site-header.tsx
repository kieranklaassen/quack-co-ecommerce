"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { cartTotals } from "@/lib/money";

const nav = [
  { href: "/shop/", label: "Shop" },
  { href: "/customize/", label: "Customize" },
  { href: "/about/", label: "About" },
];

export function SiteHeader() {
  const lines = useCartStore((s) => s.lines);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const count = hasHydrated ? cartTotals(lines).itemCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-2xl tracking-tight text-foreground">
          Quack &amp; Co.
        </Link>
        <nav className="hidden items-center gap-8 text-sm tracking-wide text-muted-foreground md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm text-muted-foreground md:hidden">
            <Link href="/shop/">Shop</Link>
            <Link href="/customize/">Customize</Link>
          </nav>
          <Link
            href="/cart/"
            className="relative inline-flex h-11 min-w-11 items-center justify-center rounded-sm border border-border px-3 transition-colors hover:bg-muted"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {hasHydrated && count > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
