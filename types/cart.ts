import type { Customization } from "./customizer";

export interface ProductCartLine {
  kind: "product";
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  variantColorId?: string;
  variantColorName?: string;
  unitPriceCents: number;
  quantity: number;
  accentHex: string;
}

export interface CustomCartLine {
  kind: "custom";
  lineId: string;
  name: string;
  customization: Customization;
  unitPriceCents: number;
  basePriceCents: number;
  deltaCents: number;
  quantity: number;
}

export type CartLine = ProductCartLine | CustomCartLine;

export interface CartTotals {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  itemCount: number;
}
