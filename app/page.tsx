import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { formatMoney } from "@/lib/money";
import { ProductSwatch } from "@/components/shop/duck-silhouette";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Quiet craft",
    body: "Each duck is finished by hand with restrained color and a weighted keel for presence on shelf or water.",
  },
  {
    title: "Bespoke options",
    body: "Compose finishes, accessories, and engraving — a collectible made for one collector.",
  },
  {
    title: "Limited editions",
    body: "Numbered runs and atelier pieces for those who prefer scarcity over spectacle.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ebe7e0_0%,_#f7f6f3_55%,_#f7f6f3_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="animate-fade-up space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Quack &amp; Co.
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              The Bentley of rubber ducks
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Premium artisan collectibles for discerning enthusiasts. Minimal,
              considered, quietly playful.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop/">
                <Button size="lg">Shop the collection</Button>
              </Link>
              <Link href="/customize/">
                <Button size="lg" variant="outline">
                  Customize a duck
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md animate-fade-up bg-muted">
            <ProductSwatch product={featured[0]} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Featured
          </h2>
          <Link href="/shop/" className="text-sm text-muted-foreground underline">
            View all
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}/`} className="group">
              <ProductSwatch product={product} />
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl group-hover:underline">
                  {product.name}
                </h3>
                <span className="text-sm tabular-nums">
                  {formatMoney(product.priceCents)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="space-y-3">
              <h2 className="font-display text-2xl tracking-tight">
                {value.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
