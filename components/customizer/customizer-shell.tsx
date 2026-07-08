"use client";

import { useMemo, useState } from "react";
import type { Customization } from "@/types/customizer";
import {
  MAX_ENGRAVING_LENGTH,
  accessoryCategories,
  baseColors,
  calcCustomUnitPrice,
  defaultCustomization,
  finishes,
  fonts,
  getAccessoryLabel,
  getBaseColor,
  getFinish,
  getFont,
} from "@/lib/customizer-options";
import { formatMoney } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import { DuckPreview } from "@/components/customizer/duck-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function CustomizerShell() {
  const [customization, setCustomization] =
    useState<Customization>(defaultCustomization);
  const [added, setAdded] = useState(false);
  const addCustom = useCartStore((s) => s.addCustom);

  const pricing = useMemo(
    () => calcCustomUnitPrice(customization),
    [customization],
  );

  const update = (patch: Partial<Customization>) => {
    setCustomization((prev) => ({ ...prev, ...patch }));
  };

  const updateAccessory = (
    key: keyof Customization["accessories"],
    value: string,
  ) => {
    setCustomization((prev) => ({
      ...prev,
      accessories: { ...prev.accessories, [key]: value },
    }));
  };

  const onAdd = () => {
    addCustom({
      customization: {
        ...customization,
        accessories: { ...customization.accessories },
        engraving: customization.engraving.trim().slice(0, MAX_ENGRAVING_LENGTH),
      },
      ...pricing,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <DuckPreview customization={customization} />
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Bespoke Duck</h1>
          <p className="mt-2 text-muted-foreground">
            Compose a collectible. Live preview updates with every choice.
          </p>
        </div>

        <section className="space-y-3">
          <Label>Base color</Label>
          <div className="flex flex-wrap gap-2">
            {baseColors.map((color) => (
              <button
                key={color.id}
                type="button"
                aria-label={color.name}
                onClick={() => update({ baseColorId: color.id })}
                className={cn(
                  "flex h-11 min-w-11 items-center gap-2 rounded-sm border px-3 text-sm",
                  customization.baseColorId === color.id
                    ? "border-foreground"
                    : "border-border",
                )}
              >
                <span
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ background: color.hex }}
                />
                {color.name}
              </button>
            ))}
          </div>
        </section>

        {accessoryCategories.map((category) => (
          <section key={category.id} className="space-y-3">
            <Label>{category.name}</Label>
            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateAccessory(category.id, option.id)}
                  className={cn(
                    "min-h-11 rounded-sm border px-3 text-sm",
                    customization.accessories[category.id] === option.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {option.name}
                  {option.priceCents > 0
                    ? ` · ${formatMoney(option.priceCents)}`
                    : ""}
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className="space-y-3">
          <Label>Finish</Label>
          <div className="flex flex-wrap gap-2">
            {finishes.map((finish) => (
              <button
                key={finish.id}
                type="button"
                onClick={() => update({ finishId: finish.id })}
                className={cn(
                  "min-h-11 rounded-sm border px-3 text-sm",
                  customization.finishId === finish.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground",
                )}
              >
                {finish.name}
                {finish.priceCents > 0
                  ? ` · ${formatMoney(finish.priceCents)}`
                  : ""}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <Label htmlFor="engraving">Engraving</Label>
          <Input
            id="engraving"
            value={customization.engraving}
            maxLength={MAX_ENGRAVING_LENGTH}
            placeholder="Name or short phrase"
            onChange={(e) =>
              update({
                engraving: e.target.value.slice(0, MAX_ENGRAVING_LENGTH),
              })
            }
          />
          <p className="text-xs text-muted-foreground">
            {customization.engraving.length}/{MAX_ENGRAVING_LENGTH}
            {customization.engraving.trim()
              ? ` · +${formatMoney(800)} engraving`
              : ""}
          </p>
        </section>

        <section className="space-y-3">
          <Label>Engraving style</Label>
          <div className="flex flex-wrap gap-2">
            {fonts.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => update({ fontId: font.id })}
                className={cn(
                  "min-h-11 rounded-sm border px-3 text-sm",
                  font.cssClass,
                  customization.fontId === font.id
                    ? "border-foreground"
                    : "border-border text-muted-foreground",
                )}
              >
                {font.name}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-4 border-t border-border pt-6">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              Base {getBaseColor(customization.baseColorId).name} ·{" "}
              {getFinish(customization.finishId).name} ·{" "}
              {getFont(customization.fontId).name}
            </p>
            <p>
              Hats: {getAccessoryLabel("hats", customization.accessories.hats)} ·
              Eyewear:{" "}
              {getAccessoryLabel("eyewear", customization.accessories.eyewear)} ·
              Neckwear:{" "}
              {getAccessoryLabel("neckwear", customization.accessories.neckwear)}
            </p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Total
              </p>
              <p className="font-display text-3xl tabular-nums">
                {formatMoney(pricing.unitPriceCents)}
              </p>
              {pricing.deltaCents > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Includes {formatMoney(pricing.deltaCents)} in options
                </p>
              ) : null}
            </div>
            <Button size="lg" onClick={onAdd} disabled={added}>
              {added ? "Added to Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
