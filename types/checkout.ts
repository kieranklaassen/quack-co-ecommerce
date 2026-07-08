export interface Address {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutDraft {
  shipping: Address;
  billing: Address;
  sameAsShipping: boolean;
  cardBrand?: string;
  last4?: string;
  cardholderName?: string;
}

export interface OrderLineSnapshot {
  lineId: string;
  kind: "product" | "custom";
  name: string;
  quantity: number;
  unitPriceCents: number;
  details?: string;
}

export interface LastOrder {
  orderNumber: string;
  createdAt: string;
  shipping: Address;
  items: OrderLineSnapshot[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}
