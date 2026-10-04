import { mode } from "./mode";

/** Role -> swatch (gaps D4). Only `theme/` names raw swatches. */
export const ROLE_SWATCH = {
  primary: "coral",
  secondary: "cornflower",
  success: "mint",
  warning: "goldenrod",
  danger: "rose",
  info: "seafoam",
  accent: "blush",
} as const;

export type Role = keyof typeof ROLE_SWATCH;

/** Dark ink that keeps bright pastel fills readable (AA). */
export const INK = "#2A1218";

const ref = (swatch: string, stop: number) => `{colors.${swatch}.${stop}}`;

function slots(swatch: string) {
  return {
    solid: mode(ref(swatch, 500), ref(swatch, 400)),
    contrast: mode(INK, INK),
    fg: mode(ref(swatch, 800), ref(swatch, 200)),
    muted: mode(ref(swatch, 100), ref(swatch, 900)),
    subtle: mode(ref(swatch, 50), ref(swatch, 950)),
    emphasized: mode(ref(swatch, 200), ref(swatch, 800)),
    focusRing: mode(ref(swatch, 500), ref(swatch, 400)),
  };
}

/** Role palettes usable as `colorPalette="primary"` etc. */
export const rolePalettes = Object.fromEntries(
  Object.entries(ROLE_SWATCH).map(([role, swatch]) => [role, slots(swatch)]),
) as Record<Role, ReturnType<typeof slots>>;
