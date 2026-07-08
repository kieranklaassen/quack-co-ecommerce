import { notFound } from "next/navigation";
import { getAllSlugs, getProductBySlug, products } from "@/lib/products";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-14 sm:px-6">
      <ProductDetail product={product} />
      {related.length > 0 ? (
        <section className="space-y-8">
          <h2 className="font-display text-3xl tracking-tight">Related</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
