export interface AccessoryOption {
  id: string;
  name: string;
  priceCents: number;
}

export interface AccessoryCategory {
  id: "hats" | "eyewear" | "neckwear";
  name: string;
  options: AccessoryOption[];
}

export interface FinishOption {
  id: string;
  name: string;
  priceCents: number;
}

export interface FontOption {
  id: string;
  name: string;
  cssClass: string;
}

export interface BaseColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface Customization {
  baseColorId: string;
  accessories: {
    hats: string;
    eyewear: string;
    neckwear: string;
  };
  finishId: string;
  engraving: string;
  fontId: string;
}
