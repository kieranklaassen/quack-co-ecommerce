export type ProductCategory = "classic" | "limited" | "themed";

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  category: ProductCategory;
  featured?: boolean;
  colors?: ProductColor[];
  accentHex: string;
}
