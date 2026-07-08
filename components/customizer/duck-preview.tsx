"use client";

import type { Customization } from "@/types/customizer";
import {
  getAccessoryLabel,
  getBaseColor,
  getFinish,
  getFont,
} from "@/lib/customizer-options";
import { DuckSilhouette } from "@/components/shop/duck-silhouette";
import { cn } from "@/lib/utils";

export function DuckPreview({
  customization,
  className,
}: {
  customization: Customization;
  className?: string;
}) {
  const color = getBaseColor(customization.baseColorId);
  const finish = getFinish(customization.finishId);
  const font = getFont(customization.fontId);
  const hat = customization.accessories.hats;
  const eyewear = customization.accessories.eyewear;
  const neckwear = customization.accessories.neckwear;

  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden bg-muted",
        className,
      )}
    >
      <DuckSilhouette
        fill={color.hex}
        finish={finish.id}
        className="h-[72%] w-[72%]"
      />
      {hat !== "none" ? (
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 rounded-sm bg-foreground/90 px-2 py-1 text-[10px] uppercase tracking-wider text-background">
          {getAccessoryLabel("hats", hat)}
        </div>
      ) : null}
      {eyewear !== "none" ? (
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider text-foreground/80">
          {getAccessoryLabel("eyewear", eyewear)}
        </div>
      ) : null}
      {neckwear !== "none" ? (
        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 rounded-sm border border-border bg-background/80 px-2 py-1 text-[10px] uppercase tracking-wider">
          {getAccessoryLabel("neckwear", neckwear)}
        </div>
      ) : null}
      {customization.engraving.trim() ? (
        <p
          className={cn(
            "absolute bottom-[14%] left-1/2 max-w-[70%] -translate-x-1/2 truncate text-center text-sm text-foreground",
            font.cssClass,
          )}
        >
          {customization.engraving.trim()}
        </p>
      ) : null}
      <p className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {finish.name} finish
      </p>
    </div>
  );
}
