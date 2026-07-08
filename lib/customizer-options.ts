import type {
  AccessoryCategory,
  BaseColorOption,
  Customization,
  FinishOption,
  FontOption,
} from "@/types/customizer";

export const CUSTOM_BASE_CENTS = 5500;
export const ENGRAVING_CENTS = 800;

export const baseColors: BaseColorOption[] = [
  { id: "ivory", name: "Ivory", hex: "#E8E0D4" },
  { id: "slate", name: "Slate", hex: "#6B7280" },
  { id: "oxblood", name: "Oxblood", hex: "#5C2A2A" },
  { id: "forest", name: "Forest", hex: "#3F5D4E" },
  { id: "brass", name: "Brass", hex: "#B08D57" },
  { id: "ink", name: "Ink", hex: "#1A1D23" },
];

export const accessoryCategories: AccessoryCategory[] = [
  {
    id: "hats",
    name: "Hats",
    options: [
      { id: "none", name: "None", priceCents: 0 },
      { id: "fedora", name: "Felt Fedora", priceCents: 1200 },
      { id: "beret", name: "Artist Beret", priceCents: 900 },
      { id: "top-hat", name: "Miniature Top Hat", priceCents: 1500 },
    ],
  },
  {
    id: "eyewear",
    name: "Eyewear",
    options: [
      { id: "none", name: "None", priceCents: 0 },
      { id: "spectacles", name: "Wire Spectacles", priceCents: 800 },
      { id: "sunglasses", name: "Tinted Frames", priceCents: 1000 },
      { id: "monocle", name: "Monocle", priceCents: 1100 },
    ],
  },
  {
    id: "neckwear",
    name: "Neckwear",
    options: [
      { id: "none", name: "None", priceCents: 0 },
      { id: "bow-tie", name: "Silk Bow Tie", priceCents: 700 },
      { id: "scarf", name: "Cashmere Scarf", priceCents: 1300 },
      { id: "collar", name: "Brass Collar", priceCents: 900 },
    ],
  },
];

export const finishes: FinishOption[] = [
  { id: "matte", name: "Matte", priceCents: 0 },
  { id: "glossy", name: "Glossy", priceCents: 500 },
  { id: "glitter", name: "Subtle Glitter", priceCents: 1200 },
];

export const fonts: FontOption[] = [
  { id: "serif", name: "Editorial Serif", cssClass: "font-display" },
  { id: "sans", name: "Refined Sans", cssClass: "font-sans" },
  { id: "mono", name: "Archive Mono", cssClass: "font-mono" },
];

export const defaultCustomization: Customization = {
  baseColorId: "ivory",
  accessories: {
    hats: "none",
    eyewear: "none",
    neckwear: "none",
  },
  finishId: "matte",
  engraving: "",
  fontId: "serif",
};

function optionPrice(
  categoryId: keyof Customization["accessories"],
  optionId: string,
): number {
  const category = accessoryCategories.find((c) => c.id === categoryId);
  return category?.options.find((o) => o.id === optionId)?.priceCents ?? 0;
}

export function calcCustomUnitPrice(customization: Customization): {
  unitPriceCents: number;
  basePriceCents: number;
  deltaCents: number;
} {
  const accessoryCents =
    optionPrice("hats", customization.accessories.hats) +
    optionPrice("eyewear", customization.accessories.eyewear) +
    optionPrice("neckwear", customization.accessories.neckwear);
  const finishCents =
    finishes.find((f) => f.id === customization.finishId)?.priceCents ?? 0;
  const engravingCents =
    customization.engraving.trim().length > 0 ? ENGRAVING_CENTS : 0;
  const deltaCents = accessoryCents + finishCents + engravingCents;
  return {
    basePriceCents: CUSTOM_BASE_CENTS,
    deltaCents,
    unitPriceCents: CUSTOM_BASE_CENTS + deltaCents,
  };
}

export function getBaseColor(id: string): BaseColorOption {
  return baseColors.find((c) => c.id === id) ?? baseColors[0];
}

export function getFinish(id: string): FinishOption {
  return finishes.find((f) => f.id === id) ?? finishes[0];
}

export function getFont(id: string): FontOption {
  return fonts.find((f) => f.id === id) ?? fonts[0];
}

export function getAccessoryLabel(
  categoryId: keyof Customization["accessories"],
  optionId: string,
): string {
  const category = accessoryCategories.find((c) => c.id === categoryId);
  return category?.options.find((o) => o.id === optionId)?.name ?? "None";
}

export const MAX_ENGRAVING_LENGTH = 20;
