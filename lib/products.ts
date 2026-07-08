import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "prod-classic-ivory",
    slug: "classic-ivory",
    name: "Classic Ivory",
    description:
      "Our signature collectible in warm ivory lacquer. Hand-finished beak, weighted keel for a poised float, and a satin sheen that reads quietly luxurious.",
    priceCents: 3200,
    category: "classic",
    featured: true,
    accentHex: "#E8E0D4",
    colors: [
      { id: "ivory", name: "Ivory", hex: "#E8E0D4" },
      { id: "bone", name: "Bone", hex: "#D9D0C3" },
      { id: "slate", name: "Slate", hex: "#6B7280" },
    ],
  },
  {
    id: "prod-midnight-keel",
    slug: "midnight-keel",
    name: "Midnight Keel",
    description:
      "Deep charcoal body with a brushed graphite beak. A restrained classic for collectors who prefer ink over sunshine.",
    priceCents: 3800,
    category: "classic",
    featured: true,
    accentHex: "#2A2E35",
    colors: [
      { id: "charcoal", name: "Charcoal", hex: "#2A2E35" },
      { id: "ink", name: "Ink", hex: "#1A1D23" },
    ],
  },
  {
    id: "prod-atelier-umber",
    slug: "atelier-umber",
    name: "Atelier Umber",
    description:
      "Studio-edition umber with a soft matte shell. Limited run of numbered pieces, each inspected under daylight lamps.",
    priceCents: 7200,
    category: "limited",
    featured: true,
    accentHex: "#6B4F3A",
  },
  {
    id: "prod-brass-edition",
    slug: "brass-edition",
    name: "Brass Edition",
    description:
      "Warm brass-toned finish with a polished beak tip. A limited homage to mid-century desk objects — not a toy, a presence.",
    priceCents: 8800,
    category: "limited",
    accentHex: "#B08D57",
  },
  {
    id: "prod-alpine-mist",
    slug: "alpine-mist",
    name: "Alpine Mist",
    description:
      "Themed for high-altitude calm: cool mist body, glacier-blue accents, and a quiet silhouette suited to shelf display.",
    priceCents: 4500,
    category: "themed",
    featured: true,
    accentHex: "#A8B5C4",
  },
  {
    id: "prod-library-green",
    slug: "library-green",
    name: "Library Green",
    description:
      "Forest-green shell inspired by leather-bound volumes. Subtle gold-tone eye detail; made for reading nooks and quiet desks.",
    priceCents: 5200,
    category: "themed",
    accentHex: "#3F5D4E",
  },
  {
    id: "prod-porcelain-blush",
    slug: "porcelain-blush",
    name: "Porcelain Blush",
    description:
      "A classic soft-blush porcelain tone with a refined gloss. Everyday elegance for the discerning duck enthusiast.",
    priceCents: 2900,
    category: "classic",
    accentHex: "#D4B5AE",
    colors: [
      { id: "blush", name: "Blush", hex: "#D4B5AE" },
      { id: "rose", name: "Rose Clay", hex: "#C4A09A" },
    ],
  },
  {
    id: "prod-noir-reserve",
    slug: "noir-reserve",
    name: "Noir Reserve",
    description:
      "Ultra-limited matte black with a single silver keel stripe. Numbered certificate included. For serious collectors only.",
    priceCents: 11000,
    category: "limited",
    accentHex: "#111111",
  },
];

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(
  category: Product["category"] | "all",
): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}
