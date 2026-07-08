import type { Product } from "@/types/product";

export function DuckSilhouette({
  fill,
  className = "",
  finish = "matte",
}: {
  fill: string;
  className?: string;
  finish?: string;
}) {
  const gloss =
    finish === "glossy"
      ? 0.35
      : finish === "glitter"
        ? 0.2
        : 0.08;

  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      role="img"
      aria-label="Rubber duck"
    >
      <ellipse cx="100" cy="145" rx="55" ry="8" fill="#00000012" />
      <path
        d="M42 98c0-28 22-52 58-52 18 0 28-18 46-18 16 0 28 12 28 28 0 10-5 18-12 23 18 8 28 22 28 40 0 28-32 42-78 42s-70-14-70-42c0-8 2-15 6-21z"
        fill={fill}
      />
      <ellipse cx="148" cy="62" rx="18" ry="14" fill={fill} />
      <path d="M162 62c8 0 16 4 18 10-6 2-12 2-18 0-4-1-6-5-6-8 0-1 2-2 6-2z" fill="#C4A574" />
      <circle cx="156" cy="56" r="3" fill="#1A1D23" />
      <ellipse
        cx="95"
        cy="88"
        rx="36"
        ry="18"
        fill={`rgba(255,255,255,${gloss})`}
      />
      {finish === "glitter" ? (
        <>
          <circle cx="70" cy="80" r="1.5" fill="#ffffffaa" />
          <circle cx="110" cy="95" r="1.2" fill="#ffffffaa" />
          <circle cx="88" cy="110" r="1.4" fill="#ffffffcc" />
          <circle cx="120" cy="78" r="1" fill="#ffffff99" />
        </>
      ) : null}
    </svg>
  );
}

export function ProductSwatch({ product }: { product: Product }) {
  return (
    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted">
      <DuckSilhouette
        fill={product.accentHex}
        className="h-[78%] w-[78%] animate-soft-float"
      />
    </div>
  );
}
